import type { TreatmentSheetResponse } from "../types/treatmentSheet.types";
import { formatOptionalTreatmentText, formatTreatmentDate } from "../utils/treatmentSheetFormatters";

type TreatmentSheetInitialInfoCardProps = {
  treatmentSheet: TreatmentSheetResponse;
};

export function TreatmentSheetInitialInfoCard({
  treatmentSheet,
}: TreatmentSheetInitialInfoCardProps) {
  return (
    <section className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-4 md:p-5">
      <h3 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">
        Información inicial
      </h3>

      <div className="mt-3 space-y-3 rounded-xl bg-[var(--color-sanaclub-bg)] p-4 text-sm text-[var(--color-sanaclub-text)]">
        <div>
          <p className="font-semibold text-[var(--color-sanaclub-text)]">
            Número de tratamiento
          </p>
          <p>{formatOptionalTreatmentText(treatmentSheet.treatmentNumber, "Sin registrar")}</p>
        </div>

        <div>
          <p className="font-semibold text-[var(--color-sanaclub-text)]">Fecha de consulta</p>
          <p>{formatTreatmentDate(treatmentSheet.consultationDate)}</p>
        </div>

        <div>
          <p className="font-semibold text-[var(--color-sanaclub-text)]">
            Diagnóstico del médico tratante EPS
          </p>
          <p>{formatOptionalTreatmentText(treatmentSheet.epsTreatingDoctorDiagnosis)}</p>
        </div>

        <div>
          <p className="font-semibold text-[var(--color-sanaclub-text)]">Historia clínica referida</p>
          <p>{formatOptionalTreatmentText(treatmentSheet.referredClinicalHistory)}</p>
        </div>
      </div>
    </section>
  );
}
