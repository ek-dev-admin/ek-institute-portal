"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/api/errors";

import {
  signupSchema,
  type SignupInput,
} from "../schemas/signup.schema";
import { signup } from "../services/auth.api";

export function SignupForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      address: "",
      birthdate: "",
      acceptTerms: false,
    },
  });

  const onSubmit = form.handleSubmit(async values => {
    setServerError(null);

    try {
      const response = await signup({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        address: values.address,
        birthdate: values.birthdate,
      });

      if (response.requiresConfirmation) {
        router.push(
          `/confirm-signup?email=${encodeURIComponent(values.email)}`,
        );
        return;
      }

      router.push("/login?registered=true");
    } catch (error) {
      setServerError(getErrorMessage(error, "Unable to create your account"));
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          id="firstName"
          label="First name"
          error={form.formState.errors.firstName?.message}
        >
          <Input
            id="firstName"
            autoComplete="given-name"
            {...form.register("firstName")}
          />
        </FormField>

        <FormField
          id="lastName"
          label="Last name"
          error={form.formState.errors.lastName?.message}
        >
          <Input
            id="lastName"
            autoComplete="family-name"
            {...form.register("lastName")}
          />
        </FormField>
      </div>

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
        label="Password"
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
        label="Confirm password"
        error={form.formState.errors.confirmPassword?.message}
      >
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          {...form.register("confirmPassword")}
        />
      </FormField>

      <FormField
        id="address"
        label="Address"
        error={form.formState.errors.address?.message}
      >
        <Input
          id="address"
          autoComplete="street-address"
          {...form.register("address")}
        />
      </FormField>

      <FormField
        id="birthDate"
        label="Date of birth"
        error={form.formState.errors.birthdate?.message}
      >
        <Input
          id="birthDate"
          type="date"
          autoComplete="bday"
          {...form.register("birthdate")}
        />
      </FormField>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-white/65">
          <input
            type="checkbox"
            {...form.register("acceptTerms")}
            className="mt-1 size-4 accent-[#c99b4d]"
          />

          <span>
            I accept the terms and conditions and consent to the processing of
            my registration information.
          </span>
        </label>

        {form.formState.errors.acceptTerms && (
          <p className="mt-2 text-sm text-red-400">
            {form.formState.errors.acceptTerms.message}
          </p>
        )}
      </div>

      {serverError && <Alert>{serverError}</Alert>}

      <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
        {form.formState.isSubmitting ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
