import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { usePermissions } from "../../features/auth/hooks/usePermissions";
import { AccessDeniedState } from "../../shared/components/AccessDeniedState";

type PermissionGuardProps = {
  permissions?: string[];
  requiredPermissions?: string[];
  mode?: "all" | "any";
  all?: boolean;
  fallbackPath?: string;
  children: ReactNode;
};

export function PermissionGuard({
  permissions,
  requiredPermissions,
  mode,
  all = false,
  fallbackPath,
  children,
}: PermissionGuardProps) {
  const { canAny, canAll } = usePermissions();
  const required = permissions ?? requiredPermissions ?? [];
  const hasRequirements = required.length > 0;
  const checkAll = mode === "all" || all === true;

  const allowed = hasRequirements
    ? checkAll
      ? canAll(required)
      : canAny(required)
    : true;

  if (!allowed) {
    if (fallbackPath) {
      return <Navigate to={fallbackPath} replace />;
    }

    return <AccessDeniedState requiredPermissions={required} />;
  }

  return <>{children}</>;
}
