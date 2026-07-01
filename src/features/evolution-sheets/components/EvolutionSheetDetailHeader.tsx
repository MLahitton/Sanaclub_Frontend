import { ArrowLeft, FileText, ClipboardList, CheckCircle2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "../../auth/hooks/usePermissions";
import {
  formatEvolutionDate,
  formatEvolutionNumber,
  isEvolutionCompleted,
  isEvolutionPending,
} from "../utils/evolutionSheetFormatters";
import type { EvolutionSheetResponse } from "../types/evolutionSheet.types";

type EvolutionSheetDetailHeaderProps = {
  evolutionSheet: EvolutionSheetResponse;
  onBackToPatient: () => void;
  onViewTreatmentSheet?: () => void;
};

export function EvolutionSheetDetailHeader({
  evolutionSheet,
  onBackToPatient,
  onViewTreatmentSheet,
}: EvolutionSheetDetailHeaderProps) {
  const navigate = useNavigate();
  const { can } = usePermissions();
  const canViewTreatmentSheet = Boolean(evolutionSheet.treatmentSheetId?.trim()) && can("treatments.read");
  const canCompleteDraft = can("evolutions.update_draft");
  const showCompleteDraft = canCompleteDraft && isEvolutionPending(evolutionSheet) && evolutionSheet.isActive;
  const completed = isEvolutionCompleted(evolutionSheet);

  const handleCompleteDraft = () => {
    navigate(`/app/evolution-sheets/${evolutionSheet.id}/new-indications`);
  };

  return (
    <section className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-4 shadow-[0_12px_35px_rgba(36,51,43,0.08)] md:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-sanaclub-coral-dark)]">
            Detalle de hoja de evolución
          </p>
          <h2 className="text-2xl font-bold text-[var(--color-sanaclub-text)]">
            {formatEvolutionNumber(evolutionSheet.therapyNumber)}
          </h2>
          <p className="text-sm text-[var(--color-sanaclub-muted)]">
            Consulta la evolución clínica y las nuevas indicaciones asociadas.
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
            completed
              ? "bg-[var(--color-sanaclub-green)]/15 text-[var(--color-sanaclub-green-dark)]"
              : "bg-[var(--color-sanaclub-coral)]/15 text-[var(--color-sanaclub-coral-dark)]"
          }`}
        >
          {completed ? (
            <CheckCircle2 className="h-3.5 w-3.5" />
          ) : (
            <AlertCircle className="h-3.5 w-3.5" />
          )}
          {completed ? "Completada" : "Pendiente"}
        </span>
      </div>

      <div className="grid gap-2 rounded-xl bg-[var(--color-sanaclub-bg)] p-3 text-sm text-[var(--color-sanaclub-text)] md:grid-cols-2">
        <p>
          <span className="font-semibold">Numero de terapia:</span>{" "}
          {formatEvolutionNumber(evolutionSheet.therapyNumber)}
        </p>
        <p>
          <span className="font-semibold">Fecha de evolución:</span>{" "}
          {formatEvolutionDate(evolutionSheet.evolutionDate)}
        </p>
        <p>
          <span className="font-semibold">Estado:</span>{" "}
          {completed ? "Completada" : "Pendiente"}
        </p>
        <p>
          <span className="font-semibold">Terapia:</span>{" "}
          {evolutionSheet.therapyName?.trim() || "Sin registrar"}
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

        {canViewTreatmentSheet && onViewTreatmentSheet ? (
          <button
            type="button"
            onClick={onViewTreatmentSheet}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-sanaclub-border)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-sanaclub-text)] transition hover:border-[var(--color-sanaclub-green)] hover:text-[var(--color-sanaclub-green)]"
          >
            <FileText className="h-4 w-4" />
            Ver tratamiento base
          </button>
        ) : null}

        {showCompleteDraft ? (
          <button
            type="button"
            onClick={handleCompleteDraft}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-sanaclub-coral)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-sanaclub-coral-dark)] transition hover:bg-[var(--color-sanaclub-coral)] hover:text-white"
          >
            <ClipboardList className="h-4 w-4" />
            Completar nuevas indicaciones
          </button>
        ) : null}
      </div>
    </section>
  );
}
