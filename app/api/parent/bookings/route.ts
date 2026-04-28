import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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

export async function GET() {
  const authClient = await getAuthClient();

  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getAdminClient();

  const { data: bookings, error } = await supabase
    .from("lesson_bookings")
    .select(
      `
      id,
      educator_id,
      parent_name,
      parent_email,
      student_name,
      curriculum,
      subject,
      class_level,
      booking_date,
      start_time,
      end_time,
      timezone,
      status,
      tutor_confirmation_status,
      created_at,
      educator_directory (
        full_name,
        email
      ),
      lesson_invoices (
        id,
        amount_usd,
        status,
        due_date,
        created_at
      )
    `
    )
    .eq("parent_email", user.email.toLowerCase())
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ bookings: bookings || [] });
}