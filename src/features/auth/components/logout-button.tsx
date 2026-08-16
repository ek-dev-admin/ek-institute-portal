"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { logout } from "@/features/auth/services/auth.api";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    try {
      await logout();
    } finally {
      router.replace("/login");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="rounded-sm border border-gold/40 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-gold transition hover:bg-gold/10 disabled:opacity-50"
    >
      {loading ? "Signing out..." : "Sign out"}
    </button>
  );
}
