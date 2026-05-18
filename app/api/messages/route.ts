import { sendInternalMessageNotificationEmail } from "@/lib/message-email";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ADMIN_EMAIL = "admin@alkebulaschool.com";

type SenderRole = "admin" | "educator" | "parent";
type RecipientRole = "admin" | "educator" | "parent";

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

function isAllowedMessage(
  senderRole: SenderRole,
  recipientRole: RecipientRole
) {
  return (
    (senderRole === "educator" && recipientRole === "admin") ||
    (senderRole === "parent" && recipientRole === "admin") ||
    (senderRole === "admin" &&
      (recipientRole === "educator" || recipientRole === "parent"))
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

export async function GET(req: Request) {
  try {
    const { email, supabase } = await getUserFromRequest(req);

    const isAdmin = email === ADMIN_EMAIL;

    let query = supabase
      .from("internal_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (!isAdmin) {
      query = query.or(
        `sender_email.eq.${email},recipient_email.eq.${email}`
      );
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messages: data || [],
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load messages.",
      },
      { status: 401 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { email, supabase } = await getUserFromRequest(req);

    const body = await req.json();

    const senderRole = body.senderRole as SenderRole;
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

    if (!senderRole || !recipientRole) {
      return NextResponse.json(
        {
          error: "Sender and recipient roles are required.",
        },
        { status: 400 }
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

    if (senderRole === "admin" && email !== ADMIN_EMAIL) {
      return NextResponse.json(
        {
          error: "Only admin can send admin messages.",
        },
        { status: 403 }
      );
    }

    if (senderRole !== "admin" && email === ADMIN_EMAIL) {
      return NextResponse.json(
        {
          error: "Admin account must send as admin.",
        },
        { status: 403 }
      );
    }

    if (senderRole === "admin" && !recipientEmail) {
      return NextResponse.json(
        {
          error: "Recipient email is required.",
        },
        { status: 400 }
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
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    try {
      if (recipientEmail) {
        await sendInternalMessageNotificationEmail({
          recipientEmail: recipientEmail,
          recipientRole: recipientRole,
          senderRole: senderRole,
          subject: subject,
        });
      }
    } catch (emailError) {
      console.error(
        "Message notification email failed:",
        emailError
      );
    }

    return NextResponse.json({
      success: true,
      message: data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to send message.",
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
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update message.",
      },
      { status: 401 }
    );
  }
}