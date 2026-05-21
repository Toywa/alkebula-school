import { AccessToken } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const room = body.room;
    const username = body.username;
    const role = body.role || "participant";

    if (!room || !username) {
      return NextResponse.json(
        { error: "Room and username are required." },
        { status: 400 }
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

    const token = new AccessToken(apiKey, apiSecret, {
      identity: username,
      name: username,
      ttl: "2h",
    });

    token.addGrant({
      roomJoin: true,
      room,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    if (role === "educator" || role === "admin") {
      token.addGrant({
        roomAdmin: true,
      });
    }

    const jwt = await token.toJwt();

    return NextResponse.json({
      token: jwt,
      url: livekitUrl,
    });
  } catch (error) {
    console.error("LIVEKIT TOKEN ERROR:", error);

    return NextResponse.json(
      { error: "Failed to generate LiveKit token." },
      { status: 500 }
    );
  }
}