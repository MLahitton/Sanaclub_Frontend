import { AxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AccessDeniedState } from "../../../shared/components/AccessDeniedState";
import { LoadingState } from "../../../shared/components/LoadingState";
import { PageHeader } from "../../../shared/components/PageHeader";
import type { ApiErrorResponse } from "../../../shared/types/api.types";
import { EvolutionSheetDetailHeader } from "../components/EvolutionSheetDetailHeader";
import { EvolutionSheetInitialInfoCard } from "../components/EvolutionSheetInitialInfoCard";
import { EvolutionSheetMetadataCard } from "../components/EvolutionSheetMetadataCard";
import { EvolutionSheetNewIndicationsCard } from "../components/EvolutionSheetNewIndicationsCard";
import { EvolutionSheetNotesCard } from "../components/EvolutionSheetNotesCard";
import { useEvolutionSheet } from "../hooks/useEvolutionSheet";

function getEvolutionSheetDetailErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.response?.status === 404) {
      return "La hoja de evolución no fue encontrada.";
    }

    if (error.response?.status === 403) {
      return "No tienes permisos para ver esta hoja de evolución.";
    }

    const response = error.response?.data as ApiErrorResponse | undefined;
    if (response?.message) {
      return response.message;
    }
  }

  return "No fue posible cargar la hoja de evolución. Revisa la conexión o intenta nuevamente.";
}

export function EvolutionSheetDetailPage() {
  const { evolutionSheetId } = useParams<{ evolutionSheetId: string }>();
  const navigate = useNavigate();
  const normalizedEvolutionSheetId = evolutionSheetId?.trim();
  const evolutionSheetQuery = useEvolutionSheet(normalizedEvolutionSheetId);

  const handleBackToPatient = () => {
    const patientId = evolutionSheetQuery.data?.patientId?.trim();

    if (!patientId) {
      navigate("/app/patients", { replace: true });
      return;
    }

    navigate(`/app/patients/${patientId}`, { replace: true });
  };

  const handleViewTreatmentSheet = () => {
    const treatmentSheetId = evolutionSheetQuery.data?.treatmentSheetId?.trim();

    if (!treatmentSheetId) {
      return;
    }

    navigate(`/app/treatment-sheets/${treatmentSheetId}`, { replace: true });
  };

  if (!normalizedEvolutionSheetId) {
    return <AccessDeniedState message="No se identificó la hoja de evolución en la URL." />;
  }

  if (evolutionSheetQuery.isLoading && !evolutionSheetQuery.data) {
    return <LoadingState message="Cargando detalle de la hoja..." />;
  }

  if (evolutionSheetQuery.isError) {
    const message = getEvolutionSheetDetailErrorMessage(evolutionSheetQuery.error);

    return (
      <section className="space-y-4">
        <PageHeader
          title="Detalle de hoja de evolución"
          description="No fue posible cargar la información solicitada."
          breadcrumbs={[
            { label: "Inicio", path: "/app" },
            { label: "Pacientes", path: "/app/patients" },
            { label: "Detalle de hoja de evolución" },
          ]}
        />

        <article className="rounded-2xl border border-[var(--color-sanaclub-coral)]/30 bg-white p-6 text-center shadow-[0_12px_35px_rgba(36,51,43,0.08)]">
          <h2 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">
            No fue posible cargar la hoja de evolución
          </h2>
          <p className="mt-2 text-sm text-[var(--color-sanaclub-muted)]">{message}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => evolutionSheetQuery.refetch()}
              className="rounded-full bg-[var(--color-sanaclub-coral)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-sanaclub-coral-dark)]"
            >
              Reintentar
            </button>
            <button
              type="button"
              onClick={() => navigate("/app/patients", { replace: true })}
              className="rounded-full border border-[var(--color-sanaclub-border)] px-5 py-2.5 text-sm font-semibold text-[var(--color-sanaclub-text)] transition hover:border-[var(--color-sanaclub-green)] hover:text-[var(--color-sanaclub-green)]"
            >
              Volver al listado
            </button>
          </div>
        </article>
      </section>
    );
  }

  if (!evolutionSheetQuery.data) {
    return null;
  }

  const evolutionSheet = evolutionSheetQuery.data;

  return (
    <section className="space-y-5">
      <PageHeader
        title="Detalle de hoja de evolución"
        description="Consulta la evolución clínica y las nuevas indicaciones asociadas."
        breadcrumbs={[
          { label: "Inicio", path: "/app" },
          { label: "Pacientes", path: "/app/patients" },
          { label: "Detalle de hoja de evolución" },
        ]}
      />

      <EvolutionSheetDetailHeader
        evolutionSheet={evolutionSheet}
        onBackToPatient={handleBackToPatient}
        onViewTreatmentSheet={handleViewTreatmentSheet}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <EvolutionSheetInitialInfoCard evolutionSheet={evolutionSheet} />
        <EvolutionSheetNotesCard evolutionSheet={evolutionSheet} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <EvolutionSheetNewIndicationsCard evolutionSheet={evolutionSheet} />
        <EvolutionSheetMetadataCard evolutionSheet={evolutionSheet} />
      </div>
    </section>
  );
}
