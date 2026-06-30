import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/stores/auth.store";

export function IndexRedirect() {
  const status = useAuthStore((state) => state.status);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const mustChangePassword = useAuthStore((state) => state.user?.mustChangePassword);

  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-sanaclub-bg)]">
        <div className="rounded-xl border border-[var(--color-sanaclub-border)] bg-white px-5 py-3 text-sm">
          Verificando sesiÃ³n...
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    if (mustChangePassword) {
      return <Navigate to="/change-password" replace />;
    }

    return <Navigate to="/app" replace />;
  }

  return <Navigate to="/login" replace />;
}
