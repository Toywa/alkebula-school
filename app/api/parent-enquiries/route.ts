import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const educatorId = body.educatorId as string | undefined;
    const parentName = body.parentName as string | undefined;
    const parentEmail = body.parentEmail as string | undefined;
    const parentPhone = body.parentPhone as string | undefined;
    const studentName = body.studentName as string | undefined;
    const subject = body.subject as string | undefined;
    const preferredMode = body.preferredMode as string | undefined;
    const preferredSchedule = body.preferredSchedule as string | undefined;
    const message = body.message as string | undefined;

    if (!educatorId) {
      return NextResponse.json(
        { ok: false, error: "Missing educatorId." },
        { status: 400 }
      );
    }

    if (!parentName || !parentName.trim()) {
      return NextResponse.json(
        { ok: false, error: "Parent name is required." },
        { status: 400 }
      );
    }

    if (!parentEmail || !parentEmail.trim()) {
      return NextResponse.json(
        { ok: false, error: "Parent email is required." },
        { status: 400 }
      );
    }

    if (!studentName || !studentName.trim()) {
      return NextResponse.json(
        { ok: false, error: "Student name is required." },
        { status: 400 }
      );
    }

    if (!subject || !subject.trim()) {
      return NextResponse.json(
        { ok: false, error: "Subject is required." },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();

    const { data, error } = await supabase
      .from("parent_enquiries")
      .insert([
        {
          educator_id: educatorId,
          parent_name: parentName,
          parent_email: parentEmail,
          parent_phone: parentPhone || null,
          student_name: studentName,
          subject,
          preferred_mode: preferredMode || null,
          preferred_schedule: preferredSchedule || null,
          message: message || null,
          status: "new",
        },
      ])
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message || "Failed to save enquiry." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Enquiry submitted successfully.",
      enquiry: data,
    });
  } catch (error) {
    console.error("Parent enquiry route error:", error);
    return NextResponse.json(
      { ok: false, error: "Unexpected server error." },
      { status: 500 }
    );
  }
}