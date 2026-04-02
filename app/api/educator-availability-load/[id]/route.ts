import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createAdminSupabaseClient();

    const { data: periods, error: periodError } = await supabase
      .from("educator_availability_periods")
      .select("*")
      .eq("educator_id", params.id)
      .order("start_date", { ascending: false });

    if (periodError) {
      return NextResponse.json(
        { ok: false, error: periodError.message },
        { status: 500 }
      );
    }

    const { data: slots, error: slotError } = await supabase
      .from("educator_availability_slots")
      .select("*")
      .eq("educator_id", params.id)
      .order("slot_date", { ascending: true });

    if (slotError) {
      return NextResponse.json(
        { ok: false, error: slotError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      periods: periods || [],
      slots: slots || [],
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Unexpected server error" },
      { status: 500 }
    );
  }
}