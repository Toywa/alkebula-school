import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type Payload = {
  action: "accept_reschedule" | "request_admin_help";
};

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return createClient(url!, serviceRoleKey!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = (await request.json()) as Payload;

  const supabase = getAdminClient();

  const { data: booking } = await supabase
    .from("lesson_bookings")
    .select("*")
    .eq("id", id)
    .single();

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  let update: any = {};

  if (body.action === "accept_reschedule") {
    update = {
      parent_response: "accepted",
      parent_response_at: new Date().toISOString(),
      status: "confirmed",
    };
  }

  if (body.action === "request_admin_help") {
    update = {
      parent_response: "needs_help",
      parent_response_at: new Date().toISOString(),
      admin_resolution_status: "pending_admin_review",
    };
  }

  const { error } = await supabase
    .from("lesson_bookings")
    .update(update)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}