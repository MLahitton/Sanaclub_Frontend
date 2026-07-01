import { isEvolutionPending } from "../utils/evolutionSheetFormatters";
import type { EvolutionSheetResponse } from "../types/evolutionSheet.types";

type EvolutionSheetNewIndicationsCardProps = {
  evolutionSheet: EvolutionSheetResponse;
};

export function EvolutionSheetNewIndicationsCard({
  evolutionSheet,
}: EvolutionSheetNewIndicationsCardProps) {
  const hasNewIndications = Boolean(evolutionSheet.newIndications?.trim());
  const pending = isEvolutionPending(evolutionSheet);

  const text = hasNewIndications
    ? evolutionSheet.newIndications?.trim()
    : pending
      ? "Las nuevas indicaciones aún no han sido completadas."
      : "Sin indicaciones registradas.";

  return (
    <section className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-4 md:p-5">
      <h3 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">
        Nuevas indicaciones
      </h3>

      <div className="mt-3 rounded-xl bg-[var(--color-sanaclub-bg)] p-4 text-sm text-[var(--color-sanaclub-text)]">
        <p>{text}</p>
      </div>
    </section>
  );
}
