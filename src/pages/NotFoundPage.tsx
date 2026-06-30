import { Link } from "react-router-dom";
import { PublicLayout } from "../layouts/PublicLayout";

export function NotFoundPage() {
  return (
    <PublicLayout>
      <div className="min-h-[50vh] w-full rounded-3xl border border-[var(--color-sanaclub-border)] bg-white/90 p-8 text-center shadow-[0_12px_35px_rgba(36,51,43,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-sanaclub-green)]">
          Sanaclub
        </p>
        <h1 className="mt-2 text-3xl font-bold">Página no encontrada</h1>
        <p className="mt-3 text-sm text-[var(--color-sanaclub-muted)]">
          La ruta que buscas no existe en esta base inicial.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full border border-[var(--color-sanaclub-green)] px-4 py-2 text-sm font-semibold text-[var(--color-sanaclub-green)] transition hover:bg-[var(--color-sanaclub-green)] hover:text-white"
        >
          Volver al inicio
        </Link>
      </div>
    </PublicLayout>
  );
}
