import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/results/login", request.url), { status: 303 });
  response.cookies.delete(ADMIN_COOKIE_NAME);
  return response;
}
