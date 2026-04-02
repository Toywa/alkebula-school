import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const allowedMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
];

const maxFileSize = 10 * 1024 * 1024; // 10 MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const studentName = formData.get("studentName") as string | null;
    const parentEmail = formData.get("parentEmail") as string | null;
    const educatorId = formData.get("educatorId") as string | null;
    const subject = formData.get("subject") as string | null;
    const topic = formData.get("topic") as string | null;
    const subtopic = formData.get("subtopic") as string | null;
    const submissionText = formData.get("submissionText") as string | null;
    const file = formData.get("file") as File | null;

    if (!studentName || !studentName.trim()) {
      return NextResponse.json(
        { ok: false, error: "Student name is required." },
        { status: 400 }
      );
    }

    if (!educatorId || !educatorId.trim()) {
      return NextResponse.json(
        { ok: false, error: "Educator ID is required." },
        { status: 400 }
      );
    }

    if (!subject || !subject.trim()) {
      return NextResponse.json(
        { ok: false, error: "Subject is required." },
        { status: 400 }
      );
    }

    if (!topic || !topic.trim()) {
      return NextResponse.json(
        { ok: false, error: "Topic is required." },
        { status: 400 }
      );
    }

    if (!subtopic || !subtopic.trim()) {
      return NextResponse.json(
        { ok: false, error: "Subtopic is required." },
        { status: 400 }
      );
    }

    if (!submissionText?.trim() && !file) {
      return NextResponse.json(
        { ok: false, error: "Add submission text or upload a file." },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();

    let storedFilePath: string | null = null;

    if (file) {
      if (!allowedMimeTypes.includes(file.type)) {
        return NextResponse.json(
          {
            ok: false,
            error: "Invalid file type. Only PDF, DOC, DOCX, JPG, PNG allowed.",
          },
          { status: 400 }
        );
      }

      if (file.size > maxFileSize) {
        return NextResponse.json(
          { ok: false, error: "File too large. Max allowed size is 10MB." },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const safeFileName = file.name.replace(/\s+/g, "_");

      const filePath = `${educatorId}/${studentName.replace(/\s+/g, "_")}-${Date.now()}-${safeFileName}`;

      const { error: uploadError } = await supabase.storage
        .from("homework-submissions")
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        return NextResponse.json(
          { ok: false, error: uploadError.message || "Failed to upload file." },
          { status: 500 }
        );
      }

      storedFilePath = filePath;
    }

    const { data, error } = await supabase
      .from("homework_submissions")
      .insert([
        {
          student_name: studentName,
          parent_email: parentEmail || null,
          educator_id: educatorId,
          subject,
          topic,
          subtopic,
          submission_text: submissionText || null,
          file_url: storedFilePath,
          status: "submitted",
        },
      ])
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message || "Failed to submit homework." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Homework submitted successfully.",
      submission: data,
    });
  } catch (error) {
    console.error("Homework submit route error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unexpected server error.",
      },
      { status: 500 }
    );
  }
}