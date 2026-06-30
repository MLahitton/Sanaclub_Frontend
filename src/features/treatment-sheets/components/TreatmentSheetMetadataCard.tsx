import type { TreatmentSheetResponse } from "../types/treatmentSheet.types";
import {
  formatTreatmentCreatedDate,
  formatTreatmentUpdatedDate,
} from "../utils/treatmentSheetFormatters";

type TreatmentSheetMetadataCardProps = {
  treatmentSheet: TreatmentSheetResponse;
};

export function TreatmentSheetMetadataCard({
  treatmentSheet,
}: TreatmentSheetMetadataCardProps) {
  const approvedAt = treatmentSheet.approvedAtUtc?.trim()
    ? formatTreatmentCreatedDate(treatmentSheet.approvedAtUtc)
    : "Sin aprobación";

  return (
    <section className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-4 md:p-5">
      <h3 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">
        Metadata
      </h3>
      <div className="mt-3 space-y-3 rounded-xl bg-[var(--color-sanaclub-bg)] p-4 text-sm text-[var(--color-sanaclub-text)]">
        <div>
          <p className="font-semibold text-[var(--color-sanaclub-text)]">Creado el</p>
          <p>{formatTreatmentCreatedDate(treatmentSheet.createdAtUtc)}</p>
        </div>
        <div>
          <p className="font-semibold text-[var(--color-sanaclub-text)]">Actualizado el</p>
          <p>{formatTreatmentUpdatedDate(treatmentSheet.updatedAtUtc)}</p>
        </div>
        <div>
          <p className="font-semibold text-[var(--color-sanaclub-text)]">Aprobado el</p>
          <p>{approvedAt}</p>
        </div>
        <div>
          <p className="font-semibold text-[var(--color-sanaclub-text)]">Estado de la hoja</p>
          <p>{treatmentSheet.isActive ? "Activo" : "Inactivo"}</p>
        </div>
      </div>
    </section>
  );
}
