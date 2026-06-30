import { AxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { AccessDeniedState } from "../../../shared/components/AccessDeniedState";
import { LoadingState } from "../../../shared/components/LoadingState";
import { PageHeader } from "../../../shared/components/PageHeader";
import { usePermissions } from "../../auth/hooks/usePermissions";
import { formatPatientFullName } from "../../patients/utils/patientFormatters";
import { usePatient } from "../../patients/hooks/usePatient";
import { TreatmentSheetInitialForm } from "../components/TreatmentSheetInitialForm";
import { useCreateTreatmentSheet } from "../hooks/useCreateTreatmentSheet";
import type { ApiErrorResponse } from "../../../shared/types/api.types";
import {
  toCreateTreatmentSheetRequest,
  type CreateTreatmentSheetFormValues,
} from "../schemas/treatmentSheet.schemas";

function getPatientErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.response?.status === 404) {
      return "Paciente no encontrado.";
    }

    if (error.response?.status === 403) {
      return "No tienes permisos para acceder al detalle de este paciente.";
    }

    const response = error.response?.data as ApiErrorResponse | undefined;
    if (response?.message) {
      return response.message;
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "No fue posible cargar la información del paciente.";
}

export function CreateTreatmentSheetPage() {
  const navigate = useNavigate();
  const { patientId } = useParams<{ patientId: string }>();
  const { can } = usePermissions();
  const normalizedPatientId = patientId?.trim();
  const canCreate = can("treatments.create");

  const patientQuery = usePatient(normalizedPatientId);
  const createTreatmentSheetMutation = useCreateTreatmentSheet(normalizedPatientId);

  const handleSubmit = async (values: CreateTreatmentSheetFormValues) => {
    const request = toCreateTreatmentSheetRequest(values);
    if (!normalizedPatientId) {
      toast.error("No se identificó el paciente para crear la hoja.");
      return;
    }

    await createTreatmentSheetMutation.mutateAsync(request);
    navigate(`/app/patients/${normalizedPatientId}`, { replace: true });
  };

  const handleCancel = () => {
    if (!normalizedPatientId) {
      navigate("/app/patients", { replace: true });
      return;
    }

    navigate(`/app/patients/${normalizedPatientId}`, { replace: true });
  };

  if (!canCreate) {
    return (
      <AccessDeniedState
        message="No tienes permisos para crear hojas de tratamiento."
        requiredPermissions={["treatments.create"]}
      />
    );
  }

  if (!normalizedPatientId) {
    return (
      <section className="space-y-4">
        <PageHeader
          title="Crear hoja de tratamiento inicial"
          description="No fue posible identificar al paciente en la URL."
          breadcrumbs={[
            { label: "Inicio", path: "/app" },
            { label: "Pacientes", path: "/app/patients" },
            { label: "Nueva hoja de tratamiento" },
          ]}
        />

        <article className="rounded-2xl border border-[var(--color-sanaclub-coral)]/30 bg-white p-6 text-center shadow-[0_12px_35px_rgba(36,51,43,0.08)]">
          <h2 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">
            Falta el identificador del paciente
          </h2>
          <p className="mt-2 text-sm text-[var(--color-sanaclub-muted)]">
            Revisa la ruta y vuelve al listado para iniciar de nuevo.
          </p>
          <button
            type="button"
            onClick={() => navigate("/app/patients", { replace: true })}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--color-sanaclub-green)] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-sanaclub-green-dark)]"
          >
            Volver al listado
          </button>
        </article>
      </section>
    );
  }

  if (patientQuery.isLoading && !patientQuery.data) {
    return <LoadingState message="Cargando paciente..." />;
  }

  if (patientQuery.isError) {
    const message = getPatientErrorMessage(patientQuery.error);
    return (
      <section className="space-y-4">
        <PageHeader
          title="Crear hoja de tratamiento inicial"
          description={message}
          breadcrumbs={[
            { label: "Inicio", path: "/app" },
            { label: "Pacientes", path: "/app/patients" },
            { label: "Nueva hoja de tratamiento" },
          ]}
        />

        <article className="rounded-2xl border border-[var(--color-sanaclub-coral)]/30 bg-white p-6 text-center shadow-[0_12px_35px_rgba(36,51,43,0.08)]">
          <h2 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">
            No fue posible cargar el paciente
          </h2>
          <p className="mt-2 text-sm text-[var(--color-sanaclub-muted)]">{message}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => patientQuery.refetch()}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-sanaclub-coral)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-sanaclub-coral-dark)]"
            >
              Reintentar
            </button>
            <button
              type="button"
              onClick={() => navigate("/app/patients", { replace: true })}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-sanaclub-border)] px-5 py-2.5 text-sm font-semibold text-[var(--color-sanaclub-text)] transition hover:border-[var(--color-sanaclub-green)] hover:text-[var(--color-sanaclub-green)]"
            >
              Volver al listado
            </button>
          </div>
        </article>
      </section>
    );
  }

  if (!patientQuery.data) {
    return null;
  }

  const patientName = formatPatientFullName(patientQuery.data);

  return (
    <section className="space-y-4">
      <PageHeader
        title="Crear hoja de tratamiento inicial"
        description={`${patientName}. Esta información será revisada posteriormente para completar la indicación médica.`}
        breadcrumbs={[
          { label: "Inicio", path: "/app" },
          { label: "Pacientes", path: "/app/patients" },
          { label: "Nueva hoja de tratamiento" },
        ]}
      />

      <div className="rounded-3xl border border-[var(--color-sanaclub-border)] bg-white p-4 shadow-[0_16px_48px_rgba(36,51,43,0.08)] md:p-6">
        <TreatmentSheetInitialForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={createTreatmentSheetMutation.isPending}
        />
      </div>
    </section>
  );
}
