import { format, isValid, parseISO } from "date-fns";
import { AxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AccessDeniedState } from "../../../shared/components/AccessDeniedState";
import { LoadingState } from "../../../shared/components/LoadingState";
import { PageHeader } from "../../../shared/components/PageHeader";
import type { ApiErrorResponse } from "../../../shared/types/api.types";
import { TreatmentSheetMedicalIndicationForm } from "../components/TreatmentSheetMedicalIndicationForm";
import {
  formatTreatmentDate,
  formatTreatmentNumber,
  isTreatmentApproved,
} from "../utils/treatmentSheetFormatters";
import type { TreatmentSheetResponse } from "../types/treatmentSheet.types";
import { useTreatmentSheet } from "../hooks/useTreatmentSheet";
import { useUpdateTreatmentSheetMedicalIndication } from "../hooks/useUpdateTreatmentSheetMedicalIndication";
import type { UpdateTreatmentSheetMedicalIndicationFormValues } from "../schemas/treatmentSheet.schemas";
import { toUpdateTreatmentSheetMedicalIndicationRequest } from "../schemas/treatmentSheet.schemas";

function getTreatmentSheetErrorMessage(error: unknown): string {
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

  return "No fue posible cargar la hoja de tratamiento.";
}

function toInputDate(dateIso?: string | null): string {
  if (!dateIso?.trim()) {
    return "";
  }

  const parsedDate = parseISO(dateIso);
  if (!isValid(parsedDate)) {
    return dateIso.slice(0, 10);
  }

  return format(parsedDate, "yyyy-MM-dd");
}

function toDefaultValues(values: TreatmentSheetResponse): Partial<UpdateTreatmentSheetMedicalIndicationFormValues> {
  return {
    indicationDate: toInputDate(values.indicationDate),
    assignedStaffName: values.assignedStaffName ?? "",
    therapyName: values.therapyName ?? "",
    nervousSystemIndications: values.nervousSystemIndications ?? "",
    decompressSpine: values.decompressSpine,
    decompressNeck: values.decompressNeck,
    decompressBack: values.decompressBack,
    endocrineNerves: values.endocrineNerves,
    endocrineDefenses: values.endocrineDefenses,
    endocrineHormones: values.endocrineHormones,
    cardiovascularReflexologyWith: values.cardiovascularReflexologyWith ?? "",
    digestiveColonReflexologyWith: values.digestiveColonReflexologyWith ?? "",
    respiratoryReflexologyWith: values.respiratoryReflexologyWith ?? "",
    urinaryReflexologyWithAcidFruits: values.urinaryReflexologyWithAcidFruits ?? "",
    otherIndications: values.otherIndications ?? "",
    observations: values.observations ?? "",
  };
}

export function UpdateTreatmentSheetMedicalIndicationPage() {
  const navigate = useNavigate();
  const { treatmentSheetId } = useParams<{ treatmentSheetId: string }>();
  const normalizedTreatmentSheetId = treatmentSheetId?.trim();
  const treatmentSheetQuery = useTreatmentSheet(normalizedTreatmentSheetId);
  const updateMedicalIndicationMutation = useUpdateTreatmentSheetMedicalIndication();

  const handleSubmit = async (
    values: UpdateTreatmentSheetMedicalIndicationFormValues,
  ) => {
    if (!treatmentSheetQuery.data) {
      return;
    }

    const request = toUpdateTreatmentSheetMedicalIndicationRequest(values);

    await updateMedicalIndicationMutation.mutateAsync({
      treatmentSheetId: treatmentSheetQuery.data.id,
      request,
    });

    navigate(`/app/treatment-sheets/${treatmentSheetQuery.data.id}`, { replace: true });
  };

  const handleCancel = () => {
    if (!treatmentSheetQuery.data?.id) {
      if (normalizedTreatmentSheetId) {
        navigate(`/app/treatment-sheets/${normalizedTreatmentSheetId}`, { replace: true });
      } else {
        navigate("/app/patients", { replace: true });
      }

      return;
    }

    navigate(`/app/treatment-sheets/${treatmentSheetQuery.data.id}`, { replace: true });
  };

  if (!normalizedTreatmentSheetId) {
    return <AccessDeniedState message="No se identificó la hoja de tratamiento en la URL." />;
  }

  if (treatmentSheetQuery.isLoading && !treatmentSheetQuery.data) {
    return <LoadingState message="Cargando detalle para completar indicación..." />;
  }

  if (treatmentSheetQuery.isError) {
    const message = getTreatmentSheetErrorMessage(treatmentSheetQuery.error);

    return (
      <section className="space-y-4">
        <PageHeader
          title="Completar indicación médica"
          description={message}
          breadcrumbs={[
            { label: "Inicio", path: "/app" },
            { label: "Pacientes", path: "/app/patients" },
            { label: "Detalle de hoja de tratamiento" },
            { label: "Completar indicación médica" },
          ]}
        />

        <article className="rounded-2xl border border-[var(--color-sanaclub-coral)]/30 bg-white p-6 text-center shadow-[0_12px_35px_rgba(36,51,43,0.08)]">
          <h2 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">
            No fue posible cargar la hoja
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
              onClick={handleCancel}
              className="rounded-full border border-[var(--color-sanaclub-border)] px-5 py-2.5 text-sm font-semibold text-[var(--color-sanaclub-text)] transition hover:border-[var(--color-sanaclub-green)] hover:text-[var(--color-sanaclub-green)]"
            >
              Volver al detalle
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
  const isApproved = isTreatmentApproved(treatmentSheet);

  if (!treatmentSheet.isActive || isApproved) {
    const message = !treatmentSheet.isActive
      ? "Esta hoja de tratamiento no está activa."
      : "Esta hoja de tratamiento ya fue aprobada.";

    return (
      <section className="space-y-4">
        <PageHeader
          title="Completar indicación médica"
          description={message}
          breadcrumbs={[
            { label: "Inicio", path: "/app" },
            { label: "Pacientes", path: "/app/patients" },
            { label: "Detalle de hoja de tratamiento" },
          ]}
        />

        <article className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-6 text-center shadow-[0_12px_35px_rgba(36,51,43,0.08)]">
          <p className="text-sm text-[var(--color-sanaclub-text)]">{message}</p>
          <button
            type="button"
            onClick={handleCancel}
            className="mt-4 inline-flex rounded-full bg-[var(--color-sanaclub-green)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-sanaclub-green-dark)]"
          >
            Volver al detalle de la hoja
          </button>
        </article>
      </section>
    );
  }

  const defaultValues = toDefaultValues(treatmentSheet);

  return (
    <section className="space-y-4">
      <PageHeader
        title="Completar indicación médica"
        description="Registra la información clínica para aprobar la hoja de tratamiento."
        breadcrumbs={[
          { label: "Inicio", path: "/app" },
          { label: "Pacientes", path: "/app/patients" },
          { label: "Detalle de hoja de tratamiento" },
          { label: "Completar indicación médica" },
        ]}
      />

      <div className="rounded-3xl border border-[var(--color-sanaclub-border)] bg-white p-4 shadow-[0_16px_48px_rgba(36,51,43,0.08)] md:p-6">
        <div className="mb-6 rounded-2xl bg-[var(--color-sanaclub-bg)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-sanaclub-coral-dark)]">
            Hoja de tratamiento
          </p>
          <h2 className="mt-1 text-2xl font-bold text-[var(--color-sanaclub-text)]">
            {formatTreatmentNumber(treatmentSheet.treatmentNumber)}
          </h2>
          <div className="mt-2 grid gap-2 text-sm text-[var(--color-sanaclub-muted)] md:grid-cols-3">
            <p>
              <span className="font-semibold text-[var(--color-sanaclub-text)]">
                Fecha de consulta:
              </span>{" "}
              {formatTreatmentDate(treatmentSheet.consultationDate)}
            </p>
            <p>
              <span className="font-semibold text-[var(--color-sanaclub-text)]">
                Diagnóstico EPS:
              </span>{" "}
              {treatmentSheet.epsTreatingDoctorDiagnosis?.trim() || "Sin diagnóstico"}
            </p>
            <p>
              <span className="font-semibold text-[var(--color-sanaclub-text)]">Estado:</span>{" "}
              {isApproved ? "Aprobada" : "Pendiente"}
            </p>
          </div>
        </div>

        <TreatmentSheetMedicalIndicationForm
          defaultValues={defaultValues}
          isSubmitting={updateMedicalIndicationMutation.isPending}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
      </div>
    </section>
  );
}
