"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/api/errors";

import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "../schemas/reset-password.schema";
import { resetPassword } from "../services/auth.api";

type ResetPasswordFormProps = {
  initialEmail: string;
};

export function ResetPasswordForm({
  initialEmail,
}: ResetPasswordFormProps) {
  const router = useRouter();

  const [serverError, setServerError] = useState<string | null>(
    null,
  );

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: initialEmail,
      code: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = form.handleSubmit(async values => {
    setServerError(null);

    try {
        await resetPassword({
            email: values.email,
            code: values.code,
            newPassword: values.password,
        });

        router.replace("/login?passwordReset=true");
    } catch (error) {
      setServerError(
        getErrorMessage(
          error,
          "Unable to reset your password",
        ),
      );
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <FormField
        id="email"
        label="Email address"
        error={form.formState.errors.email?.message}
      >
        <Input
          id="email"
          type="email"
          autoComplete="email"
          {...form.register("email")}
        />
      </FormField>

      <FormField
        id="code"
        label="Reset code"
        error={form.formState.errors.code?.message}
      >
        <Input
          id="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          className="text-center text-xl tracking-[0.35em]"
          {...form.register("code")}
        />
      </FormField>

      <FormField
        id="password"
        label="New password"
        error={form.formState.errors.password?.message}
      >
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          {...form.register("password")}
        />
      </FormField>

      <FormField
        id="confirmPassword"
        label="Confirm new password"
        error={form.formState.errors.confirmPassword?.message}
      >
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          {...form.register("confirmPassword")}
        />
      </FormField>

      {serverError && <Alert>{serverError}</Alert>}

      <Button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="w-full"
      >
        {form.formState.isSubmitting
          ? "Resetting password..."
          : "Reset password"}
      </Button>
      <p className="text-center text-sm text-white/55">
        Remember your password?{" "}
        <Link
            href="/login"
            className="text-[#d9ad62] transition hover:text-[#f2ca80]"
        >
            Sign in
        </Link>
      </p>
    </form>
  );
}