import type { EvolutionSheetResponse } from "../types/evolutionSheet.types";
import { formatOptionalEvolutionText } from "../utils/evolutionSheetFormatters";

type EvolutionSheetNotesCardProps = {
  evolutionSheet: EvolutionSheetResponse;
};

export function EvolutionSheetNotesCard({ evolutionSheet }: EvolutionSheetNotesCardProps) {
  return (
    <section className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-4 md:p-5">
      <h3 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">
        Notas de evolución
      </h3>

      <div className="mt-3 rounded-xl bg-[var(--color-sanaclub-bg)] p-4 text-sm text-[var(--color-sanaclub-text)]">
        <p>{formatOptionalEvolutionText(evolutionSheet.evolutionNotes, "Sin registrar")}</p>
      </div>
    </section>
  );
}
