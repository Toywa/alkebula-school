import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import crypto from "crypto";

const ADMIN_ALLOWED_EMAILS = [
  "sunscapecars@gmail.com",
  "davidmusilah@gmail.com",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

async function getAuthClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {}
        },
      },
    }
  );
}

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase environment variables are missing.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

async function requireAdmin() {
  const supabase = await getAuthClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const email = user.email?.toLowerCase() || "";

  if (!ADMIN_ALLOWED_EMAILS.includes(email)) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { ok: true };
}

function validateFileType(file: File, allowed: string[]) {
  return allowed.includes(file.type);
}

function validateFileSize(file: File, label: string) {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`${label} must be less than 10MB.`);
  }
}

function getExtension(file: File) {
  const nameParts = file.name.split(".");
  const ext = nameParts.length > 1 ? nameParts.pop()?.toLowerCase() : "";

  if (ext) return ext;

  if (file.type === "image/jpeg") return "jpg";
  if (file.type === "image/png") return "png";
  if (file.type === "application/pdf") return "pdf";
  if (file.type === "application/msword") return "doc";
  if (
    file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return "docx";
  }

  return "file";
}

async function uploadFile(
  supabase: ReturnType<typeof getAdminClient>,
  bucket: string,
  folder: string,
  label: string,
  file: File
) {
  validateFileSize(file, label);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const extension = getExtension(file);

  const safeFilePath = `${folder}/${label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}-${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from(bucket).upload(safeFilePath, buffer, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });

  if (error) {
    console.error("❌ Storage upload error:", {
      bucket,
      safeFilePath,
      message: error.message,
    });

    throw new Error(`Upload failed for ${label}: ${error.message}`);
  }

  if (bucket === "educator-profile-images") {
    const { data } = supabase.storage.from(bucket).getPublicUrl(safeFilePath);
    return data.publicUrl;
  }

  return safeFilePath;
}

export async function GET() {
  const adminCheck = await requireAdmin();

  if (!adminCheck.ok) {
    return adminCheck.response;
  }

  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from("educator_applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  try {
    const supabase = getAdminClient();
    const formData = await request.formData();

    const fullName = String(formData.get("full_name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const proposedPublicBio = String(
      formData.get("proposed_public_bio") || ""
    ).trim();
    const city = String(formData.get("city") || "").trim();

    const referee1Name = String(formData.get("referee_1_name") || "").trim();
    const referee1Email = String(formData.get("referee_1_email") || "").trim();
    const referee1Phone = String(formData.get("referee_1_phone") || "").trim();

    const referee2Name = String(formData.get("referee_2_name") || "").trim();
    const referee2Email = String(formData.get("referee_2_email") || "").trim();
    const referee2Phone = String(formData.get("referee_2_phone") || "").trim();

    const subjects = formData.getAll("subjects").map(String).filter(Boolean);
    const curricula = formData.getAll("curricula").map(String).filter(Boolean);

    const declarationNoCriminalPast =
      String(formData.get("declaration_no_criminal_past")) === "true";
    const declarationInternet15mbps =
      String(formData.get("declaration_internet_15mbps")) === "true";
    const declarationHasI5Laptop =
      String(formData.get("declaration_has_i5_laptop")) === "true";
    const declarationInformationTrue =
      String(formData.get("declaration_information_true")) === "true";

    const profilePhoto = formData.get("profile_photo") as File | null;
    const cvFile = formData.get("cv_file") as File | null;
    const degreeCertificate = formData.get("degree_certificate") as File | null;
    const highSchoolCertificate = formData.get(
      "high_school_certificate"
    ) as File | null;

    if (
      !fullName ||
      !email ||
      !phone ||
      !city ||
      !referee1Name ||
      !referee1Email ||
      !referee1Phone ||
      !referee2Name ||
      !referee2Email ||
      !referee2Phone ||
      !profilePhoto ||
      !cvFile ||
      !degreeCertificate ||
      !highSchoolCertificate
    ) {
      return NextResponse.json(
        { error: "Please complete all required fields and uploads." },
        { status: 400 }
      );
    }

    if (proposedPublicBio.length > 100) {
      return NextResponse.json(
        { error: "Proposed public bio must not exceed 100 characters." },
        { status: 400 }
      );
    }

    if (subjects.length < 1 || subjects.length > 2) {
      return NextResponse.json(
        { error: "Please choose 1 or 2 subjects." },
        { status: 400 }
      );
    }

    if (curricula.length < 1) {
      return NextResponse.json(
        { error: "Please choose at least one curriculum." },
        { status: 400 }
      );
    }

    if (
      !declarationNoCriminalPast ||
      !declarationInternet15mbps ||
      !declarationHasI5Laptop ||
      !declarationInformationTrue
    ) {
      return NextResponse.json(
        { error: "All declarations must be accepted." },
        { status: 400 }
      );
    }

    if (!validateFileType(profilePhoto, ["image/jpeg", "image/png"])) {
      return NextResponse.json(
        { error: "Profile photo must be JPG or PNG." },
        { status: 400 }
      );
    }

    if (
      !validateFileType(cvFile, [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ])
    ) {
      return NextResponse.json(
        { error: "CV must be PDF, DOC or DOCX." },
        { status: 400 }
      );
    }

    if (
      !validateFileType(degreeCertificate, [
        "application/pdf",
        "image/jpeg",
        "image/png",
      ]) ||
      !validateFileType(highSchoolCertificate, [
        "application/pdf",
        "image/jpeg",
        "image/png",
      ])
    ) {
      return NextResponse.json(
        { error: "Certificates must be PDF, JPG or PNG." },
        { status: 400 }
      );
    }

    const folder = `educator-applications/${crypto.randomUUID()}`;

    const profilePhotoUrl = await uploadFile(
      supabase,
      "educator-profile-images",
      folder,
      "profile-photo",
      profilePhoto
    );

    const cvUrl = await uploadFile(
      supabase,
      "educator-application-documents",
      folder,
      "cv",
      cvFile
    );

    const degreeCertificateUrl = await uploadFile(
      supabase,
      "educator-application-documents",
      folder,
      "degree-certificate",
      degreeCertificate
    );

    const highSchoolCertificateUrl = await uploadFile(
      supabase,
      "educator-application-documents",
      folder,
      "high-school-certificate",
      highSchoolCertificate
    );

    const { data, error } = await supabase
      .from("educator_applications")
      .insert({
        full_name: fullName,
        email,
        phone,
        profile_photo_url: profilePhotoUrl,
        cv_url: cvUrl,
        degree_certificate_url: degreeCertificateUrl,
        high_school_certificate_url: highSchoolCertificateUrl,
        referee_1_name: referee1Name,
        referee_1_email: referee1Email,
        referee_1_phone: referee1Phone,
        referee_2_name: referee2Name,
        referee_2_email: referee2Email,
        referee_2_phone: referee2Phone,
        proposed_public_bio: proposedPublicBio,
        subjects,
        curricula,
        city,
        declaration_no_criminal_past: declarationNoCriminalPast,
        declaration_internet_15mbps: declarationInternet15mbps,
        declaration_has_i5_laptop: declarationHasI5Laptop,
        declaration_information_true: declarationInformationTrue,
        status: "pending_review",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      application: data,
      message: "Application submitted successfully.",
    });
  } catch (error) {
    console.error("Educator application error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Application failed. Please try again.",
      },
      { status: 500 }
    );
  }
}