import { useNavigate } from "react-router-dom";
import { usePermissions } from "../../auth/hooks/usePermissions";
import { usePatientEvolutionSheets } from "../hooks/usePatientEvolutionSheets";
import { EvolutionSheetsList } from "./EvolutionSheetsList";

type PatientEvolutionSheetsSectionProps = {
  patientId: string;
};

export function PatientEvolutionSheetsSection({
  patientId,
}: PatientEvolutionSheetsSectionProps) {
  const { can } = usePermissions();
  const canRead = can("evolutions.read");
  const canCreate = can("evolutions.create");
  const canUpdateDraft = can("evolutions.update_draft");

  const evolutionSheetsQuery = usePatientEvolutionSheets(patientId, canRead);
  const normalizedPatientId = patientId?.trim();
  const navigate = useNavigate();

  const handleRetry = () => {
    void evolutionSheetsQuery.refetch();
  };

  const handleCreateEvolution = () => {
    if (!normalizedPatientId) {
      return;
    }

    navigate(`/app/patients/${normalizedPatientId}/evolution-sheets/new`);
  };

  if (!normalizedPatientId) {
    return null;
  }

  if (!canRead) {
    return (
      <section className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-4 md:p-5">
        <h2 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">
          Hojas de evolución
        </h2>
        <p className="mt-2 text-sm text-[var(--color-sanaclub-muted)]">
          No tienes permisos para ver las hojas de evolución de este paciente.
        </p>
      </section>
    );
  }

  if (evolutionSheetsQuery.isLoading && !evolutionSheetsQuery.data) {
    return (
      <section className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-4 md:p-5">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--color-sanaclub-coral)] border-t-[var(--color-sanaclub-green)]" />
          <p className="text-sm font-medium text-[var(--color-sanaclub-text)]">
            Cargando hojas de evolución...
          </p>
        </div>
      </section>
    );
  }

  if (evolutionSheetsQuery.isError) {
    return (
      <section className="rounded-2xl border border-[var(--color-sanaclub-coral)]/30 bg-white p-5">
        <h2 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">
          No fue posible cargar las hojas de evolución
        </h2>
        <p className="mt-2 text-sm text-[var(--color-sanaclub-muted)]">
          Ocurrió un problema al consultar las hojas de evolución.
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

  const evolutionSheets = evolutionSheetsQuery.data ?? [];

  return (
    <section className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-4 md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">
            Hojas de evolución
          </h2>
          <p className="mt-1 text-sm text-[var(--color-sanaclub-muted)]">
            Seguimiento clínico asociado al plan del paciente.
          </p>
        </div>

        {canCreate ? (
          <button
            type="button"
            onClick={handleCreateEvolution}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-sanaclub-green)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-sanaclub-green-dark)]"
          >
            Nueva evolución
          </button>
        ) : null}
      </div>

      {evolutionSheets.length === 0 ? (
        <article className="mt-4 rounded-xl border border-dashed border-[var(--color-sanaclub-border)] bg-[var(--color-sanaclub-bg)] p-6 text-center">
          <p className="text-sm text-[var(--color-sanaclub-text)]">
            Este paciente aún no tiene hojas de evolución registradas.
          </p>
          {canCreate ? (
            <p className="mt-2 text-xs text-[var(--color-sanaclub-muted)]">
              Puedes crear la primera hoja de evolución en una próxima fase.
            </p>
          ) : null}
        </article>
      ) : (
        <EvolutionSheetsList
          evolutionSheets={evolutionSheets}
          canRead={canRead}
          canUpdateDraft={canUpdateDraft}
        />
      )}
    </section>
  );
}

