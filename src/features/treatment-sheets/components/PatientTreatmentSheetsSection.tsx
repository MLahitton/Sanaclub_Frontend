import { useNavigate } from "react-router-dom";
import { usePermissions } from "../../auth/hooks/usePermissions";
import { usePatientTreatmentSheets } from "../hooks/usePatientTreatmentSheets";
import { TreatmentSheetsList } from "./TreatmentSheetsList";

type PatientTreatmentSheetsSectionProps = {
  patientId: string;
};

export function PatientTreatmentSheetsSection({
  patientId,
}: PatientTreatmentSheetsSectionProps) {
  const navigate = useNavigate();
  const { can } = usePermissions();
  const canRead = can("treatments.read");
  const canCreate = can("treatments.create");
  const canCompleteMedicalIndication = can("treatments.update_medical_indication");
  const canGeneratePdf = can("documents.generate");

  const treatmentSheetsQuery = usePatientTreatmentSheets(patientId, canRead);

  const normalizedPatientId = patientId?.trim();

  const handleRetry = () => {
    void treatmentSheetsQuery.refetch();
  };

  const handleCreateTreatmentSheet = () => {
    if (!normalizedPatientId) {
      return;
    }

    navigate(`/app/patients/${normalizedPatientId}/treatment-sheets/new`);
  };

  if (!normalizedPatientId) {
    return null;
  }

  if (!canRead) {
    return (
      <section className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-4 md:p-5">
        <h2 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">
          Hojas de tratamiento
        </h2>
        <p className="mt-2 text-sm text-[var(--color-sanaclub-muted)]">
          No tienes permisos para ver las hojas de tratamiento de este paciente.
        </p>
      </section>
    );
  }

  if (treatmentSheetsQuery.isLoading && !treatmentSheetsQuery.data) {
    return (
      <section className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-4 md:p-5">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--color-sanaclub-coral)] border-t-[var(--color-sanaclub-green)]" />
          <p className="text-sm font-medium text-[var(--color-sanaclub-text)]">
            Cargando hojas de tratamiento...
          </p>
        </div>
      </section>
    );
  }

  if (treatmentSheetsQuery.isError) {
    return (
      <section className="rounded-2xl border border-[var(--color-sanaclub-coral)]/30 bg-white p-5">
        <h2 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">
          No fue posible cargar las hojas de tratamiento
        </h2>
        <p className="mt-2 text-sm text-[var(--color-sanaclub-muted)]">
          Ocurrió un problema al consultar las hojas de tratamiento.
        </p>
        <button
          type="button"
          onClick={handleRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--color-sanaclub-coral)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-sanaclub-coral-dark)]"
        >
          Reintentar
        </button>
      </section>
    );
  }

  const treatmentSheets = treatmentSheetsQuery.data ?? [];

  return (
    <section className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-4 md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">
            Hojas de tratamiento
          </h2>
          <p className="mt-1 text-sm text-[var(--color-sanaclub-muted)]">
            Historial clínico asociado al paciente.
          </p>
        </div>

        {canCreate ? (
          <button
            type="button"
            onClick={handleCreateTreatmentSheet}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-sanaclub-green)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-sanaclub-green-dark)]"
          >
            Nueva hoja de tratamiento
          </button>
        ) : null}
      </div>

      {treatmentSheets.length === 0 ? (
        <article className="mt-4 rounded-xl border border-dashed border-[var(--color-sanaclub-border)] bg-[var(--color-sanaclub-bg)] p-6 text-center">
          <p className="text-sm text-[var(--color-sanaclub-text)]">
            Este paciente aún no tiene hojas de tratamiento registradas.
          </p>
          {canCreate ? (
            <p className="mt-2 text-xs text-[var(--color-sanaclub-muted)]">
              Puedes crear la primera hoja de tratamiento para empezar el registro clínico.
            </p>
          ) : null}
        </article>
      ) : (
        <TreatmentSheetsList
          treatmentSheets={treatmentSheets}
          canRead={canRead}
          canCompleteMedicalIndication={canCompleteMedicalIndication}
          canGeneratePdf={canGeneratePdf}
        />
      )}
    </section>
  );
}

