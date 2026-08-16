import { z } from "zod";

export const signupSchema = z
  .object({
    firstName: z.string().trim().min(2, "First name is required"),
    lastName: z.string().trim().min(2, "Last name is required"),
    email: z
      .string()
      .trim()
      .email("Enter a valid email address")
      .transform(value => value.toLowerCase()),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    address: z.string().trim().min(2, "Address is required"),
    birthdate: z
      .string()
      .min(1, "Date of birth is required")
      .refine(value => {
        const birthdate = new Date(value);
        const today = new Date();

        let age = today.getFullYear() - birthdate.getFullYear();

        const hasNotHadBirthdayThisYear =
          today.getMonth() < birthdate.getMonth() ||
          (today.getMonth() === birthdate.getMonth() &&
            today.getDate() < birthdate.getDate());

        if (hasNotHadBirthdayThisYear) {
          age -= 1;
        }

        return age >= 18;
      }, "You must be at least 18 years old"),
    acceptTerms: z.boolean().refine(value => value, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const signupRequestSchema = z.object({
  firstName: z.string().trim().min(2),
  lastName: z.string().trim().min(2),
  email: z
    .string()
    .trim()
    .email()
    .transform(value => value.toLowerCase()),
  password: z.string().min(8),
  address: z.string().trim().min(2).optional(),
  birthdate: z.string().optional(),
});

export const confirmSignupSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .transform(value => value.toLowerCase()),
  code: z
    .string()
    .trim()
    .min(4, "Enter the confirmation code")
    .max(12, "The confirmation code is invalid"),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type SignupRequest = z.infer<typeof signupRequestSchema>;
export type ConfirmSignupInput = z.infer<typeof confirmSignupSchema>;
