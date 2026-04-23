import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendBookingEmails } from "@/lib/email";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Booking route is alive",
    hasResendKey: !!process.env.RESEND_API_KEY,
    hasEmailFrom: !!process.env.EMAIL_FROM,
    hasAdminEmail: !!process.env.ADMIN_EMAIL,
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      parentEmail,
      tutorEmail,
      studentName,
      subject,
      date,
      time,
    } = body;

    const { data, error } = await supabase
      .from("bookings")
      .insert([
        {
          parent_email: parentEmail,
          tutor_email: tutorEmail,
          student_name: studentName,
          subject,
          date,
          time,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Booking error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const emailResult = await sendBookingEmails({
      parentEmail,
      tutorEmail,
      studentName,
      subject,
      date,
      time,
    });

    return NextResponse.json({
      success: true,
      booking: data,
      emailResult,
    });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}