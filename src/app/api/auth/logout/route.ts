import { NextResponse } from "next/server";

import { clearAuthCookies } from "@/lib/api/route-handler";

export async function POST() {
  const response = NextResponse.json({ message: "Signed out" });
  clearAuthCookies(response);
  return response;
}
