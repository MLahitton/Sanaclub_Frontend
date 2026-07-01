import { isValid, parseISO } from "date-fns";
import { z } from "zod";
import type { CreateEvolutionSheetRequest } from "../types/evolutionSheet.types";
import type { CompleteEvolutionSheetNewIndicationsRequest } from "../types/evolutionSheet.types";

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
      `${label} no tiene un formato válido`,
    );

export const createEvolutionSheetSchema = z.object({
  treatmentSheetId: requiredText(200, "La hoja de tratamiento base"),
  therapyNumber: optionalText(50, "El número de terapia"),
  evolutionDate: optionalDate("La fecha de evolución"),
  assignedStaffName: requiredText(200, "La personal asignado"),
  therapyName: requiredText(200, "La terapia"),
  evolutionNotes: requiredText(4000, "Las notas de evolución"),
});

export type CreateEvolutionSheetFormValues = z.infer<
  typeof createEvolutionSheetSchema
>;

export const completeEvolutionSheetNewIndicationsSchema = z.object({
  newIndications: requiredText(4000, "Las nuevas indicaciones"),
});

export type CompleteEvolutionSheetNewIndicationsFormValues = z.infer<
  typeof completeEvolutionSheetNewIndicationsSchema
>;

function normalizeOptionalText(value?: string): string | null {
  const normalizedValue = value?.trim();
  return normalizedValue || null;
}

export function toCreateEvolutionSheetRequest(
  values: CreateEvolutionSheetFormValues,
): CreateEvolutionSheetRequest {
  return {
    treatmentSheetId: values.treatmentSheetId.trim(),
    therapyNumber: normalizeOptionalText(values.therapyNumber),
    evolutionDate: normalizeOptionalText(values.evolutionDate),
    entryTime: null,
    exitTime: null,
    assignedStaffName: values.assignedStaffName.trim(),
    therapyName: values.therapyName.trim(),
    evolutionNotes: values.evolutionNotes.trim(),
  };
}

function normalizeRequiredText(value: string): string {
  const normalizedValue = value.trim();
  return normalizedValue;
}

export function toCompleteEvolutionSheetNewIndicationsRequest(
  values: CompleteEvolutionSheetNewIndicationsFormValues,
): CompleteEvolutionSheetNewIndicationsRequest {
  return {
    newIndications: normalizeRequiredText(values.newIndications),
  };
}
