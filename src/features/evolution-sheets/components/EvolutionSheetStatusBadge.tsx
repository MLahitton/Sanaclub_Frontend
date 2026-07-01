import { formatEvolutionStatus, isEvolutionCompleted } from "../utils/evolutionSheetFormatters";
import type { EvolutionSheetResponse } from "../types/evolutionSheet.types";

type EvolutionSheetStatusBadgeProps = {
  evolutionSheet: EvolutionSheetResponse;
};

export function EvolutionSheetStatusBadge({
  evolutionSheet,
}: EvolutionSheetStatusBadgeProps) {
  const isCompleted = isEvolutionCompleted(evolutionSheet);

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        isCompleted
          ? "bg-[var(--color-sanaclub-green)]/15 text-[var(--color-sanaclub-green-dark)]"
          : "bg-[var(--color-sanaclub-coral)]/15 text-[var(--color-sanaclub-coral-dark)]"
      }`}
    >
      {formatEvolutionStatus(evolutionSheet)}
    </span>
  );
}

