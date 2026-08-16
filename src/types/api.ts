export type AuthUser = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken?: string;
  user: AuthUser;
};

export type SignupResponse = {
  message: string;
  requiresConfirmation: boolean;
  userId?: string;
};

export type ConfirmSignupResponse = {
  message: string;
};

export type ApiErrorResponse = {
  message: string;
  code?: string;
  details?: unknown;
};
