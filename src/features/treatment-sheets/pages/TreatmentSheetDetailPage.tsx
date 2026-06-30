import { AxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AccessDeniedState } from "../../../shared/components/AccessDeniedState";
import { LoadingState } from "../../../shared/components/LoadingState";
import { PageHeader } from "../../../shared/components/PageHeader";
import type { ApiErrorResponse } from "../../../shared/types/api.types";
import { TreatmentSheetClinicalFlagsCard } from "../components/TreatmentSheetClinicalFlagsCard";
import { TreatmentSheetDetailHeader } from "../components/TreatmentSheetDetailHeader";
import { TreatmentSheetInitialInfoCard } from "../components/TreatmentSheetInitialInfoCard";
import { TreatmentSheetMedicalIndicationCard } from "../components/TreatmentSheetMedicalIndicationCard";
import { TreatmentSheetMetadataCard } from "../components/TreatmentSheetMetadataCard";
import { useTreatmentSheet } from "../hooks/useTreatmentSheet";

function getTreatmentSheetDetailErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.response?.status === 404) {
      return "La hoja de tratamiento no fue encontrada.";
    }

    if (error.response?.status === 403) {
      return "No tienes permisos para ver esta hoja de tratamiento.";
    }

    const response = error.response?.data as ApiErrorResponse | undefined;
    if (response?.message) {
      return response.message;
    }
  }

  return "No fue posible cargar la hoja de tratamiento. Revisa la conexión o intenta nuevamente.";
}

export function TreatmentSheetDetailPage() {
  const { treatmentSheetId } = useParams<{ treatmentSheetId: string }>();
  const navigate = useNavigate();
  const normalizedTreatmentSheetId = treatmentSheetId?.trim();
  const treatmentSheetQuery = useTreatmentSheet(normalizedTreatmentSheetId);

  const handleBackToPatient = () => {
    if (!treatmentSheetQuery.data?.patientId?.trim()) {
      navigate("/app/patients", { replace: true });
      return;
    }

    navigate(`/app/patients/${treatmentSheetQuery.data.patientId}`, { replace: true });
  };

  if (!normalizedTreatmentSheetId) {
    return <AccessDeniedState message="No se identificó la hoja de tratamiento en la URL." />;
  }

  if (treatmentSheetQuery.isLoading && !treatmentSheetQuery.data) {
    return <LoadingState message="Cargando detalle de la hoja..." />;
  }

  if (treatmentSheetQuery.isError) {
    const message = getTreatmentSheetDetailErrorMessage(treatmentSheetQuery.error);

    return (
      <section className="space-y-4">
        <PageHeader
          title="Detalle de hoja de tratamiento"
          description="No fue posible cargar la información solicitada."
          breadcrumbs={[
            { label: "Inicio", path: "/app" },
            { label: "Pacientes", path: "/app/patients" },
            { label: "Detalle de hoja" },
          ]}
        />

        <article className="rounded-2xl border border-[var(--color-sanaclub-coral)]/30 bg-white p-6 text-center shadow-[0_12px_35px_rgba(36,51,43,0.08)]">
          <h2 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">
            No fue posible cargar la hoja de tratamiento
          </h2>
          <p className="mt-2 text-sm text-[var(--color-sanaclub-muted)]">{message}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => treatmentSheetQuery.refetch()}
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

  if (!treatmentSheetQuery.data) {
    return null;
  }

  const treatmentSheet = treatmentSheetQuery.data;

  return (
    <section className="space-y-5">
      <PageHeader
        title="Detalle de hoja de tratamiento"
        description="Consulta la información inicial y la indicación médica asociada."
        breadcrumbs={[
          { label: "Inicio", path: "/app" },
          { label: "Pacientes", path: "/app/patients" },
          { label: "Detalle de hoja de tratamiento" },
        ]}
      />

      <TreatmentSheetDetailHeader
        treatmentSheet={treatmentSheet}
        onBackToPatient={handleBackToPatient}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <TreatmentSheetInitialInfoCard treatmentSheet={treatmentSheet} />
        <TreatmentSheetMedicalIndicationCard treatmentSheet={treatmentSheet} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TreatmentSheetClinicalFlagsCard treatmentSheet={treatmentSheet} />
        <TreatmentSheetMetadataCard treatmentSheet={treatmentSheet} />
      </div>
    </section>
  );
}
