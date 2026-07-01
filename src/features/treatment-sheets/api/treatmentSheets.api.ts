import { apiClient } from "../../../shared/api/apiClient";
import type {
  CreateTreatmentSheetRequest,
  UpdateTreatmentSheetMedicalIndicationRequest,
  TreatmentSheetResponse,
} from "../types/treatmentSheet.types";

function normalizeOptionalText(value?: string | null): string | null {
  const normalizedValue = value?.trim();
  return normalizedValue || null;
}

export async function listTreatmentSheetsByPatient(
  patientId: string,
): Promise<TreatmentSheetResponse[]> {
  const normalizedPatientId = patientId.trim();

  if (!normalizedPatientId) {
    throw new Error("El identificador del paciente es requerido.");
  }

  const response = await apiClient.get<TreatmentSheetResponse[]>(
    `/api/v1/patients/${encodeURIComponent(normalizedPatientId)}/treatment-sheets`,
  );

  return response.data;
}

export async function createTreatmentSheet(
  patientId: string,
  request: CreateTreatmentSheetRequest,
): Promise<TreatmentSheetResponse> {
  const normalizedPatientId = patientId.trim();

  if (!normalizedPatientId) {
    throw new Error("El identificador del paciente es requerido.");
  }

  const payload: CreateTreatmentSheetRequest = {
    treatmentNumber: normalizeOptionalText(request.treatmentNumber),
    consultationDate: normalizeOptionalText(request.consultationDate),
    epsTreatingDoctorDiagnosis: normalizeOptionalText(
      request.epsTreatingDoctorDiagnosis,
    ),
    referredClinicalHistory: normalizeOptionalText(request.referredClinicalHistory),
  };

  const response = await apiClient.post<TreatmentSheetResponse>(
    `/api/v1/patients/${encodeURIComponent(normalizedPatientId)}/treatment-sheets`,
    payload,
  );

  return response.data;
}

export async function getTreatmentSheetById(
  treatmentSheetId: string,
): Promise<TreatmentSheetResponse> {
  const normalizedTreatmentSheetId = treatmentSheetId.trim();

  if (!normalizedTreatmentSheetId) {
    throw new Error("El identificador de la hoja de tratamiento es requerido.");
  }

  const response = await apiClient.get<TreatmentSheetResponse>(
    `/api/v1/treatment-sheets/${encodeURIComponent(normalizedTreatmentSheetId)}`,
  );

  return response.data;
}

export async function updateTreatmentSheetMedicalIndication(
  treatmentSheetId: string,
  request: UpdateTreatmentSheetMedicalIndicationRequest,
): Promise<TreatmentSheetResponse> {
  const normalizedTreatmentSheetId = treatmentSheetId.trim();

  if (!normalizedTreatmentSheetId) {
    throw new Error("El identificador de la hoja de tratamiento es requerido.");
  }

  const response = await apiClient.put<TreatmentSheetResponse>(
    `/api/v1/treatment-sheets/${encodeURIComponent(normalizedTreatmentSheetId)}/medical-indication`,
    request,
  );

  return response.data;
}
