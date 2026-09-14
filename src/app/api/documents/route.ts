import { NextResponse } from "next/server";
import { AUTH_COOKIES } from "@/lib/auth/constants";
import { serverEnv } from "@/lib/env";

async function backendRequest(path: string, init: RequestInit = {}) {
  const { cookies } = await import("next/headers");
  const token = (await cookies()).get(AUTH_COOKIES.access)?.value;
  return fetch(`${serverEnv.BACKEND_API_URL}${path}`, {
    ...init,
    headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: `Bearer ${token ?? ""}`, ...init.headers },
    cache: "no-store",
  });
}

export async function GET() {
  const response = await backendRequest("/users/me/documents");
  return NextResponse.json(await response.json().catch(() => null), { status: response.status });
}

export async function POST(request: Request) {
  const response = await backendRequest("/users/me/documents/upload-url", { method: "POST", body: JSON.stringify(await request.json()) });
  return NextResponse.json(await response.json().catch(() => null), { status: response.status });
}
