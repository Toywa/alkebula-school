import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type ResolutionPayload = {
  admin_resolution_status:
    | "not_required"
    | "pending_admin_review"
    | "parent_contacted"
    | "reschedule_in_progress"
    | "resolved"
    | "closed";
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
    const body = (await request.json()) as ResolutionPayload;

    if (!body.admin_resolution_status) {
      return NextResponse.json(
        { error: "Missing admin_resolution_status" },
        { status: 400 }
      );
    }

    const supabase = getAdminClient();

    const { data: booking, error: bookingError } = await supabase
      .from("lesson_bookings")
      .select(
        "id, educator_id, parent_name, student_name, booking_date, start_time, end_time, timezone, status"
      )
      .eq("id", id)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    const { data: updated, error: updateError } = await supabase
      .from("lesson_bookings")
      .update({
        admin_resolution_status: body.admin_resolution_status,
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

    const { error: notificationError } = await supabase
      .from("notifications")
      .insert({
        user_type: "admin",
        user_identifier: "admin",
        notification_type: "admin_resolution_updated",
        title: "Admin case updated",
        message: `Admin updated booking ${booking.id} to ${body.admin_resolution_status} for ${booking.parent_name} / ${booking.student_name} on ${booking.booking_date} ${booking.start_time}-${booking.end_time}.`,
        status: "pending",
        related_booking_id: booking.id,
        timezone: booking.timezone || "Africa/Nairobi",
      });

    if (notificationError) {
      return NextResponse.json({
        success: true,
        data: updated,
        warning: "Case updated, but notification logging failed.",
      });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update admin case",
      },
      { status: 500 }
    );
  }
}