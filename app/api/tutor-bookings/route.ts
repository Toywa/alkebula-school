import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    }
  );
}

async function getAuthClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );
}

async function requireApprovedTutor() {
  const auth = await getAuthClient();
  const {
    data: { user },
  } = await auth.auth.getUser();

  if (!user?.email) {
    return {
      ok: false,
      res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const supabase = getAdminClient();

  const { data: tutor } = await supabase
    .from("educator_directory")
    .select("*")
    .eq("email", user.email.toLowerCase())
    .single();

  if (!tutor) {
    return {
      ok: false,
      res: NextResponse.json({ error: "Tutor not found" }, { status: 404 }),
    };
  }

  if (tutor.approval_status !== "approved") {
    return {
      ok: false,
      res: NextResponse.json(
        { error: "Tutor not approved" },
        { status: 403 }
      ),
    };
  }

  return { ok: true, tutor };
}

// GET BOOKINGS (SECURE)
export async function GET() {
  const check = await requireApprovedTutor();
  if (!check.ok) return check.res;

  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from("lesson_bookings")
    .select(
      `
      *,
      lesson_invoices (*)
    `
    )
    .eq("educator_id", check.tutor.id)
    .order("booking_date", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ bookings: data });
}

// ACTIONS
export async function PATCH(req: Request) {
  const check = await requireApprovedTutor();
  if (!check.ok) return check.res;

  const body = await req.json();
  const supabase = getAdminClient();

  if (body.action === "accept") {
    await supabase
      .from("lesson_bookings")
      .update({
        tutor_confirmation_status: "accepted",
        status: "confirmed",
      })
      .eq("id", body.booking_id)
      .eq("educator_id", check.tutor.id);

    return NextResponse.json({ success: true });
  }

  if (body.action === "reschedule") {
    await supabase
      .from("lesson_bookings")
      .update({
        tutor_confirmation_status: "reschedule_requested",
      })
      .eq("id", body.booking_id)
      .eq("educator_id", check.tutor.id);

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}