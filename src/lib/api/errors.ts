export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type ErrorPayload = {
  message?: unknown;
  error?: unknown;
  statusCode?: number;
  code?: string;
  details?: unknown;
};

export function extractErrorMessage(
  payload: unknown,
  fallback: string,
): string {
  if (typeof payload === "string" && payload.trim()) {
    return payload;
  }

  if (!payload || typeof payload !== "object") {
    return fallback;
  }

  const data = payload as ErrorPayload;
  const { message } = data;

  if (typeof message === "string" && message.trim()) {
    return message;
  }

  if (Array.isArray(message)) {
    const parts = message.filter(
      (item): item is string => typeof item === "string" && item.trim().length > 0,
    );

    if (parts.length > 0) {
      return parts.join(". ");
    }
  }

  if (message && typeof message === "object") {
    const nested = extractErrorMessage(message, "");

    if (nested) {
      return nested;
    }
  }

  if (typeof data.error === "string" && data.error.trim()) {
    return data.error;
  }

  if (data.details && typeof data.details === "object") {
    const details = data.details as {
      fieldErrors?: Record<string, string[]>;
      formErrors?: string[];
    };

    const fieldMessages = Object.values(details.fieldErrors ?? {}).flat();
    const formMessages = details.formErrors ?? [];
    const all = [...formMessages, ...fieldMessages].filter(Boolean);

    if (all.length > 0) {
      return all.join(". ");
    }
  }

  return fallback;
}

export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong",
): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return extractErrorMessage(error, fallback);
}

export async function parseErrorResponse(
  response: Response,
): Promise<{ message: string; details?: unknown }> {
  const payload = await response.json().catch(() => null);

  return {
    message: extractErrorMessage(
      payload,
      `Request failed (${response.status})`,
    ),
    details: payload,
  };
}
