import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ADMIN_ALLOWED_EMAILS = ["sunscapecars@gmail.com"];

function money(value: unknown) {
  const amount = Number(value || 0);
  return Number.isFinite(amount) ? amount : 0;
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

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "").trim();

    if (!token) {
      return NextResponse.json(
        { error: "Missing admin session token." },
        { status: 401 }
      );
    }

    const supabase = getAdminClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user?.email) {
      return NextResponse.json(
        { error: "Invalid admin session." },
        { status: 401 }
      );
    }

    const email = user.email.toLowerCase();

    if (!ADMIN_ALLOWED_EMAILS.includes(email)) {
      return NextResponse.json(
        { error: "Unauthorized admin access." },
        { status: 403 }
      );
    }

    const { data: lessons, error } = await supabase
      .from("tutor_lessons")
      .select(
        `
        id,
        tutor_email,
        parent_email,
        student_name,
        subject,
        curriculum,
        lesson_date,
        start_time,
        end_time,
        status,
        payment_status,
        hourly_rate,
        lesson_amount,
        platform_commission,
        tutor_payout_amount,
        paystack_reference,
        paid_at,
        payout_status,
        payout_date,
        payout_reference,
        created_at
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const rows = lessons || [];

    const paidLessons = rows.filter(
      (lesson) => lesson.payment_status === "paid"
    );

    const unpaidLessons = rows.filter(
      (lesson) => lesson.payment_status !== "paid"
    );

    const totalRevenue = paidLessons.reduce(
      (total, lesson) =>
        total + money(lesson.lesson_amount || lesson.hourly_rate),
      0
    );

    const totalPotentialRevenue = rows.reduce(
      (total, lesson) =>
        total + money(lesson.lesson_amount || lesson.hourly_rate),
      0
    );

    const platformCommissionEarned = paidLessons.reduce(
      (total, lesson) =>
        total +
        money(
          lesson.platform_commission ||
            money(lesson.lesson_amount || lesson.hourly_rate) * 0.3
        ),
      0
    );

    const tutorPayoutLiability = paidLessons
      .filter((lesson) => lesson.payout_status !== "paid")
      .reduce(
        (total, lesson) =>
          total +
          money(
            lesson.tutor_payout_amount ||
              money(lesson.lesson_amount || lesson.hourly_rate) * 0.7
          ),
        0
      );

    const totalTutorPaidOut = paidLessons
      .filter((lesson) => lesson.payout_status === "paid")
      .reduce(
        (total, lesson) =>
          total +
          money(
            lesson.tutor_payout_amount ||
              money(lesson.lesson_amount || lesson.hourly_rate) * 0.7
          ),
        0
      );

    const pendingPayouts = paidLessons.filter(
      (lesson) => lesson.payout_status !== "paid"
    );

    const byTutor = rows.reduce<Record<string, any>>((acc, lesson) => {
      const tutorEmail = lesson.tutor_email || "Unknown tutor";
      const amount = money(lesson.lesson_amount || lesson.hourly_rate);
      const commission = money(lesson.platform_commission || amount * 0.3);
      const payout = money(lesson.tutor_payout_amount || amount * 0.7);
      const isPaid = lesson.payment_status === "paid";
      const payoutPaid = lesson.payout_status === "paid";

      if (!acc[tutorEmail]) {
        acc[tutorEmail] = {
          tutor_email: tutorEmail,
          total_lessons: 0,
          paid_lessons: 0,
          unpaid_lessons: 0,
          gross_revenue: 0,
          platform_commission: 0,
          tutor_earned: 0,
          tutor_paid_out: 0,
          tutor_payout_pending: 0,
        };
      }

      acc[tutorEmail].total_lessons += 1;

      if (isPaid) {
        acc[tutorEmail].paid_lessons += 1;
        acc[tutorEmail].gross_revenue += amount;
        acc[tutorEmail].platform_commission += commission;
        acc[tutorEmail].tutor_earned += payout;

        if (payoutPaid) {
          acc[tutorEmail].tutor_paid_out += payout;
        } else {
          acc[tutorEmail].tutor_payout_pending += payout;
        }
      } else {
        acc[tutorEmail].unpaid_lessons += 1;
      }

      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      metrics: {
        total_revenue: totalRevenue,
        total_potential_revenue: totalPotentialRevenue,
        paid_lessons: paidLessons.length,
        unpaid_lessons: unpaidLessons.length,
        total_lessons: rows.length,
        platform_commission_earned: platformCommissionEarned,
        tutor_payout_liability: tutorPayoutLiability,
        total_tutor_paid_out: totalTutorPaidOut,
        pending_payout_count: pendingPayouts.length,
      },
      lessons: rows,
      tutor_summaries: Object.values(byTutor),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Finance dashboard failed.",
      },
      { status: 500 }
    );
  }
}