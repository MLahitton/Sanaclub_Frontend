import { FileText, CheckCircle2, FileCog2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { TreatmentSheetResponse } from "../types/treatmentSheet.types";
import { isTreatmentApproved } from "../utils/treatmentSheetFormatters";

type TreatmentSheetActionsMenuProps = {
  treatmentSheet: TreatmentSheetResponse;
  canRead: boolean;
  canCompleteIndication: boolean;
  canGeneratePdf: boolean;
};

export function TreatmentSheetActionsMenu({
  treatmentSheet,
  canRead,
  canCompleteIndication,
  canGeneratePdf,
}: TreatmentSheetActionsMenuProps) {
  const navigate = useNavigate();

  const handleViewDetail = () => {
    navigate(`/app/treatment-sheets/${treatmentSheet.id}`);
  };

  const handleCompleteIndication = () => {
    toast.info("La indicación médica se implementará en una próxima fase.");
  };

  const handleGeneratePdf = () => {
    toast.info("La generación de PDF se implementará en una próxima fase.");
  };

  const showCompleteIndication = canCompleteIndication && !isTreatmentApproved(treatmentSheet);

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {canRead ? (
        <button
          type="button"
          onClick={handleViewDetail}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-sanaclub-border)] px-3 py-1.5 text-xs font-semibold text-[var(--color-sanaclub-text)] transition hover:border-[var(--color-sanaclub-green)] hover:text-[var(--color-sanaclub-green)]"
        >
          <FileText className="h-3.5 w-3.5" />
          Ver detalle
        </button>
      ) : null}

      {showCompleteIndication ? (
        <button
          type="button"
          onClick={handleCompleteIndication}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-sanaclub-coral)] px-3 py-1.5 text-xs font-semibold text-[var(--color-sanaclub-coral-dark)] transition hover:bg-[var(--color-sanaclub-coral)] hover:text-white"
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Completar indicación médica
        </button>
      ) : null}

      {canGeneratePdf ? (
        <button
          type="button"
          onClick={handleGeneratePdf}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-sanaclub-border)] px-3 py-1.5 text-xs font-semibold text-[var(--color-sanaclub-text)] transition hover:border-[var(--color-sanaclub-green)] hover:text-[var(--color-sanaclub-green)]"
        >
          <FileCog2 className="h-3.5 w-3.5" />
          Generar PDF
        </button>
      ) : null}
    </div>
  );
}
