import { apiRequest } from "@/lib/api/client";
import { AUTH_ROUTES } from "@/lib/api/routes";

const DEFAULT_ROLE_ID = "4e01f811-3fb2-4a1c-a237-4ee46ef982d5";

export type RegisterPayload = {
  email: string;
  userName: string;
  fullName: string;
  password: string;
  confirmPassword: string;
  roleId: string;
  status: boolean;
};

export type RegisterResponse = {
  success?: boolean;
  message?: string;
  [key: string]: unknown;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  success?: boolean;
  message?: string;
  token?: string;
  [key: string]: unknown;
};

export async function register(payload: Omit<RegisterPayload, "roleId" | "status">) {
  const body: RegisterPayload = {
    ...payload,
    roleId: DEFAULT_ROLE_ID,
    status: true,
  };
  return apiRequest<RegisterResponse>(AUTH_ROUTES.REGISTER, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function login(payload: LoginPayload) {
  return apiRequest<LoginResponse>(AUTH_ROUTES.LOGIN, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
