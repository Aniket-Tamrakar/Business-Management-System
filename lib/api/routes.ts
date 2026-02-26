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
  UPDATE: "/outlets/update",
  DELETE: "/outlets/delete",
} as const;

export const DEPARTMENT_ROUTES = {
  GET: "/departments/get",
  CREATE: "/departments/create",
  UPDATE: "/departments/update",
  DELETE: "/departments/delete",
} as const;

export const PRODUCT_TYPE_ROUTES = {
  GET: "/product-types/get",
  CREATE: "/product-types/create",
  UPDATE: "/product-types/update",
  DELETE: "/product-types/delete",
} as const;

export const PRODUCT_ROUTES = {
  GET: "/products/get",
  CREATE: "/products/create",
  UPDATE: "/products/update",
  DELETE: "/products/delete",
} as const;

export const ROLE_ROUTES = {
  GET: "/roles/get",
  CREATE: "/roles/create",
  UPDATE: "/roles/update",
  DELETE: "/roles/delete",
} as const;
