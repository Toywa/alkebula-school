import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const COUNTER_ID = "platform_visits";
const BASELINE_TOTAL = 100456;

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase environment variables are missing.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

async function ensureCounter() {
  const supabase = getSupabaseAdmin();

  const { data: existing, error: readError } = await supabase
    .from("platform_counters")
    .select("id,total")
    .eq("id", COUNTER_ID)
    .maybeSingle();

  if (readError) {
    throw readError;
  }

  if (existing) {
    return existing;
  }

  const { data: created, error: createError } = await supabase
    .from("platform_counters")
    .insert({
      id: COUNTER_ID,
      total: BASELINE_TOTAL,
      updated_at: new Date().toISOString(),
    })
    .select("id,total")
    .single();

  if (createError) {
    throw createError;
  }

  return created;
}

export async function GET() {
  try {
    const counter = await ensureCounter();

    return NextResponse.json({
      ok: true,
      total: Number(counter.total || BASELINE_TOTAL),
    });
  } catch (error) {
    console.error("Platform visits GET error:", error);

    return NextResponse.json(
      {
        ok: false,
        total: BASELINE_TOTAL,
        error: "Could not load platform visits.",
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const supabase = getSupabaseAdmin();

    await ensureCounter();

    const { data, error } = await supabase.rpc("increment_platform_counter", {
      counter_id: COUNTER_ID,
      increment_by: 1,
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      ok: true,
      total: Number(data || BASELINE_TOTAL),
    });
  } catch (error) {
    console.error("Platform visits POST error:", error);

    return NextResponse.json(
      {
        ok: false,
        total: BASELINE_TOTAL,
        error: "Could not update platform visits.",
      },
      { status: 500 }
    );
  }
}
