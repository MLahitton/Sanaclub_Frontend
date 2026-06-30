import { isFuture, isValid, parseISO } from "date-fns";
import { z } from "zod";
import type { CreateTreatmentSheetRequest } from "../types/treatmentSheet.types";

const optionalText = (maxLength: number, label: string) =>
  z
    .string()
    .trim()
    .max(maxLength, `${label} no puede tener más de ${maxLength} caracteres.`);

export const createTreatmentSheetSchema = z.object({
  treatmentNumber: optionalText(50, "El número de tratamiento").optional(),
  consultationDate: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || isValid(parseISO(value)),
      "La fecha de consulta no tiene un formato valido",
    )
    .refine(
      (value) => value === "" || !isFuture(parseISO(value)),
      "La fecha de consulta no puede ser futura",
    ),
  epsTreatingDoctorDiagnosis: optionalText(1500, "El diagnóstico del médico tratante EPS").optional(),
  referredClinicalHistory: optionalText(3000, "La historia clínica referida").optional(),
});

export type CreateTreatmentSheetFormValues = z.infer<
  typeof createTreatmentSheetSchema
>;

function normalizeString(value?: string): string | null {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue : null;
}

export function toCreateTreatmentSheetRequest(
  values: CreateTreatmentSheetFormValues,
): CreateTreatmentSheetRequest {
  return {
    treatmentNumber: normalizeString(values.treatmentNumber),
    consultationDate: normalizeString(values.consultationDate),
    epsTreatingDoctorDiagnosis: normalizeString(values.epsTreatingDoctorDiagnosis),
    referredClinicalHistory: normalizeString(values.referredClinicalHistory),
  };
}
