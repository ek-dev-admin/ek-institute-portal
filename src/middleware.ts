import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { AUTH_COOKIES } from "@/lib/auth/constants";

const authPaths = ["/login", "/signup", "/confirm-signup"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIES.access)?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard") && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (authPaths.some(path => pathname.startsWith(path)) && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup", "/confirm-signup"],
};
