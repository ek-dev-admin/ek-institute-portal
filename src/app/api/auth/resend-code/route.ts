import { NextResponse } from "next/server";

import { serverEnv } from "@/lib/env";

export async function POST(request: Request) {
  const body = await request.json();

  const response = await fetch(
    `${serverEnv.BACKEND_API_URL}/auth/resend-code`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  }

  const text = await response.text();

  return new NextResponse(text || null, {
    status: response.status,
  });
}