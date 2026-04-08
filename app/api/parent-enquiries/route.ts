import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type EnquiryPayload = {
  parentName: string;
  email: string;
  phone: string;
  studentName: string;
  curriculum: string;
  level: string;
  message: string;
};

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as EnquiryPayload;

    const requiredFields: Array<keyof EnquiryPayload> = [
      "parentName",
      "email",
      "phone",
      "studentName",
      "curriculum",
      "level",
      "message",
    ];

    for (const field of requiredFields) {
      if (!body[field]?.trim()) {
        return NextResponse.json(
          { error: `Missing field: ${field}` },
          { status: 400 }
        );
      }
    }

    const supabase = getAdminClient();

    const { error } = await supabase.from("homepage_parent_enquiries").insert({
      parent_name: body.parentName.trim(),
      email: body.email.trim(),
      phone: body.phone.trim(),
      student_name: body.studentName.trim(),
      curriculum: body.curriculum.trim(),
      level: body.level.trim(),
      message: body.message.trim(),
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to save enquiry" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Parent enquiry API error:", error);
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 500 }
    );
  }
}