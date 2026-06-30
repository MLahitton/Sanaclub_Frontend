import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { APP_BRAND, APP_NAME } from "../../../shared/constants/app.constants";
import { LoginForm } from "../components/LoginForm";
import { type LoginFormValues } from "../schemas/auth.schemas";
import { useAuth } from "../hooks/useAuth";
import { AuthLayout } from "../../../layouts/AuthLayout";

export function LoginPage() {
  const { loginUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      const currentUser = await loginUser(values);
      if (currentUser.mustChangePassword) {
        navigate("/change-password", { replace: true });
        return;
      }
      navigate("/app", { replace: true });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No fue posible iniciar sesion.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-[var(--color-sanaclub-border)] bg-white/95 p-8 shadow-[0_16px_48px_rgba(36,51,43,0.08)]">
        <header className="space-y-2">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--color-sanaclub-border)] bg-[var(--color-sanaclub-bg)]">
            <img
              src={APP_BRAND.logoPath}
              alt={`${APP_NAME} logo`}
              className="h-11 w-11 rounded-xl object-contain"
            />
          </div>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-sanaclub-green)]">
            Acceso interno
          </p>
          <h1 className="text-center text-2xl font-bold">Sanaclub</h1>
          <p className="text-center text-sm text-[var(--color-sanaclub-muted)]">
            Ingresar con credenciales institucionales
          </p>
        </header>

        <LoginForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />

        <p className="text-center text-[11px] text-[var(--color-sanaclub-muted)]">
          Si olvidas tu acceso, solicita soporte interno.
        </p>

        <Link
          to="/foundation"
          className="block text-center text-xs text-[var(--color-sanaclub-green)] hover:underline"
        >
          Ver pantalla foundation
        </Link>
      </div>
    </AuthLayout>
  );
}
