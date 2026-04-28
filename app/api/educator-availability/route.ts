import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  if (!serviceRoleKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

async function getAuthClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // safe to ignore
          }
        },
      },
    }
  );
}

type SlotPayload = {
  timezone: string;
  period_label: "period_1" | "period_2" | "short_notice";
  year: number;
  month: number;
  start_date: string;
  end_date: string;
  slots: Array<{
    slot_date: string;
    start_time: string;
    end_time: string;
    source: "planned" | "short_notice";
  }>;
};

function toUtcIso(dateStr: string, timeStr: string, timeZone: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);

  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(utcGuess);
  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));

  const tzAsUtc = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    Number(map.hour),
    Number(map.minute),
    Number(map.second)
  );

  const desiredUtc = Date.UTC(year, month - 1, day, hour, minute, 0);
  const offset = desiredUtc - tzAsUtc;

  return new Date(utcGuess.getTime() + offset).toISOString();
}

async function getLoggedInApprovedEducator() {
  const authClient = await getAuthClient();

  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user?.email) {
    return {
      educator: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const supabase = getAdminClient();

  const { data: educator, error } = await supabase
    .from("educator_directory")
    .select("id, full_name, email, timezone, approval_status, is_public")
    .eq("email", user.email.toLowerCase())
    .maybeSingle();

  if (error || !educator) {
    return {
      educator: null,
      response: NextResponse.json(
        { error: "Approved educator profile not found." },
        { status: 404 }
      ),
    };
  }

  if (educator.approval_status !== "approved" || educator.is_public !== true) {
    return {
      educator: null,
      response: NextResponse.json(
        {
          error:
            "Your educator profile must be approved before you can manage availability.",
        },
        { status: 403 }
      ),
    };
  }

  return { educator, response: null };
}

export async function GET() {
  try {
    const { educator, response } = await getLoggedInApprovedEducator();

    if (!educator) {
      return response;
    }

    const supabase = getAdminClient();

    const { data, error } = await supabase
      .from("availability_slots")
      .select(
        "id, educator_id, slot_date, start_time, end_time, timezone, status, source, start_at_utc, end_at_utc, created_at"
      )
      .eq("educator_id", educator.id)
      .order("slot_date", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      educator,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to load availability",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { educator, response } = await getLoggedInApprovedEducator();

    if (!educator) {
      return response;
    }

    const body = (await request.json()) as SlotPayload;

    if (
      !body.timezone ||
      !body.period_label ||
      !body.year ||
      !body.month ||
      !body.start_date ||
      !body.end_date ||
      !Array.isArray(body.slots) ||
      body.slots.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required availability payload fields" },
        { status: 400 }
      );
    }

    const supabase = getAdminClient();

    const { data: period, error: periodError } = await supabase
      .from("availability_periods")
      .insert({
        educator_id: educator.id,
        year: body.year,
        month: body.month,
        period_label: body.period_label,
        start_date: body.start_date,
        end_date: body.end_date,
        timezone: body.timezone,
        status: "submitted",
      })
      .select()
      .single();

    if (periodError) {
      return NextResponse.json({ error: periodError.message }, { status: 500 });
    }

    const rows = body.slots.map((slot) => ({
      educator_id: educator.id,
      period_id: period.id,
      slot_date: slot.slot_date,
      start_time: slot.start_time,
      end_time: slot.end_time,
      timezone: body.timezone,
      status: "available",
      source: slot.source,
      start_at_utc: toUtcIso(slot.slot_date, slot.start_time, body.timezone),
      end_at_utc: toUtcIso(slot.slot_date, slot.end_time, body.timezone),
    }));

    const { data, error } = await supabase
      .from("availability_slots")
      .upsert(rows, {
        onConflict: "educator_id,slot_date,start_time,end_time",
      })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data, period, educator });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to save availability",
      },
      { status: 500 }
    );
  }
}