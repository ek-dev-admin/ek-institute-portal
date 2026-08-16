import type { Metadata } from "next";
import Link from "next/link";

import { AuthShell } from "@/components/layout/auth-shell";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password | Executive Cooperation",
  description: "Create a new password for your Executive Cooperation account.",
};

type ResetPasswordPageProps = {
  searchParams: Promise<{
    email?: string;
  }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { email = "" } = await searchParams;

  return (
    <AuthShell
      title="Create a new password"
      description="Enter the verification code sent to your email and choose a new password."
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
      <ResetPasswordForm initialEmail={email} />
    </AuthShell>
  );
}