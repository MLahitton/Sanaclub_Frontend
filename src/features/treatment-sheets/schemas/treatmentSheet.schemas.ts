import { isFuture, isValid, parseISO } from "date-fns";
import { z } from "zod";
import type {
  CreateTreatmentSheetRequest,
  UpdateTreatmentSheetMedicalIndicationRequest,
} from "../types/treatmentSheet.types";

const requiredText = (maxLength: number, label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} es obligatorio`)
    .max(maxLength, `${label} no puede tener más de ${maxLength} caracteres.`);

const optionalText = (maxLength: number, label: string) =>
  z
    .string()
    .trim()
    .max(maxLength, `${label} no puede tener más de ${maxLength} caracteres.`);

const optionalDate = (label: string) =>
  z
    .string()
    .trim()
    .refine(
      (value) => value === "" || isValid(parseISO(value)),
      `La ${label} no tiene un formato válido`,
    )
    .refine(
      (value) => value === "" || !isFuture(parseISO(value)),
      `La ${label} no puede ser futura`,
    );

const requiredDateAllowFuture = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} es obligatoria`)
    .refine((value) => isValid(parseISO(value)), `${label} no tiene un formato válido`);

export const createTreatmentSheetSchema = z.object({
  treatmentNumber: optionalText(50, "El número de tratamiento").optional(),
  consultationDate: optionalDate("fecha de consulta"),
  epsTreatingDoctorDiagnosis: optionalText(1500, "El diagnóstico del médico tratante EPS").optional(),
  referredClinicalHistory: optionalText(3000, "La historia clínica referida").optional(),
});

export type CreateTreatmentSheetFormValues = z.infer<
  typeof createTreatmentSheetSchema
>;

export const updateTreatmentSheetMedicalIndicationSchema = z.object({
  indicationDate: requiredDateAllowFuture("fecha de indicación"),
  assignedStaffName: requiredText(200, "El personal asignado"),
  therapyName: requiredText(200, "La terapia"),
  nervousSystemIndications: optionalText(1000, "Las indicaciones del sistema nervioso"),
  decompressSpine: z.boolean(),
  decompressNeck: z.boolean(),
  decompressBack: z.boolean(),
  endocrineNerves: z.boolean(),
  endocrineDefenses: z.boolean(),
  endocrineHormones: z.boolean(),
  cardiovascularReflexologyWith: optionalText(500, "Reflexología cardiovascular con"),
  digestiveColonReflexologyWith: optionalText(500, "Reflexología digestiva/colon con"),
  respiratoryReflexologyWith: optionalText(500, "Reflexología respiratoria con"),
  urinaryReflexologyWithAcidFruits: optionalText(500, "Reflexología urinaria con frutas ácidas"),
  otherIndications: optionalText(2000, "Otras indicaciones"),
  observations: optionalText(2000, "Observaciones"),
});

export type UpdateTreatmentSheetMedicalIndicationFormValues = z.infer<
  typeof updateTreatmentSheetMedicalIndicationSchema
>;

function normalizeOptionalText(value?: string): string | null {
  const normalizedValue = value?.trim();
  return normalizedValue ? normalizedValue : null;
}

export function toCreateTreatmentSheetRequest(
  values: CreateTreatmentSheetFormValues,
): CreateTreatmentSheetRequest {
  return {
    treatmentNumber: normalizeOptionalText(values.treatmentNumber),
    consultationDate: normalizeOptionalText(values.consultationDate),
    epsTreatingDoctorDiagnosis: normalizeOptionalText(values.epsTreatingDoctorDiagnosis),
    referredClinicalHistory: normalizeOptionalText(values.referredClinicalHistory),
  };
}

export function toUpdateTreatmentSheetMedicalIndicationRequest(
  values: UpdateTreatmentSheetMedicalIndicationFormValues,
): UpdateTreatmentSheetMedicalIndicationRequest {
  return {
    indicationDate: normalizeOptionalText(values.indicationDate),
    assignedStaffName: normalizeOptionalText(values.assignedStaffName),
    therapyName: normalizeOptionalText(values.therapyName),
    nervousSystemIndications: normalizeOptionalText(values.nervousSystemIndications),
    decompressSpine: Boolean(values.decompressSpine),
    decompressNeck: Boolean(values.decompressNeck),
    decompressBack: Boolean(values.decompressBack),
    endocrineNerves: Boolean(values.endocrineNerves),
    endocrineDefenses: Boolean(values.endocrineDefenses),
    endocrineHormones: Boolean(values.endocrineHormones),
    cardiovascularReflexologyWith: normalizeOptionalText(values.cardiovascularReflexologyWith),
    digestiveColonReflexologyWith: normalizeOptionalText(
      values.digestiveColonReflexologyWith,
    ),
    respiratoryReflexologyWith: normalizeOptionalText(values.respiratoryReflexologyWith),
    urinaryReflexologyWithAcidFruits: normalizeOptionalText(
      values.urinaryReflexologyWithAcidFruits,
    ),
    otherIndications: normalizeOptionalText(values.otherIndications),
    observations: normalizeOptionalText(values.observations),
  };
}
