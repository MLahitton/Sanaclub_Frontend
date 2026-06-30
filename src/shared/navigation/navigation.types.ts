import type { ComponentType } from "react";

export type NavigationItem = {
  label: string;
  path: string;
  icon: ComponentType<{ className?: string }>;
  requiredPermissions?: string[];
  requireAnyPermission?: boolean;
  description?: string;
};

export type NavigationSection =
  | "dashboard"
  | "patients"
  | "appointments"
  | "medical-requests"
  | "clinical-documentation"
  | "documents"
  | "users";

export type AppNavigationMap = Record<NavigationSection, NavigationItem>;

