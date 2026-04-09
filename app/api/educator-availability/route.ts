import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

type SlotPayload = {
  educator_id: string;
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

function toUtcIso(
  dateStr: string,
  timeStr: string,
  timeZone: string
): string {
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

export async function GET(request: Request) {
  try {
    const supabase = getAdminClient();
    const { searchParams } = new URL(request.url);
    const educatorId = searchParams.get("educator_id");

    let query = supabase
      .from("availability_slots")
      .select(
        "id, educator_id, slot_date, start_time, end_time, timezone, status, source, start_at_utc, end_at_utc, created_at"
      )
      .order("slot_date", { ascending: true })
      .order("start_time", { ascending: true });

    if (educatorId) {
      query = query.eq("educator_id", educatorId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
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
    const body = (await request.json()) as SlotPayload;

    if (
      !body.educator_id ||
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
        educator_id: body.educator_id,
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
      educator_id: body.educator_id,
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

    return NextResponse.json({ data, period });
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