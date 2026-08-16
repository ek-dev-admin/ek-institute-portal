import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { serverApiRequest } from "@/lib/api/server";
import type { AuthUser } from "@/types/api";

import { AUTH_COOKIES } from "./constants";

export { AUTH_COOKIES };

export type Session = {
  accessToken: string;
  user?: AuthUser;
};

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_COOKIES.access)?.value;

  if (!accessToken) {
    return null;
  }

  return { accessToken };
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await getSession();

  if (!session) {
    return null;
  }

  try {
    const user = await serverApiRequest<AuthUser>("/auth/me");
    return user;
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<Session & { user: AuthUser }> {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const user = await getCurrentUser();

  if (user) {
    return { ...session, user };
  }

  return {
    ...session,
    user: {
      id: "unknown",
      email: "Member",
    },
  };
}
