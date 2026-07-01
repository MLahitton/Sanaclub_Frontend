import type { EvolutionSheetResponse } from "../types/evolutionSheet.types";
import { EvolutionSheetActionsMenu } from "./EvolutionSheetActionsMenu";
import { EvolutionSheetStatusBadge } from "./EvolutionSheetStatusBadge";
import {
  formatEvolutionCompletedDate,
  formatEvolutionCreatedDate,
  formatEvolutionDate,
  formatEvolutionNumber,
  formatEvolutionUpdatedDate,
  formatOptionalEvolutionText,
} from "../utils/evolutionSheetFormatters";

type EvolutionSheetsListProps = {
  evolutionSheets: EvolutionSheetResponse[];
  canRead: boolean;
  canUpdateDraft: boolean;
};

export function EvolutionSheetsList({
  evolutionSheets,
  canRead,
  canUpdateDraft,
}: EvolutionSheetsListProps) {
  return (
    <div className="mt-4 space-y-3">
      {evolutionSheets.map((sheet) => (
        <article
          key={sheet.id}
          className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-4 shadow-[0_12px_28px_rgba(36,51,43,0.05)]"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-sanaclub-text)]">
                {formatEvolutionNumber(sheet.therapyNumber)}{" "}
                {sheet.therapyName ? `• ${sheet.therapyName}` : ""}
              </h3>
              <p className="mt-1 text-xs text-[var(--color-sanaclub-muted)]">
                {formatEvolutionDate(sheet.evolutionDate)}
              </p>
            </div>
            <EvolutionSheetStatusBadge evolutionSheet={sheet} />
          </div>

          <div className="mt-3 grid gap-2 rounded-xl bg-[var(--color-sanaclub-bg)] p-3 text-sm text-[var(--color-sanaclub-text)]">
            <p>
              <span className="font-semibold text-[var(--color-sanaclub-text)]">Notas de evolución:</span>{" "}
              {formatOptionalEvolutionText(sheet.evolutionNotes)}
            </p>
            <p>
              <span className="font-semibold text-[var(--color-sanaclub-text)]">
                Personal asignado:
              </span>{" "}
              {formatOptionalEvolutionText(sheet.assignedStaffName)}
            </p>
            <p>
              <span className="font-semibold text-[var(--color-sanaclub-text)]">
                Terapia:
              </span>{" "}
              {formatOptionalEvolutionText(sheet.therapyName)}
            </p>
            <p>
              <span className="font-semibold text-[var(--color-sanaclub-text)]">
                Nuevas indicaciones:
              </span>{" "}
              {formatOptionalEvolutionText(sheet.newIndications)}
            </p>
            <p>
              <span className="font-semibold text-[var(--color-sanaclub-text)]">Creada:</span>{" "}
              {formatEvolutionCreatedDate(sheet.createdAtUtc)}
            </p>
            <p>
              <span className="font-semibold text-[var(--color-sanaclub-text)]">
                Completada:
              </span>{" "}
              {formatEvolutionCompletedDate(sheet.completedAtUtc)}
            </p>
            <p>
              <span className="font-semibold text-[var(--color-sanaclub-text)]">Actualizada:</span>{" "}
              {formatEvolutionUpdatedDate(sheet.updatedAtUtc)}
            </p>
          </div>

          <EvolutionSheetActionsMenu
            evolutionSheet={sheet}
            canRead={canRead}
            canUpdateDraft={canUpdateDraft}
          />
        </article>
      ))}
    </div>
  );
}
