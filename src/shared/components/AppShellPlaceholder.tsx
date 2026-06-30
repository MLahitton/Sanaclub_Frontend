import { CalendarDays, Files, FileText, HeartPulse, House, ShieldCheck, UserPlus } from "lucide-react";
import { APP_BRAND } from "../constants/app.constants";
import { cn } from "../utils/cn";

const upcomingModules = [
  { label: "Autenticación interna", icon: ShieldCheck },
  { label: "Layout interno", icon: House },
  { label: "Pacientes", icon: UserPlus },
  { label: "Solicitudes médicas", icon: FileText },
  { label: "Agenda", icon: CalendarDays },
  { label: "Documentos", icon: Files },
  { label: "Usuarios internos", icon: HeartPulse },
];

export function AppShellPlaceholder() {
  return (
    <section className="mx-auto w-full max-w-5xl space-y-6">
      <header className="grid gap-6 rounded-3xl border border-[var(--color-sanaclub-border)] bg-white/95 p-6 shadow-[0_18px_45px_rgba(36,51,43,0.08)] backdrop-blur md:grid-cols-[1.2fr_.8fr] md:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--color-sanaclub-green)]">
            Fundación de frontend
          </p>
          <h1 className="mt-2 text-3xl font-bold">Sanaclub</h1>
          <p className="mt-3 max-w-xl text-sm text-[var(--color-sanaclub-muted)]">
            La base inicial prepara una aplicación clínica interna con React, Vite y
            TypeScript, pensada para escalar por módulos sin arrastrar deuda.
          </p>
        </div>

        <aside className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-[var(--color-sanaclub-bg)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-sanaclub-muted)]">
            Estado de fundación
          </p>
          <h2 className="mt-2 text-xl font-semibold text-[var(--color-sanaclub-text)]">
            Frontend foundation activa
          </h2>
          <p className="mt-2 text-sm text-[var(--color-sanaclub-muted)]">
            Marca, rutas base, proveedores, API client y utilidades base listos.
          </p>
        </aside>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {upcomingModules.map((module) => {
          const ModuleIcon = module.icon;
          return (
            <article
              key={module.label}
              className={cn(
                "flex items-center gap-3 rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-4",
              )}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-sanaclub-coral)]/15 text-[var(--color-sanaclub-coral)]">
                <ModuleIcon className="h-5 w-5" />
              </span>
              <p className="text-sm font-medium text-[var(--color-sanaclub-text)]">
                {module.label}
              </p>
            </article>
          );
        })}
      </div>

      <p className="text-xs text-[var(--color-sanaclub-muted)]">
        Próximas fases previstas para los módulos: Auth, Layout interno, Pacientes,
        Solicitudes médicas, Agenda, Documentos y Usuarios internos.
      </p>
      <span className="hidden">
        fallback:{APP_BRAND.fallbackInitials}
      </span>
    </section>
  );
}
