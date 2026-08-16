import type { Metadata } from "next";
import Link from "next/link";

import { AuthShell } from "@/components/layout/auth-shell";
import { SignupForm } from "@/features/auth/components/signup-form";

export const metadata: Metadata = {
  title: "Request Access | Executive Cooperation",
  description: "Create your Executive Cooperation account.",
};

export default function SignupPage() {
  return (
    <AuthShell
      title="Request access"
      description="Create your account and submit your information for verification."
      footer={
        <p className="text-center text-sm text-white/55">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#d9ad62] transition hover:text-[#f2ca80]"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <SignupForm />
    </AuthShell>
  );
}
