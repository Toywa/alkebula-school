import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ADMIN_ALLOWED_EMAILS = ["admin@alkebulaschool.com"];

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "").trim();

    if (!token) {
      return NextResponse.json({ error: "Missing admin session token." }, { status: 401 });
    }

    const supabase = getAdminClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user?.email) {
      return NextResponse.json({ error: "Invalid admin session." }, { status: 401 });
    }

    if (!ADMIN_ALLOWED_EMAILS.includes(user.email.toLowerCase())) {
      return NextResponse.json({ error: "Unauthorized admin access." }, { status: 403 });
    }

    const body = await req.json();
    const { lessonId, payoutReference } = body;

    if (!lessonId) {
      return NextResponse.json({ error: "Missing lesson ID." }, { status: 400 });
    }

    if (!payoutReference || !String(payoutReference).trim()) {
      return NextResponse.json(
        { error: "Payout reference / M-Pesa code is required." },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabase
      .from("tutor_lessons")
      .update({
        payout_status: "paid",
        payout_date: new Date().toISOString(),
        payout_reference: String(payoutReference).trim(),
      })
      .eq("id", lessonId)
      .eq("payment_status", "paid");

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to mark payout paid.",
      },
      { status: 500 }
    );
  }
}