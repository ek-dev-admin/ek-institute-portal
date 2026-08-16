import { NextResponse } from "next/server";

import { signupRequestSchema } from "@/features/auth/schemas/signup.schema";
import {
  apiError,
  proxyErrorResponse,
  proxyToBackend,
} from "@/lib/api/route-handler";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const validation = signupRequestSchema.safeParse(body);

    if (!validation.success) {
      return apiError(
        400,
        "Invalid registration information",
        validation.error.flatten(),
      );
    }

    const { response, payload } = await proxyToBackend("/auth/signup", {
      body: validation.data,
    });

    const errorResponse = await proxyErrorResponse(
      response,
      payload,
      "Unable to create the account",
    );

    if (errorResponse) {
      return errorResponse;
    }

    const result = payload as {
      message?: string;
      userId?: string;
      requiresConfirmation?: boolean;
    };

    return NextResponse.json(
      {
        message: result?.message ?? "Account created successfully",
        userId: result?.userId,
        requiresConfirmation: result?.requiresConfirmation ?? true,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Signup request failed:", error);
    return apiError(500, "Unable to create the account");
  }
}
