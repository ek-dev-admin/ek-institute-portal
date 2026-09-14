import { apiRequest } from "@/lib/api/client";
import type {
  AuthUser,
  ConfirmSignupResponse,
  LoginResponse,
  SignupResponse,
} from "@/types/api";

import type { ConfirmSignupInput } from "../schemas/signup.schema";
import type { LoginInput } from "../schemas/login.schema";
import type { SignupRequest } from "../schemas/signup.schema";
import type { ForgotPasswordInput } from "../schemas/forgot-password.schema";

export async function login(input: LoginInput) {
  return apiRequest<{ user: LoginResponse["user"] }>("/api/auth/login", {
    method: "POST",
    body: input,
  });
}

export async function signup(input: SignupRequest) {
  return apiRequest<SignupResponse>("/api/auth/signup", {
    method: "POST",
    body: input,
  });
}

export async function confirmSignup(input: ConfirmSignupInput) {
  return apiRequest<ConfirmSignupResponse>("/api/auth/confirm-signup", {
    method: "POST",
    body: input,
  });
}

export async function resendSignupCode(input: { email: string }) {
  return apiRequest<ConfirmSignupResponse>("/api/auth/resend-code", {
    method: "POST",
    body: input,
  });
}

export async function forgotPassword(input: ForgotPasswordInput) {
  return apiRequest<void>("/api/auth/forgot-password", {
    method: "POST",
    body: input,
  });
}

export async function resetPassword(input: {
  email: string;
  code: string;
  newPassword: string;
}) {
  return apiRequest<{
    message: string;
    email: string;
  }>("/api/auth/confirm-forgot-password", {
    method: "POST",
    body: input,
  });
}

export async function logout() {
  return apiRequest<void>("/api/auth/logout", {
    method: "POST",
  });
}

export async function getMe() {
  return apiRequest<AuthUser>("/api/auth/me");
}
