import { format, isValid, parseISO } from "date-fns";
import type { EvolutionSheetResponse } from "../types/evolutionSheet.types";

export function formatEvolutionNumber(
  therapyNumber?: string | null,
): string {
  return therapyNumber?.trim() || "Sin número";
}

export function formatEvolutionDate(dateIso?: string | null): string {
  if (!dateIso?.trim()) {
    return "Sin fecha";
  }

  const date = parseISO(dateIso);
  if (!isValid(date)) {
    return "Sin fecha";
  }

  return format(date, "dd/MM/yyyy");
}

export function formatEvolutionCreatedDate(dateIso?: string | null): string {
  if (!dateIso?.trim()) {
    return "Sin fecha de registro";
  }

  const date = parseISO(dateIso);
  if (!isValid(date)) {
    return "Sin fecha de registro";
  }

  return format(date, "dd/MM/yyyy");
}

export function formatEvolutionUpdatedDate(dateIso?: string | null): string {
  if (!dateIso?.trim()) {
    return "Sin fecha de actualización";
  }

  const date = parseISO(dateIso);
  if (!isValid(date)) {
    return "Sin fecha de actualización";
  }

  return format(date, "dd/MM/yyyy");
}

export function formatEvolutionCompletedDate(dateIso?: string | null): string {
  if (!dateIso?.trim()) {
    return "Sin completar";
  }

  const date = parseISO(dateIso);
  if (!isValid(date)) {
    return "Sin completar";
  }

  return format(date, "dd/MM/yyyy");
}

export function isEvolutionCompleted(sheet: EvolutionSheetResponse): boolean {
  return Boolean(sheet.completedAtUtc?.trim());
}

export function isEvolutionPending(sheet: EvolutionSheetResponse): boolean {
  return !isEvolutionCompleted(sheet);
}

export function formatEvolutionStatus(sheet: EvolutionSheetResponse): string {
  return isEvolutionCompleted(sheet) ? "Completada" : "Pendiente";
}

export function formatOptionalEvolutionText(
  value?: string | null,
  fallback = "Sin registrar",
): string {
  const normalized = value?.trim();
  return normalized ? normalized : fallback;
}
