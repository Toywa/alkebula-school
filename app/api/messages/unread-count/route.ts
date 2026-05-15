import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ADMIN_EMAIL = "sunscapecars@gmail.com";

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

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "").trim();

    if (!token) {
      return NextResponse.json({ error: "Missing session token." }, { status: 401 });
    }

    const supabase = getAdminClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user?.email) {
      return NextResponse.json({ error: "Invalid session." }, { status: 401 });
    }

    const email = user.email.toLowerCase();
    const isAdmin = email === ADMIN_EMAIL;

    let query = supabase
      .from("internal_messages")
      .select("id", { count: "exact", head: true })
      .eq("status", "unread");

    if (isAdmin) {
      query = query.eq("recipient_role", "admin");
    } else {
      query = query.eq("recipient_email", email);
    }

    const { count, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      unread_count: count || 0,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to load unread count.",
      },
      { status: 500 }
    );
  }
}