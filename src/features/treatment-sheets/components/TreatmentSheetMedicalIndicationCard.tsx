import type { TreatmentSheetResponse } from "../types/treatmentSheet.types";
import { formatOptionalTreatmentText, formatTreatmentDate, isTreatmentDraft } from "../utils/treatmentSheetFormatters";

type TreatmentSheetMedicalIndicationCardProps = {
  treatmentSheet: TreatmentSheetResponse;
};

function hasMedicalData(sheet: TreatmentSheetResponse): boolean {
  const values: Array<string | undefined | null> = [
    sheet.indicationDate,
    sheet.assignedStaffName,
    sheet.therapyName,
    sheet.nervousSystemIndications,
    sheet.cardiovascularReflexologyWith,
    sheet.digestiveColonReflexologyWith,
    sheet.respiratoryReflexologyWith,
    sheet.urinaryReflexologyWithAcidFruits,
    sheet.otherIndications,
    sheet.observations,
  ];

  return values.some((value) => value?.trim());
}

export function TreatmentSheetMedicalIndicationCard({
  treatmentSheet,
}: TreatmentSheetMedicalIndicationCardProps) {
  const pendingAndEmpty = isTreatmentDraft(treatmentSheet) && !hasMedicalData(treatmentSheet);

  if (pendingAndEmpty) {
    return (
      <section className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-4 md:p-5">
        <h3 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">
          Indicación médica
        </h3>
        <p className="mt-3 rounded-xl bg-[var(--color-sanaclub-bg)] p-4 text-sm text-[var(--color-sanaclub-muted)]">
          La indicación médica aún no ha sido completada.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-4 md:p-5">
      <h3 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">
        Indicación médica
      </h3>

      <div className="mt-3 grid gap-3 rounded-xl bg-[var(--color-sanaclub-bg)] p-4 text-sm text-[var(--color-sanaclub-text)]">
        <div>
          <p className="font-semibold text-[var(--color-sanaclub-text)]">Fecha de indicación</p>
          <p>{formatTreatmentDate(treatmentSheet.indicationDate)}</p>
        </div>
        <div>
          <p className="font-semibold text-[var(--color-sanaclub-text)]">Personal asignado</p>
          <p>{formatOptionalTreatmentText(treatmentSheet.assignedStaffName)}</p>
        </div>
        <div>
          <p className="font-semibold text-[var(--color-sanaclub-text)]">Terapia</p>
          <p>{formatOptionalTreatmentText(treatmentSheet.therapyName)}</p>
        </div>
        <div>
          <p className="font-semibold text-[var(--color-sanaclub-text)]">
            Indicaciones del sistema nervioso
          </p>
          <p>{formatOptionalTreatmentText(treatmentSheet.nervousSystemIndications)}</p>
        </div>
        <div>
          <p className="font-semibold text-[var(--color-sanaclub-text)]">
            Reflexología cardiovascular con
          </p>
          <p>{formatOptionalTreatmentText(treatmentSheet.cardiovascularReflexologyWith)}</p>
        </div>
        <div>
          <p className="font-semibold text-[var(--color-sanaclub-text)]">
            Reflexología digestiva/colon con
          </p>
          <p>{formatOptionalTreatmentText(treatmentSheet.digestiveColonReflexologyWith)}</p>
        </div>
        <div>
          <p className="font-semibold text-[var(--color-sanaclub-text)]">
            Reflexología respiratoria con
          </p>
          <p>{formatOptionalTreatmentText(treatmentSheet.respiratoryReflexologyWith)}</p>
        </div>
        <div>
          <p className="font-semibold text-[var(--color-sanaclub-text)]">
            Reflexología urinaria con frutos ácidos
          </p>
          <p>{formatOptionalTreatmentText(treatmentSheet.urinaryReflexologyWithAcidFruits)}</p>
        </div>
        <div>
          <p className="font-semibold text-[var(--color-sanaclub-text)]">Otras indicaciones</p>
          <p>{formatOptionalTreatmentText(treatmentSheet.otherIndications)}</p>
        </div>
        <div>
          <p className="font-semibold text-[var(--color-sanaclub-text)]">Observaciones</p>
          <p>{formatOptionalTreatmentText(treatmentSheet.observations)}</p>
        </div>
      </div>
    </section>
  );
}
