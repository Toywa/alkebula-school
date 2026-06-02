import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = createAdminSupabaseClient();

    const { data, error } = await supabase
      .from("parent_enquiries")
      .select(`
        *,
        educators (
          id,
          display_name,
          primary_subject,
          curriculum_expertise,
          location,
          teaching_mode,
          hourly_rate
        )
      `)
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { ok: false, error: "Enquiry not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      enquiry: data,
    });
  } catch (error) {
    console.error("Parent enquiry detail route error:", error);
    return NextResponse.json(
      { ok: false, error: "Unexpected server error." },
      { status: 500 }
    );
  }
}