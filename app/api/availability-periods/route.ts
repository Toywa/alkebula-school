import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

function buildPeriodData(baseDate: Date) {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();

  const day = baseDate.getDate();

  if (day <= 15) {
    const start = new Date(year, month, 15 + 1);
    const end = new Date(year, month + 1, 0);
    const deadline = new Date(year, month, 15);

    return {
      periodLabel: `Period 2 of ${start.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      })}`,
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
      submissionDeadline: deadline.toISOString().slice(0, 10),
    };
  }

  const nextMonthStart = new Date(year, month + 1, 1);
  const nextMonthMid = new Date(year, month + 1, 15);
  const deadline = new Date(year, month + 1, 0);

  return {
    periodLabel: `Period 1 of ${nextMonthStart.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    })}`,
    startDate: nextMonthStart.toISOString().slice(0, 10),
    endDate: nextMonthMid.toISOString().slice(0, 10),
    submissionDeadline: deadline.toISOString().slice(0, 10),
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const educatorId = body.educatorId as string | undefined;

    if (!educatorId || !educatorId.trim()) {
      return NextResponse.json(
        { ok: false, error: "Educator ID is required." },
        { status: 400 }
      );
    }

    const now = new Date();
    const periodData = buildPeriodData(now);

    const supabase = createAdminSupabaseClient();

    const { data: existing } = await supabase
      .from("educator_availability_periods")
      .select("*")
      .eq("educator_id", educatorId)
      .eq("period_label", periodData.periodLabel)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({
        ok: true,
        period: existing,
      });
    }

    const { data, error } = await supabase
      .from("educator_availability_periods")
      .insert([
        {
          educator_id: educatorId,
          period_label: periodData.periodLabel,
          start_date: periodData.startDate,
          end_date: periodData.endDate,
          submission_deadline: periodData.submissionDeadline,
          status: "pending",
        },
      ])
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message || "Failed to create period." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      period: data,
    });
  } catch (error) {
    console.error("Availability period route error:", error);
    return NextResponse.json(
      { ok: false, error: "Unexpected server error." },
      { status: 500 }
    );
  }
}