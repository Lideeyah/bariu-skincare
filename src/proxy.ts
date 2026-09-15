import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, isValidAdminSessionToken } from "@/lib/adminAuth";

export const config = {
  matcher: ["/results/:path*"],
};

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/results/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const valid = await isValidAdminSessionToken(token);

  if (!valid) {
    const url = new URL("/results/login", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
