"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/api/errors";

import { loginSchema, type LoginInput } from "../schemas/login.schema";
import { login } from "../services/auth.api";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);

  const registered = searchParams.get("registered") === "true";
  const confirmed = searchParams.get("confirmed") === "true";

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async values => {
    setServerError(null);

    try {
      await login(values);
      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      setServerError(getErrorMessage(error, "Unable to sign in"));
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {registered && (
        <Alert variant="success">
          Your account was created. Sign in to continue.
        </Alert>
      )}

      {confirmed && (
        <Alert variant="success">
          Your account is confirmed. You can sign in now.
        </Alert>
      )}

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
        id="password"
        label={
            <div className="flex items-center justify-between">
            <span>Password</span>

            <Link
                href="/forgot-password"
                className="text-sm font-normal text-[#d9ad62] transition hover:text-[#f2ca80]"
            >
                Forgot password?
            </Link>
            </div>
        }
        error={form.formState.errors.password?.message}
        >
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          {...form.register("password")}
        />
      </FormField>

      {serverError && <Alert>{serverError}</Alert>}

      <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
        {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
      </Button>

      <p className="text-center text-sm text-white/55">
        Need an account?{" "}
        <Link
          href="/signup"
          className="text-[#d9ad62] transition hover:text-[#f2ca80]"
        >
          Request access
        </Link>
      </p>
    </form>
  );
}
