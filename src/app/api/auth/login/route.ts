import { NextResponse } from "next/server";

import { loginSchema } from "@/features/auth/schemas/login.schema";
import {
  apiError,
  proxyErrorResponse,
  proxyToBackend,
  setAuthCookies,
} from "@/lib/api/route-handler";
import type { LoginResponse } from "@/types/api";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return apiError(400, "Invalid credentials", validation.error.flatten());
    }

    const { response, payload } = await proxyToBackend("/auth/login", {
      body: validation.data,
    });

    const errorResponse = await proxyErrorResponse(
      response,
      payload,
      "Invalid credentials",
    );

    if (errorResponse) {
      return errorResponse;
    }

    const auth = payload as LoginResponse;
    const nextResponse = NextResponse.json({ user: auth.user });

    setAuthCookies(nextResponse, auth);

    return nextResponse;
  } catch (error) {
    console.error("Login request failed:", error);
    return apiError(500, "Unable to sign in");
  }
}
