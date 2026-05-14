import { NextResponse } from "next/server";
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

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      lessonId,
      parentEmail,
      amount,
      studentName,
      subject,
    } = body;

    if (!lessonId || !parentEmail || !amount) {
      return NextResponse.json(
        { error: "Missing payment details." },
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

    const reference = `ALK-${lessonId}-${Date.now()}`;

    const callbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/parent/payments/verify`;

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
          amount: Math.round(Number(amount) * 100),
          reference,
          callback_url: callbackUrl,
          metadata: {
            lessonId,
            studentName,
            subject,
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

    const supabase = getAdminClient();

    await supabase
      .from("tutor_lessons")
      .update({
        paystack_reference: reference,
        paystack_access_code: data.data.access_code,
        paystack_authorization_url: data.data.authorization_url,
      })
      .eq("id", lessonId);

    return NextResponse.json({
      success: true,
      authorization_url: data.data.authorization_url,
      access_code: data.data.access_code,
      reference,
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