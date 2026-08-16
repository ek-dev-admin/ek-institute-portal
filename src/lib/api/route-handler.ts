import { NextResponse } from "next/server";

import { AUTH_COOKIES } from "@/lib/auth/constants";
import { serverEnv } from "@/lib/env";
import type { LoginResponse } from "@/types/api";

import { extractErrorMessage, parseErrorResponse } from "./errors";

export function apiError(
  status: number,
  message: string,
  details?: unknown,
) {
  return NextResponse.json(
    details !== undefined ? { message, details } : { message },
    { status },
  );
}

type ProxyOptions = {
  method?: string;
  body?: unknown;
};

export async function proxyToBackend(
  path: string,
  options: ProxyOptions = {},
) {
  const response = await fetch(`${serverEnv.BACKEND_API_URL}${path}`, {
    method: options.method ?? "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body:
      options.body === undefined
        ? undefined
        : JSON.stringify(options.body),
    cache: "no-store",
  });

  const payload = await response.json().catch(() => null);

  return { response, payload };
}

export async function proxyErrorResponse(
  response: Response,
  payload: unknown,
  fallbackMessage: string,
) {
  if (response.ok) {
    return null;
  }

  const message = extractErrorMessage(payload, fallbackMessage);

  return NextResponse.json({ message }, { status: response.status });
}

export function setAuthCookies(
  response: NextResponse,
  auth: Pick<LoginResponse, "accessToken" | "refreshToken">,
) {
  response.cookies.set(AUTH_COOKIES.access, auth.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });

  if (auth.refreshToken) {
    response.cookies.set(AUTH_COOKIES.refresh, auth.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set(AUTH_COOKIES.access, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  response.cookies.set(AUTH_COOKIES.refresh, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export { parseErrorResponse };
