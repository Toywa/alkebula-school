import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase environment variables are missing.");
  }

  return createClient(url, key);
}

export async function POST(req: Request) {
  try {
    const { name, email, message, subject, level, challenge } =
      await req.json();

    const supabase = getSupabase();

    const { error } = await supabase.from("leads").insert([
      {
        name,
        email,
        message,
        subject,
        level,
        challenge,
      },
    ]);

    if (error) {
      console.error("Lead capture error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Lead route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}