import { NextResponse } from "next/server";

import { serverEnv } from "@/lib/env";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(
      `${serverEnv.BACKEND_API_URL}/auth/forgot-password`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    // Handle responses with no content.
    if (response.status === 204) {
      return new NextResponse(null, {
        status: 204,
      });
    }

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
  } catch (error) {
    console.error("Forgot password error:", error);

    return NextResponse.json(
      {
        message: "Unable to process password reset request",
      },
      {
        status: 500,
      },
    );
  }
}