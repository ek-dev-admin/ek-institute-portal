export type AuthUser = {
  id: string;
  cognitoSub?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
  role?: string;
  status?: string;
  companyName?: string;
  memberType?: string;
  createdAt?: string;
};

export type DocumentType =
  | "id_passport"
  | "proof_of_address"
  | "business_registration"
  | "other";

export type UserDocument = {
  id: string;
  documentType: DocumentType;
  confirmed: boolean;
  contentType?: string;
  sizeBytes?: number;
  createdAt: string;
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
