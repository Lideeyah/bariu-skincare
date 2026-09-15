import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, getAdminSessionToken, isCorrectAdminPassword } from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");

  let correct: boolean;
  try {
    correct = isCorrectAdminPassword(password);
  } catch {
    return NextResponse.json(
      { error: "Server is missing ADMIN_PASSWORD configuration." },
      { status: 500 },
    );
  }

  if (!correct) {
    const url = new URL("/results/login", request.url);
    url.searchParams.set("error", "1");
    return NextResponse.redirect(url, { status: 303 });
  }

  const token = await getAdminSessionToken();
  const response = NextResponse.redirect(new URL("/results", request.url), { status: 303 });
  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
