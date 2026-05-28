import { sendInternalMessageNotificationEmail } from "@/lib/message-email";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ADMIN_EMAIL = "admin@alkebulaschool.com";

type SenderRole = "admin" | "educator" | "parent";
type RecipientRole = "admin" | "educator" | "parent" | "applicant";

type MessageRecipient = {
  email: string;
  name: string;
  role: Exclude<RecipientRole, "admin">;
  status?: string | null;
  source: "educator_directory" | "educator_applications" | "tutor_lessons";
};

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

function normalizeEmail(email?: string | null) {
  return String(email || "").trim().toLowerCase();
}

function uniqueRecipients(recipients: MessageRecipient[]) {
  const seen = new Set<string>();
  const unique: MessageRecipient[] = [];

  recipients.forEach((recipient) => {
    const email = normalizeEmail(recipient.email);

    if (!email || seen.has(`${recipient.role}:${email}`)) return;

    seen.add(`${recipient.role}:${email}`);

    unique.push({
      ...recipient,
      email,
      name: recipient.name || email,
    });
  });

  return unique.sort((a, b) => {
    if (a.role !== b.role) return a.role.localeCompare(b.role);
    return a.name.localeCompare(b.name);
  });
}

function isAllowedMessage(
  senderRole: SenderRole,
  recipientRole: RecipientRole
) {
  return (
    (senderRole === "educator" && recipientRole === "admin") ||
    (senderRole === "parent" && recipientRole === "admin") ||
    (senderRole === "admin" &&
      (recipientRole === "educator" ||
        recipientRole === "parent" ||
        recipientRole === "applicant"))
  );
}

async function getUserFromRequest(req: Request) {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "").trim();

  if (!token) {
    throw new Error("Missing session token.");
  }

  const supabase = getAdminClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user?.email) {
    throw new Error("Invalid session.");
  }

  return {
    email: normalizeEmail(user.email),
    supabase,
  };
}

async function getSenderRole(email: string, supabase: ReturnType<typeof getAdminClient>): Promise<SenderRole> {
  if (normalizeEmail(email) === ADMIN_EMAIL) return "admin";

  const { data: educator } = await supabase
    .from("educator_directory")
    .select("email, approval_status")
    .eq("email", email)
    .maybeSingle();

  if (educator?.approval_status === "approved") {
    return "educator";
  }

  return "parent";
}

async function loadMessageRecipients(supabase: ReturnType<typeof getAdminClient>) {
  const recipients: MessageRecipient[] = [];

  const { data: approvedTutors, error: tutorsError } = await supabase
    .from("educator_directory")
    .select("email, full_name, approval_status")
    .eq("approval_status", "approved")
    .order("full_name", { ascending: true });

  if (tutorsError) {
    console.error("Failed to load approved tutors:", tutorsError.message);
  }

  (approvedTutors || []).forEach((tutor: any) => {
    const email = normalizeEmail(tutor.email);

    if (!email) return;

    recipients.push({
      email,
      name: tutor.full_name || email,
      role: "educator",
      status: tutor.approval_status || "approved",
      source: "educator_directory",
    });
  });

  const { data: applicants, error: applicantsError } = await supabase
    .from("educator_applications")
    .select("email, full_name, status")
    .order("full_name", { ascending: true });

  if (applicantsError) {
    console.error("Failed to load applicants:", applicantsError.message);
  }

  (applicants || []).forEach((applicant: any) => {
    const email = normalizeEmail(applicant.email);

    if (!email) return;

    recipients.push({
      email,
      name: applicant.full_name || email,
      role: "applicant",
      status: applicant.status || "submitted",
      source: "educator_applications",
    });
  });

  const { data: lessonParents, error: parentsError } = await supabase
    .from("tutor_lessons")
    .select("parent_email, student_name")
    .not("parent_email", "is", null);

  if (parentsError) {
    console.error("Failed to load parent recipients:", parentsError.message);
  }

  (lessonParents || []).forEach((lesson: any) => {
    const email = normalizeEmail(lesson.parent_email);

    if (!email) return;

    recipients.push({
      email,
      name: lesson.parent_email || email,
      role: "parent",
      status: lesson.student_name ? `Parent of ${lesson.student_name}` : null,
      source: "tutor_lessons",
    });
  });

  return uniqueRecipients(recipients);
}

async function validateAdminRecipient({
  supabase,
  recipientEmail,
  recipientRole,
}: {
  supabase: ReturnType<typeof getAdminClient>;
  recipientEmail: string;
  recipientRole: RecipientRole;
}) {
  const email = normalizeEmail(recipientEmail);

  if (!email) {
    return {
      ok: false,
      error: "Recipient email is required.",
    };
  }

  if (recipientRole === "admin") {
    return {
      ok: false,
      error: "Admin cannot send an admin-to-admin message from this route.",
    };
  }

  if (recipientRole === "educator") {
    const { data } = await supabase
      .from("educator_directory")
      .select("email, approval_status")
      .eq("email", email)
      .eq("approval_status", "approved")
      .maybeSingle();

    if (!data) {
      return {
        ok: false,
        error: "Approved tutor recipient not found.",
      };
    }

    return { ok: true, error: null };
  }

  if (recipientRole === "applicant") {
    const { data } = await supabase
      .from("educator_applications")
      .select("email, status")
      .eq("email", email)
      .maybeSingle();

    if (!data) {
      return {
        ok: false,
        error: "Tutor applicant recipient not found.",
      };
    }

    return { ok: true, error: null };
  }

  if (recipientRole === "parent") {
    const { data } = await supabase
      .from("tutor_lessons")
      .select("parent_email")
      .eq("parent_email", email)
      .limit(1);

    if (!data || data.length === 0) {
      return {
        ok: false,
        error: "Parent recipient not found in lesson records.",
      };
    }

    return { ok: true, error: null };
  }

  return {
    ok: false,
    error: "Invalid recipient role.",
  };
}

export async function GET(req: Request) {
  try {
    const { email, supabase } = await getUserFromRequest(req);
    const isAdmin = email === ADMIN_EMAIL;

    const url = new URL(req.url);
    const mode = url.searchParams.get("mode");

    if (mode === "recipients") {
      if (!isAdmin) {
        return NextResponse.json(
          { error: "Only admin can load recipient lists." },
          { status: 403 }
        );
      }

      const recipients = await loadMessageRecipients(supabase);

      return NextResponse.json({
        success: true,
        recipients,
      });
    }

    let query = supabase
      .from("internal_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (!isAdmin) {
      query = query.or(`sender_email.eq.${email},recipient_email.eq.${email}`);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      messages: data || [],
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to load messages.",
      },
      { status: 401 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { email, supabase } = await getUserFromRequest(req);

    const body = await req.json();

    const actualSenderRole = await getSenderRole(email, supabase);
    const requestedSenderRole = body.senderRole as SenderRole | undefined;
    const senderRole: SenderRole = actualSenderRole;

    const recipientRole = body.recipientRole as RecipientRole;

    const subject = String(body.subject || "").trim();
    const message = String(body.message || "").trim();

    let recipientEmail = normalizeEmail(body.recipientEmail);

    if (recipientRole === "admin") {
      recipientEmail = ADMIN_EMAIL;
    }

    if (!subject || !message) {
      return NextResponse.json(
        {
          error: "Subject and message are required.",
        },
        { status: 400 }
      );
    }

    if (!recipientRole) {
      return NextResponse.json(
        {
          error: "Recipient role is required.",
        },
        { status: 400 }
      );
    }

    if (requestedSenderRole && requestedSenderRole !== actualSenderRole) {
      return NextResponse.json(
        {
          error: "Sender role does not match the signed-in account.",
        },
        { status: 403 }
      );
    }

    if (!isAllowedMessage(senderRole, recipientRole)) {
      return NextResponse.json(
        {
          error: "This message route is not allowed.",
        },
        { status: 403 }
      );
    }

    if (senderRole === "admin") {
      const validation = await validateAdminRecipient({
        supabase,
        recipientEmail,
        recipientRole,
      });

      if (!validation.ok) {
        return NextResponse.json(
          {
            error: validation.error,
          },
          { status: 400 }
        );
      }
    }

    if (senderRole !== "admin" && recipientRole !== "admin") {
      return NextResponse.json(
        {
          error: "Parents and tutors can only message admin.",
        },
        { status: 403 }
      );
    }

    const { data, error } = await supabase
      .from("internal_messages")
      .insert({
        sender_email: email,
        sender_role: senderRole,
        recipient_email: recipientEmail,
        recipient_role: recipientRole,
        subject,
        message,
        status: "unread",
        related_lesson_id: body.relatedLessonId || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    try {
  if (recipientEmail) {
    const notificationRecipientRole: "admin" | "educator" | "parent" =
      recipientRole === "applicant" ? "educator" : recipientRole;

    await sendInternalMessageNotificationEmail({
      recipientEmail,
      recipientRole: notificationRecipientRole,
      senderRole,
      subject,
    });
  }
} catch (emailError) {
  console.error("Message notification email failed:", emailError);
}

    return NextResponse.json({
      success: true,
      message: data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to send message.",
      },
      { status: 401 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { email, supabase } = await getUserFromRequest(req);

    const body = await req.json();

    const id = body.id;
    const status = body.status;

    if (!id || !["read", "archived"].includes(status)) {
      return NextResponse.json(
        {
          error: "Valid message ID and status are required.",
        },
        { status: 400 }
      );
    }

    const isAdmin = email === ADMIN_EMAIL;

    let query = supabase
      .from("internal_messages")
      .update({ status })
      .eq("id", id);

    if (!isAdmin) {
      query = query.eq("recipient_email", email);
    }

    const { error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update message.",
      },
      { status: 401 }
    );
  }
}
