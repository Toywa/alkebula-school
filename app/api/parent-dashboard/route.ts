import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parentEmail = body.parentEmail as string | undefined;

    if (!parentEmail || !parentEmail.trim()) {
      return NextResponse.json(
        { ok: false, error: "Parent email is required." },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();

    const { data: enquiries, error: enquiriesError } = await supabase
      .from("parent_enquiries")
      .select("*")
      .eq("parent_email", parentEmail)
      .order("created_at", { ascending: false });

    if (enquiriesError) {
      return NextResponse.json(
        { ok: false, error: enquiriesError.message || "Failed to load enquiries." },
        { status: 500 }
      );
    }

    const { data: bookings, error: bookingsError } = await supabase
      .from("bookings")
      .select("*")
      .eq("parent_email", parentEmail)
      .order("scheduled_at", { ascending: true });

    if (bookingsError) {
      return NextResponse.json(
        { ok: false, error: bookingsError.message || "Failed to load bookings." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      parentEmail,
      enquiries: enquiries ?? [],
      bookings: bookings ?? [],
    });
  } catch (error) {
    console.error("Parent dashboard route error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unexpected server error.",
      },
      { status: 500 }
    );
  }
}