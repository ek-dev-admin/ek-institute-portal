import Link from "next/link";
import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";

import { LogoutButton } from "@/features/auth/components/logout-button";
import type { AuthUser } from "@/types/api";

type DashboardShellProps = {
  user: AuthUser;
  children: ReactNode;
};

export function DashboardShell({ user, children }: DashboardShellProps) {
  const displayName = user.firstName || user.email;
  const verified = user.status === "active" || user.status === "approved";
  const attention = user.status === "rejected" || user.status === "suspended";
  const statusLabel = verified ? "Verified" : attention ? (user.status === "rejected" ? "Rejected" : "Suspended") : "Pending verification";
  const statusColor = verified ? "text-emerald-300" : attention ? "text-red-300" : "text-amber-300";

  return (
    <div className="min-h-screen bg-ink text-white">
      <header className="border-b border-white/10 bg-black/40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="font-display text-2xl text-gold">
              EK
            </Link>

            <nav className="hidden items-center gap-6 sm:flex">
              <Link
                href="/dashboard"
                className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70 transition hover:text-gold"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/profile"
                className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70 transition hover:text-gold"
              >
                Profile
              </Link>
              {(user.role === "admin" || user.roles?.includes("admin")) && (
                <Link
                  href="/dashboard/admin"
                  className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold transition hover:text-gold-light"
                >
                  Admin
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/profile"
              className="hidden text-sm text-white/60 transition hover:text-gold sm:inline"
            >
              <span className="inline-flex items-center gap-2">
                {displayName}
                <span className={statusColor} title={statusLabel} aria-label={statusLabel}>
                  <ShieldCheck className="h-4 w-4" />
                </span>
              </span>
            </Link>

            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">{children}</main>
    </div>
  );
}
