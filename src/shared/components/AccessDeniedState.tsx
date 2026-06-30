import { Link } from "react-router-dom";

type AccessDeniedStateProps = {
  message?: string;
  requiredPermissions?: string[];
};

export function AccessDeniedState({
  message = "No tienes permisos para acceder a esta sección.",
  requiredPermissions,
}: AccessDeniedStateProps) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center px-4 py-8">
      <div className="w-full rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-8 text-center shadow-[0_12px_35px_rgba(36,51,43,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-sanaclub-coral-dark)]">
          Acceso restringido
        </p>
        <h2 className="mt-3 text-2xl font-bold">No tienes permisos</h2>
        <p className="mt-3 text-sm text-[var(--color-sanaclub-muted)]">{message}</p>
        {requiredPermissions && requiredPermissions.length > 0 ? (
          <p className="mt-2 text-xs text-[var(--color-sanaclub-muted)]">
            Permisos requeridos: {requiredPermissions.join(", ")}
          </p>
        ) : null}

        <Link
          to="/app"
          className="mt-6 inline-flex rounded-full bg-[var(--color-sanaclub-green)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-sanaclub-green-dark)]"
        >
          Volver al panel
        </Link>
      </div>
    </div>
  );
}
