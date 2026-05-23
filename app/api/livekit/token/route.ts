import { AccessToken } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ADMIN_EMAIL = "admin@alkebulaschool.com";

const EARLY_JOIN_MINUTES = 15;
const AFTER_LESSON_GRACE_MINUTES = 30;

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

function buildLessonDateTime(date?: string | null, time?: string | null) {
  if (!date || !time) return null;

  const cleanTime = String(time).slice(0, 5);
  const value = new Date(`${date}T${cleanTime}:00`);

  if (Number.isNaN(value.getTime())) return null;

  return value;
}

function isWithinLessonWindow({
  lessonDate,
  startTime,
  endTime,
}: {
  lessonDate?: string | null;
  startTime?: string | null;
  endTime?: string | null;
}) {
  const lessonStart = buildLessonDateTime(lessonDate, startTime);
  const lessonEnd = buildLessonDateTime(lessonDate, endTime);

  if (!lessonStart || !lessonEnd) {
    return {
      allowed: false,
      message:
        "This lesson does not have a valid scheduled date/time. Please contact admin.",
    };
  }

  const opensAt = new Date(
    lessonStart.getTime() - EARLY_JOIN_MINUTES * 60 * 1000
  );

  const closesAt = new Date(
    lessonEnd.getTime() + AFTER_LESSON_GRACE_MINUTES * 60 * 1000
  );

  const now = new Date();

  if (now < opensAt) {
    return {
      allowed: false,
      message: `This classroom opens ${EARLY_JOIN_MINUTES} minutes before the lesson starts.`,
      opensAt: opensAt.toISOString(),
      closesAt: closesAt.toISOString(),
    };
  }

  if (now > closesAt) {
    return {
      allowed: false,
      message: `This classroom closed ${AFTER_LESSON_GRACE_MINUTES} minutes after the lesson ended.`,
      opensAt: opensAt.toISOString(),
      closesAt: closesAt.toISOString(),
    };
  }

  return {
    allowed: true,
    opensAt: opensAt.toISOString(),
    closesAt: closesAt.toISOString(),
  };
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization") || "";
    const tokenFromHeader = authHeader.replace("Bearer ", "").trim();

    if (!tokenFromHeader) {
      return NextResponse.json(
        { error: "You must be signed in to join this classroom." },
        { status: 401 }
      );
    }

    const supabase = getAdminClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(tokenFromHeader);

    if (userError || !user?.email) {
      return NextResponse.json(
        { error: "Invalid session. Please sign in again." },
        { status: 401 }
      );
    }

    const signedInEmail = normalizeEmail(user.email);

    const body = await request.json();
    const room = String(body.room || "").trim();
    const username = String(body.username || "").trim();

    if (!room || !username) {
      return NextResponse.json(
        { error: "Room and username are required." },
        { status: 400 }
      );
    }

    const { data: lesson, error: lessonError } = await supabase
      .from("tutor_lessons")
      .select(
        "id,tutor_email,parent_email,student_name,subject,lesson_date,start_time,end_time,status"
      )
      .eq("id", room)
      .single();

    if (lessonError || !lesson) {
      return NextResponse.json(
        { error: "Classroom lesson was not found." },
        { status: 404 }
      );
    }

    const tutorEmail = normalizeEmail(lesson.tutor_email);
    const parentEmail = normalizeEmail(lesson.parent_email);

    const isAdmin = signedInEmail === ADMIN_EMAIL;
    const isTutor = signedInEmail === tutorEmail;
    const isParent = signedInEmail === parentEmail;

    if (!isAdmin && !isTutor && !isParent) {
      return NextResponse.json(
        { error: "You are not authorized to join this classroom." },
        { status: 403 }
      );
    }

    const lessonWindow = isWithinLessonWindow({
      lessonDate: lesson.lesson_date,
      startTime: lesson.start_time,
      endTime: lesson.end_time,
    });

    if (!lessonWindow.allowed && !isAdmin) {
      return NextResponse.json(
        {
          error: lessonWindow.message,
          opensAt: lessonWindow.opensAt,
          closesAt: lessonWindow.closesAt,
        },
        { status: 403 }
      );
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const livekitUrl = process.env.LIVEKIT_URL;

    if (!apiKey || !apiSecret || !livekitUrl) {
      return NextResponse.json(
        { error: "LiveKit environment variables missing." },
        { status: 500 }
      );
    }

    const role = isAdmin ? "admin" : isTutor ? "educator" : "parent";

    const accessToken = new AccessToken(apiKey, apiSecret, {
      identity: signedInEmail,
      name: username,
      ttl: "2h",
    });

    accessToken.addGrant({
      roomJoin: true,
      room,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
      roomAdmin: role === "admin" || role === "educator",
    });

    const jwt = await accessToken.toJwt();

    return NextResponse.json({
      token: jwt,
      url: livekitUrl,
      role,
      lesson,
      lessonWindow,
    });
  } catch (error) {
    console.error("LIVEKIT TOKEN ERROR:", error);

    return NextResponse.json(
      { error: "Failed to generate LiveKit token." },
      { status: 500 }
    );
  }
}