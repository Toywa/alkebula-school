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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const educatorId = searchParams.get("educator_id");

    const supabase = getAdminClient();

    let query = supabase
      .from("availability_slots")
      .select("id, educator_id, slot_date, start_time, end_time, period_label, status, source, created_at")
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
      { error: error instanceof Error ? error.message : "Failed to load slots" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { educator_id, slot_date, start_time, end_time, period_label, source } = body;

    if (!educator_id || !slot_date || !start_time || !end_time) {
      return NextResponse.json(
        { error: "educator_id, slot_date, start_time and end_time are required" },
        { status: 400 }
      );
    }

    const supabase = getAdminClient();

    const { data, error } = await supabase
      .from("availability_slots")
      .insert({
        educator_id,
        slot_date,
        start_time,
        end_time,
        period_label: period_label || "period_1",
        source: source || "planned",
        status: "available",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create slot" },
      { status: 500 }
    );
  }
}