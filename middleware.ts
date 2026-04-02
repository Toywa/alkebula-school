import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPrefixes = ["/admin", "/educator", "/parent", "/student"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
  if (!isProtected) return NextResponse.next();

  // TODO:
  // 1. Read session from Supabase auth cookie
  // 2. Determine user role
  // 3. Redirect if unauthenticated or wrong role

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/educator/:path*", "/parent/:path*", "/student/:path*"]
};
