import { useState } from "react";
import { Link } from "react-router-dom";
import { APP_BRAND, APP_DESCRIPTION, APP_NAME } from "../shared/constants/app.constants";
import { PublicLayout } from "../layouts/PublicLayout";
import { AppShellPlaceholder } from "../shared/components/AppShellPlaceholder";

export function LandingPlaceholderPage() {
  const [showLogo, setShowLogo] = useState(true);

  return (
    <PublicLayout>
      <div className="w-full space-y-6">
        <header className="rounded-3xl border border-[var(--color-sanaclub-border)] bg-white/90 p-6 shadow-[0_14px_40px_rgba(36,51,43,0.08)]">
          <div className="flex items-center gap-4">
            {showLogo ? (
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--color-sanaclub-border)] bg-white shadow-sm">
                <img
                  src={APP_BRAND.logoPath}
                  alt={`${APP_NAME} logo`}
                  className="h-11 w-11 rounded-xl object-contain"
                  onError={() => setShowLogo(false)}
                />
              </div>
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--color-sanaclub-border)] bg-white text-sm font-bold text-[var(--color-sanaclub-green)]">
                {APP_BRAND.fallbackInitials}
              </div>
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-sanaclub-green)]">
                {APP_NAME}
              </p>
              <h1 className="text-2xl font-bold">{APP_DESCRIPTION}</h1>
            </div>
          </div>

          <p className="mt-4 max-w-2xl text-sm text-[var(--color-sanaclub-muted)]">
            Frontend foundation activa. Esta etapa inicial deja preparada la base
            técnica para los módulos clínicos internos que se construirán en fases
            siguientes.
          </p>

          <Link
            to="/login"
            className="mt-6 inline-flex rounded-full border border-[var(--color-sanaclub-green)] bg-[var(--color-sanaclub-green)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-sanaclub-green-dark)]"
          >
            Inicio estable
          </Link>
        </header>

        <AppShellPlaceholder />
      </div>
    </PublicLayout>
  );
}
