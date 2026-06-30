import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/stores/auth.store";

type GuestGuardProps = {
  children: ReactNode;
};

export function GuestGuard({ children }: GuestGuardProps) {
  const status = useAuthStore((state) => state.status);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-sanaclub-bg)]">
        <div className="rounded-xl border border-[var(--color-sanaclub-border)] bg-white px-5 py-3 text-sm">
          Cargando estado de acceso...
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    if (user?.mustChangePassword) {
      return <Navigate to="/change-password" replace />;
    }
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
}
