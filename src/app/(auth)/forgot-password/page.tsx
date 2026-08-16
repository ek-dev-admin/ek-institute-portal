import type { Metadata } from "next";
import Link from "next/link";

import { AuthShell } from "@/components/layout/auth-shell";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password | Executive Cooperation",
  description: "Reset your Executive Cooperation account password.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Forgot your password?"
      description="Enter your email address and we'll send you instructions to reset your password."
      footer={
        <p className="text-center text-sm text-white/55">
          <Link
            href="/login"
            className="text-[#d9ad62] transition hover:text-[#f2ca80]"
          >
            Back to sign in
          </Link>
        </p>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}