import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase environment variables are missing.");
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

function validateFileSize(file: File, label: string) {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`${label} must be less than 10MB.`);
  }
}

function getExtension(file: File) {
  const parts = file.name.split(".");
  return parts.length > 1 ? parts.pop() : "file";
}

async function uploadFile(
  supabase: ReturnType<typeof getAdminClient>,
  label: string,
  file: File
) {
  validateFileSize(file, label);

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = getExtension(file);

  const fileName = `${label}-${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("educator-documents") // ✅ USE WORKING BUCKET
    .upload(fileName, buffer, {
      contentType: file.type || "application/octet-stream",
    });

  if (error) {
    console.error("❌ Upload error:", error.message);
    throw new Error(`Upload failed for ${label}: ${error.message}`);
  }

  return fileName;
}

export async function POST(req: Request) {
  try {
    const supabase = getAdminClient();
    const formData = await req.formData();

    const fullName = String(formData.get("full_name") || "");
    const email = String(formData.get("email") || "");
    const phone = String(formData.get("phone") || "");

    const profilePhoto = formData.get("profile_photo") as File;
    const cvFile = formData.get("cv_file") as File;
    const degreeCertificate = formData.get("degree_certificate") as File;
    const highSchoolCertificate = formData.get("high_school_certificate") as File;

    if (!profilePhoto || !cvFile || !degreeCertificate || !highSchoolCertificate) {
      return NextResponse.json(
        { error: "Missing required files" },
        { status: 400 }
      );
    }

    const profilePhotoUrl = await uploadFile(
      supabase,
      "profile-photo",
      profilePhoto
    );

    const cvUrl = await uploadFile(
      supabase,
      "cv",
      cvFile
    );

    const degreeUrl = await uploadFile(
      supabase,
      "degree",
      degreeCertificate
    );

    const highSchoolUrl = await uploadFile(
      supabase,
      "high-school",
      highSchoolCertificate
    );

    const { error } = await supabase
      .from("educator_applications")
      .insert({
        full_name: fullName,
        email,
        phone,
        profile_photo_url: profilePhotoUrl,
        cv_url: cvUrl,
        degree_certificate_url: degreeUrl,
        high_school_certificate_url: highSchoolUrl,
        status: "pending_review",
      });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Application failed",
      },
      { status: 500 }
    );
  }
}