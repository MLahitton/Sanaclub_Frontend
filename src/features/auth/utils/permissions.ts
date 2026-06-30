import type { CurrentUserResponse } from "../types/auth.types";

export function hasPermission(
  user: CurrentUserResponse | null,
  permission: string,
): boolean {
  return Boolean(user?.permissions?.includes(permission));
}

export function hasAnyPermission(
  user: CurrentUserResponse | null,
  permissions: string[],
): boolean {
  return permissions.some((permission) => hasPermission(user, permission));
}

export function hasAllPermissions(
  user: CurrentUserResponse | null,
  permissions: string[],
): boolean {
  return permissions.every((permission) => hasPermission(user, permission));
}

export function hasRole(user: CurrentUserResponse | null, role: string): boolean {
  return Boolean(user?.roles?.includes(role));
}
