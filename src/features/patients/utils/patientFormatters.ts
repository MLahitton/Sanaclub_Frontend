import { differenceInYears, format, isValid, parseISO } from "date-fns";
import type {
  CatalogItemResponse,
  PatientResponse,
} from "../types/patient.types";

export function formatPatientFullName(patient: PatientResponse): string {
  if (patient.fullName?.trim()) {
    return patient.fullName.trim();
  }

  const firstName = patient.firstName?.trim() ?? "";
  const lastName = patient.lastName?.trim() ?? "";
  const fallback = `${firstName} ${lastName}`.trim();

  return fallback || "Paciente sin nombre";
}

export function getPatientDisplayName(patient: PatientResponse): string {
  return formatPatientFullName(patient);
}

export function getPhoneDisplay(phoneNumber?: string | null): string {
  return formatOptionalText(phoneNumber, "Sin teléfono");
}

export function getEmailDisplay(email?: string | null): string {
  return formatOptionalText(email, "Sin correo");
}

export function getCityDisplay(cityOrMunicipality?: string | null): string {
  return formatOptionalText(cityOrMunicipality);
}

export function formatOptionalText(
  value?: string | null,
  fallback = "Sin registrar",
): string {
  const normalized = value?.trim();
  return normalized ? normalized : fallback;
}

export function formatPatientCreatedDate(dateIso?: string | null): string {
  if (!dateIso?.trim()) return "Sin registrar";

  const date = parseISO(dateIso);
  if (!isValid(date)) return "Sin registrar";

  return format(date, "dd/MM/yyyy");
}

export function formatPatientCreatedAt(dateIso?: string | null): string {
  return formatPatientCreatedDate(dateIso);
}

export function formatPatientBirthDate(dateIso?: string | null): string {
  if (!dateIso?.trim()) return "Sin registrar";

  const date = parseISO(dateIso);
  if (!isValid(date) || date > new Date()) return "Sin registrar";

  return format(date, "dd/MM/yyyy");
}

export function calculateAgeFromBirthDate(dateIso?: string | null): string {
  if (!dateIso?.trim()) return "Sin registrar";

  const date = parseISO(dateIso);
  if (!isValid(date) || date > new Date()) return "Sin registrar";

  return `${differenceInYears(new Date(), date)} años`;
}

export function resolveCatalogName(
  items: CatalogItemResponse[] | undefined,
  id: string | null | undefined,
  fallback = "No disponible",
): string {
  if (!id?.trim()) {
    return "Sin registrar";
  }

  const item = items?.find((option) => option.id.toLowerCase() === id.toLowerCase());

  return item?.name?.trim() || fallback;
}
