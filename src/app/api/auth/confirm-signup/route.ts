import { NextResponse } from "next/server";

import { confirmSignupSchema } from "@/features/auth/schemas/signup.schema";
import {
  apiError,
  proxyErrorResponse,
  proxyToBackend,
} from "@/lib/api/route-handler";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const validation = confirmSignupSchema.safeParse(body);

    if (!validation.success) {
      return apiError(
        400,
        "Invalid confirmation information",
        validation.error.flatten(),
      );
    }

    const { response, payload } = await proxyToBackend("/auth/verify", {
      body: validation.data,
    });

    const errorResponse = await proxyErrorResponse(
      response,
      payload,
      "Unable to confirm the account",
    );

    if (errorResponse) {
      return errorResponse;
    }

    return NextResponse.json({
      message: "Your account has been confirmed",
    });
  } catch (error) {
    console.error("Confirm signup request failed:", error);
    return apiError(500, "Unable to confirm the account");
  }
}
