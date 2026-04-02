import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const allowedStatuses = [
  "new",
  "contacted",
  "matched",
  "booked",
  "closed",
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
      .from("parent_enquiries")
      .update({ status })
      .eq("id", params.id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message || "Failed to update enquiry status." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Enquiry status updated successfully.",
      enquiry: data,
    });
  } catch (error) {
    console.error("Parent enquiry status route error:", error);
    return NextResponse.json(
      { ok: false, error: "Unexpected server error." },
      { status: 500 }
    );
  }
}