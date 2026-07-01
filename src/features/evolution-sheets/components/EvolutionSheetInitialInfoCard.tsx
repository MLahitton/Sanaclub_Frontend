import type { EvolutionSheetResponse } from "../types/evolutionSheet.types";
import {
  formatEvolutionDate,
  formatEvolutionNumber,
  formatOptionalEvolutionText,
} from "../utils/evolutionSheetFormatters";

type EvolutionSheetInitialInfoCardProps = {
  evolutionSheet: EvolutionSheetResponse;
};

export function EvolutionSheetInitialInfoCard({
  evolutionSheet,
}: EvolutionSheetInitialInfoCardProps) {
  return (
    <section className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-4 md:p-5">
      <h3 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">
        Informacion inicial
      </h3>

      <div className="mt-3 space-y-3 rounded-xl bg-[var(--color-sanaclub-bg)] p-4 text-sm text-[var(--color-sanaclub-text)]">
        <div>
          <p className="font-semibold text-[var(--color-sanaclub-text)]">
            Numero de terapia / evolucion
          </p>
          <p>{formatEvolutionNumber(evolutionSheet.therapyNumber)}</p>
        </div>

        <div>
          <p className="font-semibold text-[var(--color-sanaclub-text)]">Fecha de evolucion</p>
          <p>{formatEvolutionDate(evolutionSheet.evolutionDate)}</p>
        </div>

        <div>
          <p className="font-semibold text-[var(--color-sanaclub-text)]">
            Encargada / personal asignado
          </p>
          <p>{formatOptionalEvolutionText(evolutionSheet.assignedStaffName)}</p>
        </div>

        <div>
          <p className="font-semibold text-[var(--color-sanaclub-text)]">Terapia</p>
          <p>{formatOptionalEvolutionText(evolutionSheet.therapyName)}</p>
        </div>
      </div>
    </section>
  );
}
