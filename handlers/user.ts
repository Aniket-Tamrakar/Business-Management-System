import type { CreateUserFormValues } from "@/schema/user";
import { apiRequest } from "@/lib/api/client";
import { USER_ROUTES } from "@/lib/api/routes";

export type User = {
  id: string;
  fullName: string;
  email: string;
  roleId: string;
  /** API may return role as string or as object { name: string } */
  role?: string | { name: string };
  outletId?: string;
  status: boolean;
  [key: string]: unknown;
};

export type GetUsersResponse = {
  data?: User[];
  users?: User[];
  [key: string]: unknown;
};

export async function getUsers(): Promise<
  | { ok: true; data: User[] }
  | { ok: false; error: string; status: number }
> {
  const result = await apiRequest<GetUsersResponse>(USER_ROUTES.GET, {
    method: "GET",
  });
  if (!result.ok) return result;
  const list = result.data?.data ?? result.data?.users ?? [];
  const data: User[] = Array.isArray(list) ? list : [];
  return { ok: true, data };
}

/** Default outlet ID used when creating a user (no outlet field in form yet). */
export const DEFAULT_OUTLET_ID = "694519f2-433a-45c4-a6a8-c28dd02afe45";

export type CreateUserPayload = {
  fullName: string;
  roleId: string;
  outletId: string;
  status: boolean;
  email: string;
};

export type CreateUserResponse = {
  success?: boolean;
  message?: string;
  [key: string]: unknown;
};

export async function createUser(payload: CreateUserFormValues) {
  const body: CreateUserPayload = {
    fullName: payload.fullName.trim(),
    roleId: payload.roleId,
    outletId: DEFAULT_OUTLET_ID,
    status: payload.status === "Active",
    email: payload.email.trim().toLowerCase(),
  };
  return apiRequest<CreateUserResponse>(USER_ROUTES.CREATE, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
