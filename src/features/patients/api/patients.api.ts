import { apiClient } from "../../../shared/api/apiClient";
import type {
  PatientResponse,
  CreatePatientRequest,
  UpdatePatientRequest,
  PatientFormOptionsResponse,
  PatientListParams,
  PatientListResult,
} from "../types/patient.types";

export async function listPatients(
  params: PatientListParams = {},
): Promise<PatientListResult> {
  const query = new URLSearchParams();

  const search = params.search?.trim();
  if (search) {
    query.set("search", search);
  }

  if (params.isActive !== undefined) {
    query.set("isActive", String(params.isActive));
  }

  if (params.patientStatusId) {
    query.set("patientStatusId", params.patientStatusId);
  }

  if (params.pageNumber !== undefined) {
    query.set("pageNumber", String(params.pageNumber));
  }

  if (params.pageSize !== undefined) {
    query.set("pageSize", String(params.pageSize));
  }

  const queryString = query.toString();
  const url = queryString ? `/api/v1/patients?${queryString}` : "/api/v1/patients";

  const response = await apiClient.get<PatientListResult>(url);
  return response.data;
}

export async function getPatientFormOptions(): Promise<PatientFormOptionsResponse> {
  const response = await apiClient.get<PatientFormOptionsResponse>(
    "/api/v1/catalogs/patient-form-options",
  );
  return response.data;
}

function removeEmptyValues<T extends Record<string, unknown>>(payload: T): T {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(payload)) {
    if (typeof value === "string" && value.trim() === "") {
      continue;
    }

    if (value !== undefined) {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
}

export async function createPatient(
  request: CreatePatientRequest,
): Promise<PatientResponse> {
  const payload = removeEmptyValues({
    identificationTypeId: request.identificationTypeId.trim(),
    identificationNumber: request.identificationNumber.trim(),
    firstName: request.firstName.trim(),
    lastName: request.lastName.trim(),
    birthDate: request.birthDate ?? null,
    genderId: request.genderId ?? null,
    civilStatusId: request.civilStatusId ?? null,
    phoneNumber: request.phoneNumber ?? null,
    email: request.email ?? null,
    address: request.address ?? null,
    cityOrMunicipality: request.cityOrMunicipality ?? null,
    occupation: request.occupation ?? null,
    emergencyContactName: request.emergencyContactName ?? null,
    emergencyContactRelationship: request.emergencyContactRelationship ?? null,
    emergencyContactPhone: request.emergencyContactPhone ?? null,
    patientStatusId: request.patientStatusId.trim(),
  });

  const response = await apiClient.post<PatientResponse>(
    "/api/v1/patients",
    payload,
  );
  return response.data;
}

export async function updatePatient(
  patientId: string,
  request: UpdatePatientRequest,
): Promise<PatientResponse> {
  const normalizedPatientId = patientId.trim();

  if (!normalizedPatientId) {
    throw new Error("El identificador del paciente es requerido.");
  }

  const payload = removeEmptyValues({
    identificationTypeId: request.identificationTypeId.trim(),
    identificationNumber: request.identificationNumber.trim(),
    firstName: request.firstName.trim(),
    lastName: request.lastName.trim(),
    birthDate: request.birthDate ?? null,
    genderId: request.genderId ?? null,
    civilStatusId: request.civilStatusId ?? null,
    phoneNumber: request.phoneNumber ?? null,
    email: request.email ?? null,
    address: request.address ?? null,
    cityOrMunicipality: request.cityOrMunicipality ?? null,
    occupation: request.occupation ?? null,
    emergencyContactName: request.emergencyContactName ?? null,
    emergencyContactRelationship: request.emergencyContactRelationship ?? null,
    emergencyContactPhone: request.emergencyContactPhone ?? null,
    patientStatusId: request.patientStatusId.trim(),
  });

  const response = await apiClient.put<PatientResponse>(
    `/api/v1/patients/${encodeURIComponent(normalizedPatientId)}`,
    payload,
  );
  return response.data;
}

export async function archivePatient(patientId: string): Promise<PatientResponse> {
  const normalizedPatientId = patientId.trim();

  if (!normalizedPatientId) {
    throw new Error("El identificador del paciente es requerido.");
  }

  const response = await apiClient.post<PatientResponse>(
    `/api/v1/patients/${encodeURIComponent(normalizedPatientId)}/archive`,
  );
  return response.data;
}

export async function getPatientById(patientId: string): Promise<PatientResponse> {
  const normalizedPatientId = patientId.trim();

  if (!normalizedPatientId) {
    throw new Error("El identificador del paciente es requerido.");
  }

  const response = await apiClient.get<PatientResponse>(
    `/api/v1/patients/${encodeURIComponent(normalizedPatientId)}`,
  );
  return response.data;
}
