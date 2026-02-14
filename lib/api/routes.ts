/**
 * API route constants. Use these vars instead of hardcoding paths.
 */

export const AUTH_ROUTES = {
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
} as const;

export const OUTLET_ROUTES = {
  GET: "/outlets/get",
  CREATE: "/outlets/create",
  DELETE: "/outlets/delete",
} as const;
