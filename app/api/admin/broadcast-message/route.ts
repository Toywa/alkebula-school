import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ADMIN_ALLOWED_EMAILS = [
  "admin@alkebulaschool.com",
];

type BroadcastAudience = "tutors" | "parents" | "both";

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

function uniqueEmails(emails: string[]) {
  return Array.from(
    new Set(
      emails
        .map((email) => normalizeEmail(email))
        .filter(Boolean)
    )
  );
}

export async function POST(req: Request) {
  try {
    const { email, supabase } = await getUserFromRequest(req);

    if (!ADMIN_ALLOWED_EMAILS.includes(email)) {
      return NextResponse.json(
        { error: "Unauthorized admin access." },
        { status: 403 }
      );
    }

    const body = await req.json();

    const audience = String(body.audience || "") as BroadcastAudience;
    const subject = String(body.subject || "").trim();
    const message = String(body.message || "").trim();

    if (!["tutors", "parents", "both"].includes(audience)) {
      return NextResponse.json(
        { error: "Choose a valid broadcast audience." },
        { status: 400 }
      );
    }

    if (!subject || !message) {
      return NextResponse.json(
        { error: "Subject and message are required." },
        { status: 400 }
      );
    }

    let tutorEmails: string[] = [];
    let parentEmails: string[] = [];

    if (audience === "tutors" || audience === "both") {
      const { data: tutors, error: tutorError } = await supabase
  .from("educator_directory")
  .select("email")
  .eq("approval_status", "approved")
  .neq("email", "admin@alkebulaschool.com");

      if (tutorError) {
        return NextResponse.json(
          { error: tutorError.message },
          { status: 500 }
        );
      }

      tutorEmails = uniqueEmails(
        (tutors || []).map((item) => item.email)
      );
    }

    if (audience === "parents" || audience === "both") {
      const { data: parents, error: parentError } = await supabase
        .from("users")
        .select("email")
        .eq("role", "parent");

      if (parentError) {
        return NextResponse.json(
          { error: parentError.message },
          { status: 500 }
        );
      }

      parentEmails = uniqueEmails(
        (parents || []).map((item) => item.email)
      );
    }

    const messageRows = [
      ...tutorEmails.map((recipientEmail) => ({
        sender_email: email,
        sender_role: "admin",
        recipient_email: recipientEmail,
        recipient_role: "educator",
        subject,
        message,
        status: "unread",
      })),
      ...parentEmails.map((recipientEmail) => ({
        sender_email: email,
        sender_role: "admin",
        recipient_email: recipientEmail,
        recipient_role: "parent",
        subject,
        message,
        status: "unread",
      })),
    ];

    if (messageRows.length === 0) {
      return NextResponse.json(
        { error: "No recipients found for this broadcast." },
        { status: 404 }
      );
    }

    const { error: insertError } = await supabase
      .from("internal_messages")
      .insert(messageRows);

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      audience,
      sent_count: messageRows.length,
      tutor_count: tutorEmails.length,
      parent_count: parentEmails.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to send broadcast.",
      },
      { status: 500 }
    );
  }
}