import type { TreatmentSheetResponse } from "../types/treatmentSheet.types";
import { isTreatmentApproved } from "../utils/treatmentSheetFormatters";

type TreatmentSheetStatusBadgeProps = {
  treatmentSheet: TreatmentSheetResponse;
};

export function TreatmentSheetStatusBadge({
  treatmentSheet,
}: TreatmentSheetStatusBadgeProps) {
  const isApproved = isTreatmentApproved(treatmentSheet);

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        isApproved
          ? "bg-[var(--color-sanaclub-green)]/15 text-[var(--color-sanaclub-green-dark)]"
          : "bg-[var(--color-sanaclub-coral)]/15 text-[var(--color-sanaclub-coral-dark)]"
      }`}
    >
      {isApproved ? "Aprobada" : "Pendiente"}
    </span>
  );
}
