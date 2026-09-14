import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { AUTH_COOKIES } from "@/lib/auth/constants";
import { serverEnv } from "@/lib/env";

export async function PATCH(request: Request, { params }: { params: Promise<{ cognitoSub: string }> }) {
  const { cognitoSub } = await params;
  const token = (await cookies()).get(AUTH_COOKIES.access)?.value;
  const response = await fetch(`${serverEnv.BACKEND_API_URL}/users/${cognitoSub}/status`, {
    method: "PATCH",
    headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: `Bearer ${token ?? ""}` },
    body: JSON.stringify(await request.json()),
    cache: "no-store",
  });
  const payload = await response.json().catch(() => null);
  return NextResponse.json(payload, { status: response.status });
}
