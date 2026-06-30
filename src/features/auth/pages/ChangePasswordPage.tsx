import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { ChangePasswordForm } from "../components/ChangePasswordForm";
import { type ChangePasswordFormValues } from "../schemas/auth.schemas";
import { ProtectedPlaceholderLayout } from "../../../layouts/ProtectedPlaceholderLayout";

export function ChangePasswordPage() {
  const { changePasswordWithRefresh, user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: ChangePasswordFormValues) => {
    setIsSubmitting(true);
    try {
      const currentUser = await changePasswordWithRefresh(values);
      toast.success("ContraseÃ±a actualizada.");
      if (!currentUser.mustChangePassword) {
        navigate("/app", { replace: true });
      }
    } catch {
      toast.error("No fue posible cambiar la contraseÃ±a.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedPlaceholderLayout>
      <div className="mx-auto w-full max-w-xl space-y-4 rounded-3xl border border-[var(--color-sanaclub-border)] bg-white/95 p-8 shadow-[0_16px_48px_rgba(36,51,43,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-sanaclub-green)]">
          Primer acceso requerido
        </p>
        <h1 className="text-2xl font-bold">Cambiar contraseÃ±a</h1>
        <p className="text-sm text-[var(--color-sanaclub-muted)]">
          Usuario: {user?.fullName ?? user?.email ?? "interno autenticado"}
        </p>

        <ChangePasswordForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />

        <p className="text-xs text-[var(--color-sanaclub-muted)]">
          Debe definir una nueva contraseÃ±a que no hayas usado recientemente.
        </p>
      </div>
    </ProtectedPlaceholderLayout>
  );
}
