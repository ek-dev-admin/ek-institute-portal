import "server-only";

import { cookies } from "next/headers";

import { ApiError, parseErrorResponse } from "@/lib/api/errors";
import { AUTH_COOKIES } from "@/lib/auth/constants";
import { serverEnv } from "@/lib/env";

type ServerApiOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export async function serverApiRequest<T>(
  path: string,
  options: ServerApiOptions = {},
): Promise<T> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_COOKIES.access)?.value;

  const headers = new Headers(options.headers);

  headers.set("Accept", "application/json");

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${serverEnv.BACKEND_API_URL}${path}`, {
    ...options,
    headers,
    body:
      options.body === undefined
        ? undefined
        : JSON.stringify(options.body),
    cache: options.cache ?? "no-store",
  });

  if (!response.ok) {
    const { message, details } = await parseErrorResponse(response);

    throw new ApiError(message, response.status, undefined, details);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
