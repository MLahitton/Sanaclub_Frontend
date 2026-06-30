import { PageHeader } from "../shared/components/PageHeader";

type ModulePlaceholderPageProps = {
  title: string;
  description: string;
  moduleName: string;
  requiredPermissions?: string[];
};

export function ModulePlaceholderPage({
  title,
  description,
  moduleName,
  requiredPermissions,
}: ModulePlaceholderPageProps) {
  return (
    <section className="space-y-4">
      <PageHeader
        title={title}
        description={description}
        breadcrumbs={[
          { label: "Panel interno", path: "/app" },
          { label: moduleName },
        ]}
      />

      <article className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-6 shadow-[0_14px_35px_rgba(36,51,43,0.08)]">
        <p className="text-sm text-[var(--color-sanaclub-text)]">
          Estado: Próxima fase.
        </p>
        <p className="mt-2 text-sm text-[var(--color-sanaclub-muted)]">
          Este módulo se presentará en la siguiente fase. Por ahora se mantiene como
          placeholder para validar navegación y permisos.
        </p>

        {requiredPermissions && requiredPermissions.length > 0 ? (
          <p className="mt-4 text-sm text-[var(--color-sanaclub-muted)]">
            Permisos requeridos: {requiredPermissions.join(", ")}
          </p>
        ) : null}
      </article>
    </section>
  );
}
