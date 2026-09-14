"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/api/errors";

import {
  confirmSignupSchema,
  type ConfirmSignupInput,
} from "../schemas/signup.schema";

import {
  confirmSignup,
  resendSignupCode,
} from "../services/auth.api";

type ConfirmSignupFormProps = {
  initialEmail: string;
};

const RESEND_COOLDOWN = 60;

export function ConfirmSignupForm({
  initialEmail,
}: ConfirmSignupFormProps) {
  const router = useRouter();

  const [serverError, setServerError] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const form = useForm<ConfirmSignupInput>({
    resolver: zodResolver(confirmSignupSchema),
    defaultValues: {
      email: initialEmail,
      code: "",
    },
  });

  useEffect(() => {
    if (resendCooldown <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setResendCooldown(current => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  const onSubmit = form.handleSubmit(async values => {
    setServerError(null);
    setResendMessage(null);

    try {
      await confirmSignup(values);
      router.replace("/login?confirmed=true");
    } catch (error) {
      setServerError(
        getErrorMessage(error, "Unable to confirm your account"),
      );
    }
  });

  const handleResendCode = async () => {
    const email = form.getValues("email");

    // Validate the email field before sending.
    const isEmailValid = await form.trigger("email");

    if (!isEmailValid) {
      return;
    }

    setServerError(null);
    setResendMessage(null);
    setIsResending(true);

    try {
      await resendSignupCode({ email });

      setResendMessage("A new confirmation code has been sent.");
      setResendCooldown(RESEND_COOLDOWN);

      // Optional: clear the old code
      form.setValue("code", "");
      form.setFocus("code");
    } catch (error) {
      setServerError(
        getErrorMessage(
          error,
          "Unable to resend the confirmation code",
        ),
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="text-sm font-medium text-white/75"
        >
          Email address
        </label>

        <Input
          id="email"
          type="email"
          autoComplete="email"
          {...form.register("email")}
        />

        {form.formState.errors.email && (
          <p className="mt-2 text-sm text-red-400">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="code"
          className="text-sm font-medium text-white/75"
        >
          Confirmation code
        </label>

        <Input
          id="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          className="text-center text-xl tracking-[0.35em]"
          {...form.register("code")}
        />

        {form.formState.errors.code && (
          <p className="mt-2 text-sm text-red-400">
            {form.formState.errors.code.message}
          </p>
        )}

        <div className="mt-2 text-center text-sm text-white/60">
          Didn&apos;t receive the code?{" "}
          <button
            type="button"
            onClick={handleResendCode}
            disabled={isResending || resendCooldown > 0}
            className="font-medium text-white hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isResending
              ? "Sending..."
              : resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : "Resend code"}
          </button>
        </div>
      </div>

      {serverError && <Alert>{serverError}</Alert>}

      {resendMessage && (
        <p className="text-sm text-green-400">
          {resendMessage}
        </p>
      )}

      <Button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="w-full"
      >
        {form.formState.isSubmitting
          ? "Confirming..."
          : "Confirm account"}
      </Button>
    </form>
  );
}
