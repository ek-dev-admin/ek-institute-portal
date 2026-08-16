import Link from "next/link";
import type { ReactNode } from "react";

import { LogoutButton } from "@/features/auth/components/logout-button";
import type { AuthUser } from "@/types/api";

type DashboardShellProps = {
  user: AuthUser;
  children: ReactNode;
};

export function DashboardShell({ user, children }: DashboardShellProps) {
  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;

  return (
    <div className="min-h-screen bg-ink text-white">
      <header className="border-b border-white/10 bg-black/40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="font-display text-2xl text-gold">
            EK
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-white/60 sm:inline">
              {displayName}
            </span>

            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">{children}</main>
    </div>
  );
}
