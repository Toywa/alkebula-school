import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const educatorId = body.educatorId as string | undefined;
    const periodId = body.periodId as string | undefined;
    const slotDate = body.slotDate as string | undefined;
    const startTime = body.startTime as string | undefined;
    const endTime = body.endTime as string | undefined;
    const timezone = body.timezone as string | undefined;

    if (!educatorId || !educatorId.trim()) {
      return NextResponse.json(
        { ok: false, error: "Educator ID is required." },
        { status: 400 }
      );
    }

    if (!slotDate) {
      return NextResponse.json(
        { ok: false, error: "Slot date is required." },
        { status: 400 }
      );
    }

    if (!startTime || !endTime) {
      return NextResponse.json(
        { ok: false, error: "Start and end time are required." },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();

    const { data: slot, error: slotError } = await supabase
      .from("educator_availability_slots")
      .insert([
        {
          educator_id: educatorId,
          period_id: periodId || null,
          slot_date: slotDate,
          start_time: startTime,
          end_time: endTime,
          timezone: timezone || "UTC",
          status: "available",
        },
      ])
      .select("*")
      .single();

    if (slotError) {
      return NextResponse.json(
        { ok: false, error: slotError.message || "Failed to save slot." },
        { status: 500 }
      );
    }

    if (periodId) {
      await supabase
        .from("educator_availability_periods")
        .update({
          submitted_at: new Date().toISOString(),
          status: "submitted",
        })
        .eq("id", periodId);
    }

    return NextResponse.json({
      ok: true,
      message: "Availability slot saved successfully.",
      slot,
    });
  } catch (error) {
    console.error("Educator availability route error:", error);
    return NextResponse.json(
      { ok: false, error: "Unexpected server error." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    const slotId = body.slotId as string | undefined;
    const status = body.status as string | undefined;

    if (!slotId) {
      return NextResponse.json(
        { ok: false, error: "Slot ID is required." },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { ok: false, error: "Status is required." },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();

    const { data, error } = await supabase
      .from("educator_availability_slots")
      .update({ status })
      .eq("id", slotId)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message || "Failed to update slot." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      slot: data,
    });
  } catch (error) {
    console.error("Educator availability PATCH error:", error);
    return NextResponse.json(
      { ok: false, error: "Unexpected server error." },
      { status: 500 }
    );
  }
}