import { NextResponse } from "next/server";

import { AUTH_COOKIES } from "@/lib/auth/constants";
import { serverEnv } from "@/lib/env";
import type { AuthUser } from "@/types/api";

export async function GET() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_COOKIES.access)?.value;

  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetch(`${serverEnv.BACKEND_API_URL}/auth/me`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        { message: payload?.message ?? "Unauthorized" },
        { status: response.status },
      );
    }

    return NextResponse.json(payload as AuthUser);
  } catch (error) {
    console.error("Me request failed:", error);
    return NextResponse.json(
      { message: "Unable to load profile" },
      { status: 500 },
    );
  }
}
