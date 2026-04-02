import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const allowedStatuses = [
  "submitted",
  "under_review",
  "shortlisted",
  "interview_scheduled",
  "approved",
  "rejected",
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
        { ok: false, error: "Invalid status." },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();

    const { data, error } = await supabase
      .from("educator_applications")
      .update({ status })
      .eq("id", params.id)
      .select("id, full_name, status")
      .single();

    if (error) {
      return NextResponse.json(
        { ok: false, error: "Failed to update status." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, application: data });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Unexpected server error." },
      { status: 500 }
    );
  }
}