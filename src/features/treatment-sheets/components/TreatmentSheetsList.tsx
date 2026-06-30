import type { TreatmentSheetResponse } from "../types/treatmentSheet.types";
import { TreatmentSheetActionsMenu } from "./TreatmentSheetActionsMenu";
import { TreatmentSheetStatusBadge } from "./TreatmentSheetStatusBadge";
import {
  formatOptionalTreatmentText,
  formatTreatmentCreatedDate,
  formatTreatmentDate,
  formatTreatmentNumber,
} from "../utils/treatmentSheetFormatters";

type TreatmentSheetsListProps = {
  treatmentSheets: TreatmentSheetResponse[];
  canRead: boolean;
  canCompleteMedicalIndication: boolean;
  canGeneratePdf: boolean;
};

export function TreatmentSheetsList({
  treatmentSheets,
  canRead,
  canCompleteMedicalIndication,
  canGeneratePdf,
}: TreatmentSheetsListProps) {
  return (
    <div className="mt-4 space-y-3">
      {treatmentSheets.map((sheet) => (
        <article
          key={sheet.id}
          className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-4 shadow-[0_12px_28px_rgba(36,51,43,0.05)]"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-sanaclub-text)]">
                {formatTreatmentNumber(sheet.treatmentNumber)}{" "}
                {sheet.therapyName ? `• ${sheet.therapyName}` : ""}
              </h3>
              <p className="mt-1 text-xs text-[var(--color-sanaclub-muted)]">
                {formatTreatmentDate(sheet.consultationDate)}
              </p>
            </div>
            <TreatmentSheetStatusBadge treatmentSheet={sheet} />
          </div>

          <div className="mt-3 grid gap-2 rounded-xl bg-[var(--color-sanaclub-bg)] p-3 text-sm text-[var(--color-sanaclub-text)]">
            <p>
              <span className="font-semibold text-[var(--color-sanaclub-text)]">Diagnóstico EPS:</span>{" "}
              {formatOptionalTreatmentText(sheet.epsTreatingDoctorDiagnosis)}
            </p>
            <p>
              <span className="font-semibold text-[var(--color-sanaclub-text)]">
                Historia clínica referida:
              </span>{" "}
              {formatOptionalTreatmentText(sheet.referredClinicalHistory)}
            </p>
            <p>
              <span className="font-semibold text-[var(--color-sanaclub-text)]">
                Personal asignado:
              </span>{" "}
              {formatOptionalTreatmentText(sheet.assignedStaffName)}
            </p>
            <p>
              <span className="font-semibold text-[var(--color-sanaclub-text)]">Creada:</span>{" "}
              {formatTreatmentCreatedDate(sheet.createdAtUtc)}
            </p>
          </div>

          <TreatmentSheetActionsMenu
            treatmentSheet={sheet}
            canRead={canRead}
            canCompleteIndication={canCompleteMedicalIndication}
            canGeneratePdf={canGeneratePdf}
          />
        </article>
      ))}
    </div>
  );
}
