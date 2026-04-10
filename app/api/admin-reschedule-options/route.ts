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
    const supabase = getAdminClient();
    const { searchParams } = new URL(request.url);
    const educatorId = searchParams.get("educator_id");

    if (!educatorId) {
      return NextResponse.json(
        { error: "Missing educator_id" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("availability_slots")
      .select(
        "id, educator_id, slot_date, start_time, end_time, timezone, status"
      )
      .eq("educator_id", educatorId)
      .eq("status", "available")
      .order("slot_date", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load reschedule options",
      },
      { status: 500 }
    );
  }
}