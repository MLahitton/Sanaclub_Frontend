import type { EvolutionSheetResponse } from "../types/evolutionSheet.types";
import {
  formatEvolutionCompletedDate,
  formatEvolutionCreatedDate,
  formatEvolutionUpdatedDate,
} from "../utils/evolutionSheetFormatters";

type EvolutionSheetMetadataCardProps = {
  evolutionSheet: EvolutionSheetResponse;
};

export function EvolutionSheetMetadataCard({
  evolutionSheet,
}: EvolutionSheetMetadataCardProps) {
  return (
    <section className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-4 md:p-5">
      <h3 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">
        Metadata
      </h3>
      <div className="mt-3 space-y-3 rounded-xl bg-[var(--color-sanaclub-bg)] p-4 text-sm text-[var(--color-sanaclub-text)]">
        <div>
          <p className="font-semibold text-[var(--color-sanaclub-text)]">Creada el</p>
          <p>{formatEvolutionCreatedDate(evolutionSheet.createdAtUtc)}</p>
        </div>
        <div>
          <p className="font-semibold text-[var(--color-sanaclub-text)]">Actualizada el</p>
          <p>{formatEvolutionUpdatedDate(evolutionSheet.updatedAtUtc)}</p>
        </div>
        <div>
          <p className="font-semibold text-[var(--color-sanaclub-text)]">Completada el</p>
          <p>{formatEvolutionCompletedDate(evolutionSheet.completedAtUtc)}</p>
        </div>
        <div>
          <p className="font-semibold text-[var(--color-sanaclub-text)]">Estado</p>
          <p>{evolutionSheet.isActive ? "Activo" : "Inactivo"}</p>
        </div>
      </div>
    </section>
  );
}
