import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const allowedStatuses = [
  "scheduled",
  "completed",
  "cancelled",
  "rescheduled",
] as const;

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const status = body.status as string;

    if (!allowedStatuses.includes(status as (typeof allowedStatuses)[number])) {
      return NextResponse.json(
        { ok: false, error: "Invalid booking status." },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();

    const { data, error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", params.id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message || "Failed to update booking." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Booking status updated successfully.",
      booking: data,
    });
  } catch (error) {
    console.error("Booking status route error:", error);
    return NextResponse.json(
      { ok: false, error: "Unexpected server error." },
      { status: 500 }
    );
  }
}