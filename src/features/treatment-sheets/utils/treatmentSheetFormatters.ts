import { format, isValid, parseISO } from "date-fns";
import type { TreatmentSheetResponse } from "../types/treatmentSheet.types";

export function formatTreatmentNumber(
  treatmentNumber?: string | null,
): string {
  return treatmentNumber?.trim() || "Sin número";
}

export function formatTreatmentDate(dateIso?: string | null): string {
  if (!dateIso?.trim()) {
    return "Sin fecha";
  }

  const date = parseISO(dateIso);
  if (!isValid(date)) {
    return "Sin fecha";
  }

  return format(date, "dd/MM/yyyy");
}

export function formatTreatmentCreatedDate(dateIso?: string | null): string {
  if (!dateIso?.trim()) {
    return "Sin fecha de registro";
  }

  const date = parseISO(dateIso);
  if (!isValid(date)) {
    return "Sin fecha de registro";
  }

  return format(date, "dd/MM/yyyy");
}

export function formatTreatmentUpdatedDate(dateIso?: string | null): string {
  if (!dateIso?.trim()) {
    return "Sin fecha de actualización";
  }

  const date = parseISO(dateIso);
  if (!isValid(date)) {
    return "Sin fecha de actualización";
  }

  return format(date, "dd/MM/yyyy");
}

export function isTreatmentApproved(sheet: TreatmentSheetResponse): boolean {
  return sheet.approvedAtUtc?.trim() ? true : false;
}

export function isTreatmentDraft(sheet: TreatmentSheetResponse): boolean {
  return !isTreatmentApproved(sheet);
}

export function formatTreatmentStatus(sheet: TreatmentSheetResponse): string {
  return isTreatmentApproved(sheet) ? "Aprobada" : "Pendiente";
}

export function formatOptionalTreatmentText(
  value?: string | null,
  fallback = "Sin registrar",
): string {
  const normalized = value?.trim();
  return normalized ? normalized : fallback;
}

export function formatTreatmentTime(value?: string | null): string {
  const normalized = value?.trim();
  if (!normalized) {
    return "Sin registro";
  }

  if (/^\d{2}:\d{2}(:\d{2})?$/.test(normalized)) {
    return normalized.length > 5 ? normalized.slice(0, 5) : normalized;
  }

  return normalized;
}
