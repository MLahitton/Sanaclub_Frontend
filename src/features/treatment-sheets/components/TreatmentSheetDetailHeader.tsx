import { useNavigate } from "react-router-dom";
import { CheckCircle2, AlertCircle, ArrowLeft, FileText } from "lucide-react";
import { toast } from "sonner";
import { usePermissions } from "../../auth/hooks/usePermissions";
import {
  formatTreatmentDate,
  formatTreatmentNumber,
  formatTreatmentStatus,
  isTreatmentApproved,
} from "../utils/treatmentSheetFormatters";
import type { TreatmentSheetResponse } from "../types/treatmentSheet.types";

type TreatmentSheetDetailHeaderProps = {
  treatmentSheet: TreatmentSheetResponse;
  onBackToPatient: () => void;
};

export function TreatmentSheetDetailHeader({
  treatmentSheet,
  onBackToPatient,
}: TreatmentSheetDetailHeaderProps) {
  const { can } = usePermissions();
  const navigate = useNavigate();
  const approved = isTreatmentApproved(treatmentSheet);
  const canCompleteMedicalIndication = can("treatments.update_medical_indication");
  const canGeneratePdf = can("documents.generate");
  const canCompleteAction =
    canCompleteMedicalIndication && treatmentSheet.isActive && !approved;

  const handleCompleteIndication = () => {
    navigate(`/app/treatment-sheets/${treatmentSheet.id}/medical-indication`);
  };

  const handleGeneratePdf = () => {
    toast.info("La generacion de PDF se implementara en una proxima fase.");
  };

  return (
    <section className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-4 shadow-[0_12px_35px_rgba(36,51,43,0.08)] md:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-sanaclub-coral-dark)]">
            Detalle de hoja de tratamiento
          </p>
          <h2 className="text-2xl font-bold text-[var(--color-sanaclub-text)]">
            {formatTreatmentNumber(treatmentSheet.treatmentNumber)}
          </h2>
          <p className="text-sm text-[var(--color-sanaclub-muted)]">
            Consulta la informacion inicial y la indicacion medica asociada.
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
            approved
              ? "bg-[var(--color-sanaclub-green)]/15 text-[var(--color-sanaclub-green-dark)]"
              : "bg-[var(--color-sanaclub-coral)]/15 text-[var(--color-sanaclub-coral-dark)]"
          }`}
        >
          {approved ? (
            <CheckCircle2 className="h-3.5 w-3.5" />
          ) : (
            <AlertCircle className="h-3.5 w-3.5" />
          )}
          {formatTreatmentStatus(treatmentSheet)}
        </span>
      </div>

      <div className="grid gap-2 rounded-xl bg-[var(--color-sanaclub-bg)] p-3 text-sm text-[var(--color-sanaclub-text)] md:grid-cols-2">
        <p>
          <span className="font-semibold">Numero de tratamiento:</span>{" "}
          {formatTreatmentNumber(treatmentSheet.treatmentNumber)}
        </p>
        <p>
          <span className="font-semibold">Fecha de consulta:</span>{" "}
          {formatTreatmentDate(treatmentSheet.consultationDate)}
        </p>
        <p>
          <span className="font-semibold">Estado:</span>{" "}
          {formatTreatmentStatus(treatmentSheet)}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onBackToPatient}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-sanaclub-border)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-sanaclub-text)] transition hover:border-[var(--color-sanaclub-green)] hover:text-[var(--color-sanaclub-green)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al paciente
        </button>

        {canCompleteAction ? (
          <button
            type="button"
            onClick={handleCompleteIndication}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-sanaclub-coral)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-sanaclub-coral-dark)] transition hover:bg-[var(--color-sanaclub-coral)] hover:text-white"
          >
            <FileText className="h-4 w-4" />
            Completar indicacion medica
          </button>
        ) : null}

        {canGeneratePdf ? (
          <button
            type="button"
            onClick={handleGeneratePdf}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-sanaclub-border)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-sanaclub-text)] transition hover:border-[var(--color-sanaclub-green)] hover:text-[var(--color-sanaclub-green)]"
          >
            <FileText className="h-4 w-4" />
            Generar PDF
          </button>
        ) : null}
      </div>
    </section>
  );
}
