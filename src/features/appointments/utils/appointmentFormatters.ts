import { format, isValid, parseISO } from "date-fns";
import type {
  AppointmentResponse,
  AppointmentStatusKind,
} from "../types/appointment.types";

export type AppointmentClinicalReferenceKind = "treatment" | "evolution" | "other";

export function formatAppointmentDate(dateIso?: string | null): string {
  if (!dateIso?.trim()) {
    return "Sin fecha";
  }

  const date = parseISO(dateIso);
  if (!isValid(date)) {
    return "Sin fecha";
  }

  return format(date, "dd/MM/yyyy");
}

function formatAppointmentDateTime(dateIso?: string | null): string {
  if (!dateIso?.trim()) {
    return "Sin fecha";
  }

  const date = parseISO(dateIso.trim());
  if (!isValid(date)) {
    return "Sin fecha";
  }

  return format(date, "dd/MM/yyyy HH:mm");
}

function normalizeTime(value?: string | null): string | null {
  const normalized = value?.trim();
  if (!normalized) {
    return null;
  }

  return normalized;
}

export function formatAppointmentTime(time?: string | null): string {
  const normalized = normalizeTime(time);
  if (!normalized) {
    return "Sin horario";
  }

  if (/^\d{2}:\d{2}(:\d{2})?$/.test(normalized)) {
    return normalized.length > 5 ? normalized.slice(0, 5) : normalized;
  }

  const asDate = parseISO(normalized);
  if (isValid(asDate)) {
    return format(asDate, "HH:mm");
  }

  return "Sin horario";
}

export function formatAppointmentTimeRange(startTime: string, endTime: string): string {
  const start = formatAppointmentTime(startTime);
  const end = formatAppointmentTime(endTime);

  if (start === "Sin horario" || end === "Sin horario") {
    return "Sin horario";
  }

  return `${start} - ${end}`;
}

export function toTimeInputValue(time?: string | null): string {
  const normalized = time?.trim();

  if (!normalized) {
    return "";
  }

  if (/^\d{2}:\d{2}$/.test(normalized)) {
    return normalized;
  }

  if (/^\d{2}:\d{2}:\d{2}$/.test(normalized)) {
    return normalized.slice(0, 5);
  }

  return "";
}

export function toBackendTimeValue(time?: string | null): string | null {
  const normalized = time?.trim();

  if (!normalized) {
    return null;
  }

  if (/^\d{2}:\d{2}:\d{2}$/.test(normalized)) {
    return normalized;
  }

  if (/^\d{2}:\d{2}$/.test(normalized)) {
    return `${normalized}:00`;
  }

  return null;
}

export function getAppointmentStatusKind(
  appointment: AppointmentResponse,
): AppointmentStatusKind {
  const statusCode = appointment.statusCode?.trim().toUpperCase() ?? "";
  const statusName = appointment.statusName?.trim().toUpperCase() ?? "";

  if (statusCode.includes("CANCEL") || statusName.includes("CANCEL")) {
    return "cancelled";
  }

  if (statusCode.includes("CONFIRM") || statusName.includes("CONFIRM")) {
    return "confirmed";
  }

  if (
    statusCode.includes("SCHED") ||
    statusName.includes("PROGRAM") ||
    statusName.includes("PEND")
  ) {
    return "scheduled";
  }

  return "unknown";
}

export function formatAppointmentStatus(appointment: AppointmentResponse): string {
  return (
    appointment.statusName?.trim() ||
    appointment.statusCode?.trim() ||
    "Sin estado"
  );
}

export function formatOptionalAppointmentText(
  value?: string | null,
  fallback = "Sin registrar",
): string {
  const normalized = value?.trim();
  return normalized ? normalized : fallback;
}

export function isAppointmentCancelled(appointment: AppointmentResponse): boolean {
  return getAppointmentStatusKind(appointment) === "cancelled";
}

export function isAppointmentConfirmed(appointment: AppointmentResponse): boolean {
  return getAppointmentStatusKind(appointment) === "confirmed";
}

export function isAppointmentScheduled(appointment: AppointmentResponse): boolean {
  return getAppointmentStatusKind(appointment) === "scheduled";
}

export function formatClinicalReferenceLabel(appointment: AppointmentResponse): string {
  const rawLabel = appointment.clinicalReferenceLabel?.trim();
  const referenceType = appointment.clinicalReferenceType?.trim().toLowerCase() ?? "";
  const clinicalType = referenceType.includes("evolution")
    ? "Evolución"
    : referenceType.includes("treatment")
      ? "Tratamiento"
      : appointment.clinicalReferenceType?.trim() || "Referencia clínica";

  return rawLabel ? `${clinicalType}: ${rawLabel}` : clinicalType;
}

export function getClinicalReferenceKind(
  appointment: AppointmentResponse,
): AppointmentClinicalReferenceKind {
  const rawType = appointment.clinicalReferenceType?.trim().toLowerCase() ?? "";

  if (
    rawType.includes("treatment") ||
    rawType.includes("treatment_sheet") ||
    rawType.includes("treatmentsheet") ||
    rawType.includes("tratamiento")
  ) {
    return "treatment";
  }

  if (
    rawType.includes("evolution") ||
    rawType.includes("evolution_sheet") ||
    rawType.includes("evolutionsheet") ||
    rawType.includes("evolucion")
  ) {
    return "evolution";
  }

  return "other";
}

export function formatAppointmentCreatedDate(dateIso?: string | null): string {
  return formatAppointmentDateTime(dateIso);
}

export function formatAppointmentUpdatedDate(dateIso?: string | null): string {
  return formatAppointmentDateTime(dateIso);
}

export function formatAppointmentConfirmedDate(dateIso?: string | null): string {
  return formatAppointmentDateTime(dateIso);
}

export function formatAppointmentCancelledDate(dateIso?: string | null): string {
  return formatAppointmentDateTime(dateIso);
}
