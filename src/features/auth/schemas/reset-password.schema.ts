import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    email: z.string().email("Enter a valid email address"),

    code: z
      .string()
      .min(1, "Verification code is required"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<
  typeof resetPasswordSchema
>;