import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createAdminSupabaseClient();

    const { data: educator, error: educatorError } = await supabase
      .from("educators")
      .select("*")
      .eq("id", params.id)
      .single();

    if (educatorError || !educator) {
      return NextResponse.json(
        { ok: false, error: educatorError?.message || "Educator not found." },
        { status: 404 }
      );
    }

    const { data: bookings, error: bookingsError } = await supabase
      .from("bookings")
      .select("*")
      .eq("educator_id", params.id)
      .order("scheduled_at", { ascending: true });

    if (bookingsError) {
      return NextResponse.json(
        { ok: false, error: bookingsError.message || "Failed to load bookings." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      educator,
      bookings: bookings ?? [],
    });
  } catch (error) {
    console.error("Educator bookings route error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unexpected server error.",
      },
      { status: 500 }
    );
  }
}