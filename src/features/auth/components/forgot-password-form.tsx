"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/api/errors";

import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "../schemas/forgot-password.schema";
import { forgotPassword } from "../services/auth.api";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = form.handleSubmit(async values => {
    setServerError(null);

    try {
      await forgotPassword(values);

      router.push(
        `/reset-password?email=${encodeURIComponent(values.email)}`,
      );
    } catch (error) {
      setServerError(
        getErrorMessage(
          error,
          "Unable to send password reset instructions",
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
          autoFocus
          {...form.register("email")}
        />
      </FormField>

      {serverError && <Alert>{serverError}</Alert>}

      <Button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="w-full"
      >
        {form.formState.isSubmitting
          ? "Sending..."
          : "Send reset instructions"}
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