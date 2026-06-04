import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  sendTutorProfileStatusEmail,
  type TutorProfileStatusAction,
} from "@/lib/email";

export const dynamic = "force-dynamic";

const ADMIN_ALLOWED_EMAILS = ["admin@alkebulaschool.com"];

const HIDE_REASONS = [
  "Profile requires improvement",
  "Profile photo does not meet standards",
  "Bio requires professional update",
  "Qualification or experience missing",
  "Subjects or class levels unclear",
  "Teaching rate requires review",
  "Availability or timezone not updated",
  "Quality review pending",
  "Parent complaint under review",
  "Temporary unavailability",
  "Administrative review",
  "Other",
];

const REMOVAL_REASONS = [
  "Gross misconduct",
  "Platform abuse",
  "Fraudulent or unverifiable documents",
  "Harassment or abusive communication",
  "Safeguarding concern",
  "Repeated parent complaints",
  "Bypassing platform payments",
  "Misuse of confidential information",
  "Conflict of interest",
  "Impersonation or false identity",
  "Breach of tutor terms",
  "Other",
];

type TutorStatusAction =
  | "hide_profile"
  | "restore_profile"
  | "suspend_profile"
  | "remove_tutor";

type TutorStatusBody = {
  tutorId?: string;
  tutorEmail?: string;
  action?: TutorStatusAction;
  reason?: string;
  note?: string;
  confirmRemove?: string;
};

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

function normalizeEmail(email?: string | null) {
  return (email || "").trim().toLowerCase();
}

function normalizeText(value?: string | null) {
  return (value || "").trim();
}

async function requireAdmin(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return {
      adminEmail: "",
      error: NextResponse.json({ error: "Unauthorized." }, { status: 401 }),
    };
  }

  const token = authHeader.replace("Bearer ", "").trim();
  const supabaseAdmin = getAdminClient();

  const {
    data: { user },
    error: userError,
  } = await supabaseAdmin.auth.getUser(token);

  if (userError || !user?.email) {
    return {
      adminEmail: "",
      error: NextResponse.json({ error: "Unauthorized." }, { status: 401 }),
    };
  }

  const adminEmail = normalizeEmail(user.email);

  if (!ADMIN_ALLOWED_EMAILS.includes(adminEmail)) {
    return {
      adminEmail,
      error: NextResponse.json({ error: "Admin access denied." }, { status: 403 }),
    };
  }

  return { adminEmail, error: null };
}

function validateReason(action: TutorStatusAction, reason: string) {
  if (action === "hide_profile" || action === "suspend_profile") {
    return HIDE_REASONS.includes(reason);
  }

  if (action === "remove_tutor") {
    return REMOVAL_REASONS.includes(reason);
  }

  return true;
}

export async function GET(request: NextRequest) {
  try {
    const { error } = await requireAdmin(request);
    if (error) return error;

    const supabaseAdmin = getAdminClient();

    const { data, error: tutorError } = await supabaseAdmin
      .from("educator_directory")
      .select(
        `
        id,
        full_name,
        email,
        city,
        qualification,
        years_of_experience,
        subjects,
        curricula,
        hourly_rate,
        approval_status,
        is_public,
        profile_status,
        profile_hidden_reason,
        profile_hidden_note,
        profile_hidden_at,
        profile_hidden_by,
        removed_at,
        removed_by,
        removal_reason,
        removal_note,
        timezone,
        created_at
      `
      )
      .in("approval_status", ["approved", "removed"])
      .order("created_at", { ascending: false });

    if (tutorError) {
      throw tutorError;
    }

    return NextResponse.json({
      ok: true,
      tutors: data || [],
      hideReasons: HIDE_REASONS,
      removalReasons: REMOVAL_REASONS,
    });
  } catch (error) {
    console.error("Admin tutor status GET error:", error);

    return NextResponse.json(
      { error: "Could not load approved tutors." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { adminEmail, error } = await requireAdmin(request);
    if (error) return error;

    const body = (await request.json()) as TutorStatusBody;

    const tutorId = normalizeText(body.tutorId);
    const tutorEmail = normalizeEmail(body.tutorEmail);
    const action = body.action;
    const reason = normalizeText(body.reason);
    const note = normalizeText(body.note);

    if (!action) {
      return NextResponse.json({ error: "Action is required." }, { status: 400 });
    }

    if (!tutorId && !tutorEmail) {
      return NextResponse.json(
        { error: "Tutor ID or tutor email is required." },
        { status: 400 }
      );
    }

    if (!["hide_profile", "restore_profile", "suspend_profile", "remove_tutor"].includes(action)) {
      return NextResponse.json({ error: "Invalid tutor status action." }, { status: 400 });
    }

    if (action !== "restore_profile") {
      if (!reason) {
        return NextResponse.json({ error: "Reason is required." }, { status: 400 });
      }

      if (!validateReason(action, reason)) {
        return NextResponse.json(
          { error: "Invalid reason selected for this action." },
          { status: 400 }
        );
      }
    }

    if (action === "remove_tutor" && body.confirmRemove !== "REMOVE") {
      return NextResponse.json(
        { error: 'Please type "REMOVE" to confirm tutor removal.' },
        { status: 400 }
      );
    }

    const supabaseAdmin = getAdminClient();

    let tutorQuery = supabaseAdmin
      .from("educator_directory")
      .select("id,full_name,email,approval_status,is_public,profile_status")
      .limit(1);

    tutorQuery = tutorId ? tutorQuery.eq("id", tutorId) : tutorQuery.eq("email", tutorEmail);

    const { data: tutorRows, error: findError } = await tutorQuery;

    if (findError) {
      throw findError;
    }

    const tutor = tutorRows?.[0];

    if (!tutor?.email) {
      return NextResponse.json({ error: "Tutor not found." }, { status: 404 });
    }

    const now = new Date().toISOString();

    let updatePayload: Record<string, unknown> = {};

    if (action === "hide_profile") {
      updatePayload = {
        profile_status: "hidden",
        is_public: false,
        profile_hidden_reason: reason,
        profile_hidden_note: note || null,
        profile_hidden_at: now,
        profile_hidden_by: adminEmail,
      };
    }

    if (action === "suspend_profile") {
      updatePayload = {
        profile_status: "suspended",
        is_public: false,
        profile_hidden_reason: reason,
        profile_hidden_note: note || null,
        profile_hidden_at: now,
        profile_hidden_by: adminEmail,
      };
    }

    if (action === "restore_profile") {
      updatePayload = {
        profile_status: "active",
        approval_status: "approved",
        is_public: true,
        profile_hidden_reason: null,
        profile_hidden_note: null,
        profile_hidden_at: null,
        profile_hidden_by: null,
      };
    }

    if (action === "remove_tutor") {
      updatePayload = {
        profile_status: "removed",
        approval_status: "removed",
        is_public: false,
        removed_at: now,
        removed_by: adminEmail,
        removal_reason: reason,
        removal_note: note || null,
      };
    }

    const { data: updatedTutor, error: updateError } = await supabaseAdmin
      .from("educator_directory")
      .update(updatePayload)
      .eq("id", tutor.id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    const emailResult = await sendTutorProfileStatusEmail({
      tutorEmail: updatedTutor.email,
      tutorName: updatedTutor.full_name || "Tutor",
      action: action as TutorProfileStatusAction,
      reason: action === "restore_profile" ? "Profile restored by admin" : reason,
      note,
    });

    return NextResponse.json({
      ok: true,
      tutor: updatedTutor,
      emailResult,
      warning:
        emailResult.success === false
          ? "Tutor status was updated, but the notification email failed."
          : null,
    });
  } catch (error) {
    console.error("Admin tutor status PATCH error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not update tutor status.",
      },
      { status: 500 }
    );
  }
}
