import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { AuthShell } from "@/components/layout/auth-shell";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Sign In | Executive Cooperation",
  description: "Sign in to your Executive Cooperation account.",
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Member access"
      description="Sign in to access your dashboard."
      footer={
        <p className="text-center text-sm text-white/55">
          <Link href="/" className="text-[#d9ad62] transition hover:text-[#f2ca80]">
            Back to home
          </Link>
        </p>
      }
    >
      <Suspense fallback={<p className="text-sm text-white/60">Loading...</p>}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
