import { useMemo } from "react";
import { useAuthStore } from "../stores/auth.store";
import { hasAnyPermission, hasAllPermissions, hasPermission, hasRole } from "../utils/permissions";

export function usePermissions() {
  const user = useAuthStore((state) => state.user);

  return useMemo(
    () => ({
      can: (permission: string) => hasPermission(user, permission),
      canAny: (permissions: string[]) => hasAnyPermission(user, permissions),
      canAll: (permissions: string[]) => hasAllPermissions(user, permissions),
      hasRole: (role: string) => hasRole(user, role),
    }),
    [user],
  );
}
