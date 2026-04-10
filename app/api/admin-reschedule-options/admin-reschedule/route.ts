import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type ReschedulePayload = {
  new_slot_id: string;
};

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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as ReschedulePayload;

    if (!body.new_slot_id?.trim()) {
      return NextResponse.json(
        { error: "Missing new_slot_id" },
        { status: 400 }
      );
    }

    const supabase = getAdminClient();

    const { data: booking, error: bookingError } = await supabase
      .from("lesson_bookings")
      .select(
        "id, educator_id, slot_id, parent_name, student_name, booking_date, start_time, end_time, timezone, status, admin_resolution_status"
      )
      .eq("id", id)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    const { data: newSlot, error: newSlotError } = await supabase
      .from("availability_slots")
      .select("id, educator_id, slot_date, start_time, end_time, timezone, status")
      .eq("id", body.new_slot_id.trim())
      .single();

    if (newSlotError || !newSlot) {
      return NextResponse.json(
        { error: "New slot not found" },
        { status: 404 }
      );
    }

    if (newSlot.educator_id !== booking.educator_id) {
      return NextResponse.json(
        { error: "New slot belongs to a different tutor" },
        { status: 400 }
      );
    }

    if (newSlot.status !== "available") {
      return NextResponse.json(
        { error: "Selected slot is no longer available" },
        { status: 409 }
      );
    }

    const oldSlotId = booking.slot_id;

    const { error: lockNewSlotError } = await supabase
      .from("availability_slots")
      .update({ status: "booked" })
      .eq("id", newSlot.id);

    if (lockNewSlotError) {
      return NextResponse.json(
        { error: "Failed to lock new slot" },
        { status: 500 }
      );
    }

    const { data: updatedBooking, error: updateBookingError } = await supabase
      .from("lesson_bookings")
      .update({
        previous_slot_id: oldSlotId,
        slot_id: newSlot.id,
        booking_date: newSlot.slot_date,
        start_time: newSlot.start_time,
        end_time: newSlot.end_time,
        timezone: newSlot.timezone,
        status: "tutor_confirmed",
        tutor_confirmation_status: "confirmed",
        admin_resolution_status: "resolved",
      })
      .eq("id", booking.id)
      .select()
      .single();

    if (updateBookingError) {
      await supabase
        .from("availability_slots")
        .update({ status: "available" })
        .eq("id", newSlot.id);

      return NextResponse.json(
        { error: updateBookingError.message },
        { status: 500 }
      );
    }

    if (oldSlotId) {
      await supabase
        .from("availability_slots")
        .update({ status: "cancelled" })
        .eq("id", oldSlotId);
    }

    const { error: notificationError } = await supabase
      .from("notifications")
      .insert([
        {
          user_type: "admin",
          user_identifier: "admin",
          notification_type: "booking_rescheduled",
          title: "Booking rescheduled",
          message: `Booking for ${booking.parent_name} / ${booking.student_name} was reassigned to ${newSlot.slot_date} ${newSlot.start_time}-${newSlot.end_time}.`,
          status: "pending",
          related_booking_id: booking.id,
          timezone: newSlot.timezone || "Africa/Nairobi",
        },
        {
          user_type: "educator",
          user_identifier: String(booking.educator_id),
          notification_type: "booking_rescheduled",
          title: "Lesson rescheduled by admin",
          message: `A booking has been rescheduled to ${newSlot.slot_date} from ${newSlot.start_time} to ${newSlot.end_time}.`,
          status: "pending",
          related_booking_id: booking.id,
          timezone: newSlot.timezone || "Africa/Nairobi",
        },
      ]);

    if (notificationError) {
      return NextResponse.json({
        success: true,
        data: updatedBooking,
        warning: "Booking rescheduled, but notification logging failed.",
      });
    }

    return NextResponse.json({
      success: true,
      data: updatedBooking,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to reschedule booking",
      },
      { status: 500 }
    );
  }
}