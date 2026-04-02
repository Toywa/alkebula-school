import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createAdminSupabaseClient();

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", params.id)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        {
          ok: false,
          error: bookingError?.message || "Booking not found.",
        },
        { status: 404 }
      );
    }

    let educator = null;

    if (booking.educator_id) {
      const { data: educatorData, error: educatorError } = await supabase
        .from("educators")
        .select("*")
        .eq("id", booking.educator_id)
        .maybeSingle();

      if (educatorError) {
        return NextResponse.json(
          {
            ok: false,
            error: educatorError.message || "Failed to load assigned educator.",
          },
          { status: 500 }
        );
      }

      educator = educatorData ?? null;
    }

    return NextResponse.json({
      ok: true,
      booking: {
        ...booking,
        educator,
      },
    });
  } catch (error) {
    console.error("Booking detail route error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unexpected server error.",
      },
      { status: 500 }
    );
  }
}