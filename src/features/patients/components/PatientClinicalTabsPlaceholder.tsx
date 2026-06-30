import { usePermissions } from "../../auth/hooks/usePermissions";

type ClinicalTab = {
  label: string;
  requiredPermission?: string;
};

export function PatientClinicalTabsPlaceholder() {
  const { can } = usePermissions();

  const clinicalTabs: ClinicalTab[] = [
    { label: "Resumen" },
    { label: "Tratamientos", requiredPermission: "treatments.read" },
    { label: "Evoluciones", requiredPermission: "evolutions.read" },
    { label: "Consentimientos", requiredPermission: "consents.read" },
    { label: "Documentos", requiredPermission: "documents.read" },
    { label: "Citas", requiredPermission: "appointments.read" },
  ];

  const visibleClinicalTabs = clinicalTabs.filter(
    (tab) => !tab.requiredPermission || can(tab.requiredPermission),
  );

  return (
    <section className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-4 md:p-5">
      <h2 className="text-base font-semibold text-[var(--color-sanaclub-text)]">
        Módulos de información del paciente
      </h2>
      <p className="mt-1 text-sm text-[var(--color-sanaclub-muted)]">
        La información clínica del paciente se implementará en las siguientes fases.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {visibleClinicalTabs.map((tab) => (
          <span
            key={tab.label}
            className="rounded-full border border-[var(--color-sanaclub-border)] bg-[var(--color-sanaclub-bg)] px-3 py-1.5 text-xs font-medium text-[var(--color-sanaclub-text)]"
          >
            {tab.label}
          </span>
        ))}
      </div>
    </section>
  );
}
