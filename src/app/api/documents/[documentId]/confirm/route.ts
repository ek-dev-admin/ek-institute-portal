import { NextResponse } from "next/server";
import { AUTH_COOKIES } from "@/lib/auth/constants";
import { serverEnv } from "@/lib/env";

export async function POST(_request: Request, { params }: { params: Promise<{ documentId: string }> }) {
  const { documentId } = await params;
  const { cookies } = await import("next/headers");
  const token = (await cookies()).get(AUTH_COOKIES.access)?.value;
  const response = await fetch(`${serverEnv.BACKEND_API_URL}/users/me/documents/${documentId}/confirm`, { method: "POST", headers: { Accept: "application/json", Authorization: `Bearer ${token ?? ""}` }, cache: "no-store" });
  return NextResponse.json(await response.json().catch(() => null), { status: response.status });
}
