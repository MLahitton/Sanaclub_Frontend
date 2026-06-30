import { Toaster } from "sonner";
import { useEffect } from "react";
import { AppRouter } from "../router/AppRouter";
import { setAuthSessionExpiredHandler } from "../shared/api/apiClient";
import { useAuthStore } from "../features/auth/stores/auth.store";
import { QueryProvider } from "./QueryProvider";

function AuthBootstrapGate() {
  const status = useAuthStore((state) => state.status);
  const bootstrapSession = useAuthStore((state) => state.bootstrapSession);
  const clearSession = useAuthStore((state) => state.clearSession);

  useEffect(() => {
    setAuthSessionExpiredHandler(clearSession);

    if (status === "idle") {
      void bootstrapSession();
    }

    return () => {
      setAuthSessionExpiredHandler(null);
    };
  }, [bootstrapSession, clearSession, status]);

  if (status === "checking" || status === "idle") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-sanaclub-bg)]">
        <div className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white px-6 py-3 text-center text-sm text-[var(--color-sanaclub-text)] shadow-[0_12px_35px_rgba(36,51,43,0.08)]">
          Inicializando sesiÃ³n...
        </div>
      </div>
    );
  }

  return <AppRouter />;
}

export function AppProviders() {
  return (
    <QueryProvider>
      <AuthBootstrapGate />
      <Toaster richColors />
    </QueryProvider>
  );
}
