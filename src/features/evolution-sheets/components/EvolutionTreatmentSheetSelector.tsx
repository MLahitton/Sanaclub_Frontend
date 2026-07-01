import { formatTreatmentDate, formatOptionalTreatmentText } from "../../treatment-sheets/utils/treatmentSheetFormatters";
import type { TreatmentSheetResponse } from "../../treatment-sheets/types/treatmentSheet.types";
import type { UseFormRegisterReturn } from "react-hook-form";

type EvolutionTreatmentSheetSelectorProps = {
  treatmentSheets: TreatmentSheetResponse[];
  registerProps?: UseFormRegisterReturn<"treatmentSheetId">;
  disabled?: boolean;
  id: string;
  name: string;
  required?: boolean;
};

function getTreatmentLabel(sheet: TreatmentSheetResponse) {
  const number = formatOptionalTreatmentText(sheet.treatmentNumber, "Sin número");
  const consultationDate = formatTreatmentDate(sheet.consultationDate);
  const diagnosis = formatOptionalTreatmentText(sheet.epsTreatingDoctorDiagnosis, "Sin diagnóstico");
  const approvedDate = sheet.approvedAtUtc ? formatTreatmentDate(sheet.approvedAtUtc) : null;

  const approvedLabel = approvedDate ? ` • Aprobada ${approvedDate}` : " • Sin aprobación";

  return `${number} ${approvedLabel} | Consulta ${consultationDate} | ${diagnosis}`;
}

export function EvolutionTreatmentSheetSelector({
  treatmentSheets,
  registerProps,
  disabled,
  id,
  name,
  required,
}: EvolutionTreatmentSheetSelectorProps) {
  if (treatmentSheets.length === 0) {
    return (
      <p className="text-sm text-[var(--color-sanaclub-muted)]">
        No hay hojas de tratamiento aprobadas disponibles.
      </p>
    );
  }

  return (
    <select
      id={id}
      name={name}
      {...registerProps}
      disabled={disabled}
      required={required}
      className="w-full rounded-xl border border-[var(--color-sanaclub-border)] bg-white px-3 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
    >
      <option value="">Selecciona la hoja de tratamiento aprobada</option>
      {treatmentSheets.map((sheet) => (
        <option key={sheet.id} value={sheet.id}>
          {getTreatmentLabel(sheet)}
        </option>
      ))}
    </select>
  );
}
