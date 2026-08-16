import type { Metadata } from "next";
import Link from "next/link";

import { AuthShell } from "@/components/layout/auth-shell";
import { ConfirmSignupForm } from "@/features/auth/components/confirm-signup-form";

export const metadata: Metadata = {
  title: "Confirm Account | Executive Cooperation",
};

type ConfirmSignupPageProps = {
  searchParams: Promise<{
    email?: string;
  }>;
};

export default async function ConfirmSignupPage({
  searchParams,
}: ConfirmSignupPageProps) {
  const { email = "" } = await searchParams;

  return (
    <AuthShell
      title="Confirm your account"
      description="Enter the confirmation code sent to your email address."
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
      <ConfirmSignupForm initialEmail={email} />
    </AuthShell>
  );
}
