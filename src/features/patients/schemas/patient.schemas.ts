import { format, isFuture, isValid, parseISO } from "date-fns";
import { z } from "zod";
import type { CreatePatientRequest, PatientResponse, UpdatePatientRequest } from "../types/patient.types";

const requiredText = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} es obligatorio`);

const optionalText = z.string().trim();

const optionalDate = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || isValid(parseISO(value)),
    "La fecha de nacimiento no es valida",
  )
  .refine(
    (value) => value === "" || !isFuture(parseISO(value)),
    "La fecha de nacimiento no puede ser futura",
  );

const optionalEmail = z.string().trim().refine(
  (value) => value === "" || z.string().email("Correo electronico invalido").safeParse(value).success,
  { message: "Correo electronico invalido" },
);

export const createPatientSchema = z.object({
  identificationTypeId: requiredText("El tipo de identificacion"),
  identificationNumber: requiredText("El numero de identificacion"),
  firstName: requiredText("El nombre"),
  lastName: requiredText("El apellido"),
  birthDate: optionalDate,
  genderId: optionalText,
  civilStatusId: optionalText,
  phoneNumber: optionalText,
  email: optionalEmail,
  address: optionalText,
  cityOrMunicipality: optionalText,
  occupation: optionalText,
  emergencyContactName: optionalText,
  emergencyContactRelationship: optionalText,
  emergencyContactPhone: optionalText,
  patientStatusId: requiredText("El estado del paciente"),
});

export const patientFormSchema = createPatientSchema;

export type CreatePatientFormValues = z.infer<typeof patientFormSchema>;

function normalizeString(value?: string): string | null {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue : null;
}

export function toCreatePatientRequest(
  values: CreatePatientFormValues,
): CreatePatientRequest {
  return {
    identificationTypeId: values.identificationTypeId.trim(),
    identificationNumber: values.identificationNumber.trim(),
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    birthDate: normalizeString(values.birthDate),
    genderId: normalizeString(values.genderId),
    civilStatusId: normalizeString(values.civilStatusId),
    phoneNumber: normalizeString(values.phoneNumber),
    email: normalizeString(values.email),
    address: normalizeString(values.address),
    cityOrMunicipality: normalizeString(values.cityOrMunicipality),
    occupation: normalizeString(values.occupation),
    emergencyContactName: normalizeString(values.emergencyContactName),
    emergencyContactRelationship: normalizeString(values.emergencyContactRelationship),
    emergencyContactPhone: normalizeString(values.emergencyContactPhone),
    patientStatusId: values.patientStatusId.trim(),
  };
}

export function toUpdatePatientRequest(
  values: CreatePatientFormValues,
): UpdatePatientRequest {
  return toCreatePatientRequest(values);
}

function toInputDate(dateIso?: string | null): string {
  if (!dateIso?.trim()) {
    return "";
  }

  const parsedDate = parseISO(dateIso);
  if (!isValid(parsedDate)) {
    return dateIso.slice(0, 10);
  }

  return format(parsedDate, "yyyy-MM-dd");
}

function toOptionalTextInput(value?: string | null): string {
  return value?.trim() ?? "";
}

export function toPatientFormValues(patient: PatientResponse): CreatePatientFormValues {
  return {
    identificationTypeId: patient.identificationTypeId.trim(),
    identificationNumber: patient.identificationNumber.trim(),
    firstName: patient.firstName.trim(),
    lastName: patient.lastName.trim(),
    birthDate: toInputDate(patient.birthDate ?? null),
    genderId: toOptionalTextInput(patient.genderId),
    civilStatusId: toOptionalTextInput(patient.civilStatusId),
    phoneNumber: toOptionalTextInput(patient.phoneNumber),
    email: toOptionalTextInput(patient.email),
    address: toOptionalTextInput(patient.address),
    cityOrMunicipality: toOptionalTextInput(patient.cityOrMunicipality),
    occupation: toOptionalTextInput(patient.occupation),
    emergencyContactName: toOptionalTextInput(patient.emergencyContactName),
    emergencyContactRelationship: toOptionalTextInput(patient.emergencyContactRelationship),
    emergencyContactPhone: toOptionalTextInput(patient.emergencyContactPhone),
    patientStatusId: patient.patientStatusId.trim(),
  };
}
