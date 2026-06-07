import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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
  return (email || "").trim().toLowerCase();
}

function money(value: unknown) {
  const amount = Number(value || 0);
  return Number.isFinite(amount) ? amount : 0;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getAdminClient();

    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "").trim();

    if (!token) {
      return NextResponse.json(
        { error: "Please sign in before making payment." },
        { status: 401 }
      );
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user?.email) {
      return NextResponse.json(
        { error: "Session expired. Please sign in again." },
        { status: 401 }
      );
    }

    const parentEmail = normalizeEmail(user.email);

    const body = await req.json();
    const lessonId = String(body.lessonId || "").trim();

    if (!lessonId) {
      return NextResponse.json(
        { error: "Missing lesson ID." },
        { status: 400 }
      );
    }

    const { data: lesson, error: lessonError } = await supabase
      .from("tutor_lessons")
      .select(
        "id,parent_email,tutor_email,student_name,subject,curriculum,lesson_date,start_time,end_time,lesson_amount,hourly_rate,payment_status,paystack_reference"
      )
      .eq("id", lessonId)
      .single();

    if (lessonError || !lesson) {
      return NextResponse.json(
        {
          error:
            lessonError?.message ||
            "Lesson not found. Please refresh and try again.",
        },
        { status: 404 }
      );
    }

    if (normalizeEmail(lesson.parent_email) !== parentEmail) {
      return NextResponse.json(
        { error: "You are not allowed to pay for this lesson." },
        { status: 403 }
      );
    }

    if (lesson.payment_status === "paid") {
      return NextResponse.json(
        { error: "This lesson has already been paid for." },
        { status: 400 }
      );
    }

    const officialAmount = money(lesson.lesson_amount || lesson.hourly_rate);

    if (officialAmount <= 0) {
      return NextResponse.json(
        {
          error:
            "This lesson does not have a valid payable amount. Please contact admin.",
        },
        { status: 400 }
      );
    }

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;

    if (!paystackSecret) {
      return NextResponse.json(
        { error: "Missing PAYSTACK_SECRET_KEY." },
        { status: 500 }
      );
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://www.alkebulaschool.com";

    const reference = `ALK-${lessonId}-${Date.now()}`;
    const callbackUrl = `${siteUrl}/parent/payments/verify`;

    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: parentEmail,
          amount: Math.round(officialAmount * 100),
           currency: "USD",
          reference,
          callback_url: callbackUrl,
          metadata: {
            lessonId: lesson.id,
            parentEmail,
            tutorEmail: lesson.tutor_email,
            studentName: lesson.student_name,
            subject: lesson.subject,
            curriculum: lesson.curriculum,
            lessonDate: lesson.lesson_date,
            startTime: lesson.start_time,
            endTime: lesson.end_time,
            amount: officialAmount,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.status) {
      return NextResponse.json(
        {
          error: data.message || "Failed to initialize payment.",
        },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabase
      .from("tutor_lessons")
      .update({
        paystack_reference: reference,
        paystack_access_code: data.data.access_code,
        paystack_authorization_url: data.data.authorization_url,
      })
      .eq("id", lessonId)
      .eq("parent_email", parentEmail);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      authorization_url: data.data.authorization_url,
      access_code: data.data.access_code,
      reference,
      amount: officialAmount,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to initialize payment.",
      },
      { status: 500 }
    );
  }
}