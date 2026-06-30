import { useMemo } from "react";
import { Link } from "react-router-dom";
import { APP_INTERNAL_NAVIGATION } from "../shared/navigation/navigation.config";
import { useAuth } from "../features/auth/hooks/useAuth";
import { usePermissions } from "../features/auth/hooks/usePermissions";
import { PageHeader } from "../shared/components/PageHeader";

function hasAccessToNavigationItem(
  permissions: string[] | undefined,
  requireAny: boolean | undefined,
  canAny: (required: string[]) => boolean,
  canAll: (required: string[]) => boolean,
) {
  if (!permissions || permissions.length === 0) {
    return true;
  }

  return requireAny ? canAny(permissions) : canAll(permissions);
}

export function DashboardPlaceholderPage() {
  const { canAny, canAll } = usePermissions();
  const { user } = useAuth();

  const modules = useMemo(
    () =>
      APP_INTERNAL_NAVIGATION.filter(
        (item) =>
          item.path !== "/app" &&
          hasAccessToNavigationItem(
            item.requiredPermissions,
            item.requireAnyPermission,
            canAny,
            canAll,
          ),
      ),
    [canAny, canAll],
  );

  return (
    <section className="space-y-6">
      <PageHeader
        title={`Bienvenido, ${user?.fullName ?? "usuario interno"}`}
        description="Panel interno en construcción. Los módulos se activarán según permisos en fases posteriores."
      />

      <article className="rounded-3xl border border-[var(--color-sanaclub-border)] bg-white p-6 shadow-[0_14px_35px_rgba(36,51,43,0.08)]">
        <p className="text-sm text-[var(--color-sanaclub-text)]">
          Rol principal: {(user?.roles ?? []).join(", ") || "Sin rol asignado"}.
        </p>
        <p className="mt-3 text-sm text-[var(--color-sanaclub-muted)]">
          Esta sección es un contenedor inicial. Las funcionalidades clínicas y de
          gestión entrarán en fases posteriores.
        </p>
      </article>

      <div>
        <h2 className="text-lg font-semibold">Próximos accesos</h2>
        <p className="mt-1 text-sm text-[var(--color-sanaclub-muted)]">
          Módulos disponibles para tu perfil actual:
        </p>
      </div>

      {modules.length === 0 ? (
        <article className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white/90 p-6">
          <p className="text-sm text-[var(--color-sanaclub-muted)]">
            Aún no hay módulos habilitados para este perfil. La administración interna
            asignará permisos en una siguiente etapa.
          </p>
        </article>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Link
                key={module.path}
                to={module.path}
                className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-4 transition hover:border-[var(--color-sanaclub-green)]/60 hover:shadow-[0_12px_35px_rgba(36,51,43,0.12)]"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-sanaclub-coral)]/15 text-[var(--color-sanaclub-coral)]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 font-semibold">{module.label}</h3>
                <p className="mt-2 text-sm text-[var(--color-sanaclub-muted)]">
                  {module.description}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
