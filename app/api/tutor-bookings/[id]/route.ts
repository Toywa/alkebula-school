import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type ActionPayload = {
  action: "confirm" | "request_reschedule";
  reason?: string;
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
    const body = (await request.json()) as ActionPayload;

    if (!body.action) {
      return NextResponse.json(
        { error: "Missing action" },
        { status: 400 }
      );
    }

    const supabase = getAdminClient();

    const { data: booking, error: bookingError } = await supabase
      .from("lesson_bookings")
      .select(
        "id, educator_id, parent_name, student_name, booking_date, start_time, end_time, timezone, status, tutor_confirmation_status"
      )
      .eq("id", id)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    if (body.action === "confirm") {
      const { data: updated, error: updateError } = await supabase
        .from("lesson_bookings")
        .update({
          status: "tutor_confirmed",
          tutor_confirmation_status: "confirmed",
          reschedule_reason: null,
          admin_resolution_status: "not_required",
        })
        .eq("id", id)
        .select()
        .single();

      if (updateError) {
        return NextResponse.json(
          { error: updateError.message },
          { status: 500 }
        );
      }

      const { error: adminNotificationError } = await supabase
        .from("notifications")
        .insert({
          user_type: "admin",
          user_identifier: "admin",
          notification_type: "booking_confirmed_by_tutor",
          title: "Tutor confirmed booking",
          message: `${booking.parent_name} / ${booking.student_name} booking on ${booking.booking_date} from ${booking.start_time} to ${booking.end_time} was confirmed by tutor.`,
          status: "pending",
          related_booking_id: booking.id,
          timezone: booking.timezone || "Africa/Nairobi",
        });

      if (adminNotificationError) {
        return NextResponse.json({
          success: true,
          data: updated,
          warning: "Booking confirmed, but admin notification failed.",
        });
      }

      return NextResponse.json({ success: true, data: updated });
    }

    if (body.action === "request_reschedule") {
      if (!body.reason?.trim()) {
        return NextResponse.json(
          { error: "Reschedule reason is required" },
          { status: 400 }
        );
      }

      const { data: updated, error: updateError } = await supabase
        .from("lesson_bookings")
        .update({
          status: "reschedule_requested",
          tutor_confirmation_status: "reschedule_requested",
          reschedule_reason: body.reason.trim(),
          admin_resolution_status: "pending_admin_review",
        })
        .eq("id", id)
        .select()
        .single();

      if (updateError) {
        return NextResponse.json(
          { error: updateError.message },
          { status: 500 }
        );
      }

      const { error: adminNotificationError } = await supabase
        .from("notifications")
        .insert({
          user_type: "admin",
          user_identifier: "admin",
          notification_type: "reschedule_requested",
          title: "Tutor requested reschedule",
          message: `${booking.parent_name} / ${booking.student_name} booking on ${booking.booking_date} from ${booking.start_time} to ${booking.end_time} needs admin follow-up. Reason: ${body.reason.trim()}`,
          status: "pending",
          related_booking_id: booking.id,
          timezone: booking.timezone || "Africa/Nairobi",
        });

      if (adminNotificationError) {
        return NextResponse.json({
          success: true,
          data: updated,
          warning: "Reschedule requested, but admin notification failed.",
        });
      }

      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json(
      { error: "Unsupported action" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update booking",
      },
      { status: 500 }
    );
  }
}