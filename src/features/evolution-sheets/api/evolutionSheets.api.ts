import { apiClient } from "../../../shared/api/apiClient";
import type {
  CreateEvolutionSheetRequest,
  CompleteEvolutionSheetNewIndicationsRequest,
  EvolutionSheetResponse,
} from "../types/evolutionSheet.types";

export async function listEvolutionSheetsByPatient(
  patientId: string,
): Promise<EvolutionSheetResponse[]> {
  const normalizedPatientId = patientId.trim();

  if (!normalizedPatientId) {
    throw new Error("El identificador del paciente es requerido.");
  }

  const response = await apiClient.get<EvolutionSheetResponse[]>(
    `/api/v1/patients/${encodeURIComponent(normalizedPatientId)}/evolution-sheets`,
  );

  return response.data;
}

function normalizeOptionalText(value?: string | null): string | null {
  const normalizedValue = value?.trim();
  return normalizedValue || null;
}

export async function createEvolutionSheet(
  patientId: string,
  request: CreateEvolutionSheetRequest,
): Promise<EvolutionSheetResponse> {
  const normalizedPatientId = patientId.trim();

  if (!normalizedPatientId) {
    throw new Error("El identificador del paciente es requerido.");
  }

  const payload: CreateEvolutionSheetRequest = {
    treatmentSheetId: request.treatmentSheetId.trim(),
    therapyNumber: normalizeOptionalText(request.therapyNumber),
    evolutionDate: normalizeOptionalText(request.evolutionDate),
    entryTime: request.entryTime ?? null,
    exitTime: request.exitTime ?? null,
    assignedStaffName: request.assignedStaffName?.trim(),
    therapyName: request.therapyName?.trim(),
    evolutionNotes: request.evolutionNotes.trim(),
  };

  const response = await apiClient.post<EvolutionSheetResponse>(
    `/api/v1/patients/${encodeURIComponent(normalizedPatientId)}/evolution-sheets`,
    payload,
  );

  return response.data;
}

export async function getEvolutionSheetById(
  evolutionSheetId: string,
): Promise<EvolutionSheetResponse> {
  const normalizedEvolutionSheetId = evolutionSheetId.trim();

  if (!normalizedEvolutionSheetId) {
    throw new Error("El identificador de la hoja de evolución es requerido.");
  }

  const response = await apiClient.get<EvolutionSheetResponse>(
    `/api/v1/evolution-sheets/${encodeURIComponent(normalizedEvolutionSheetId)}`,
  );

  return response.data;
}

export async function completeEvolutionSheetNewIndications(
  evolutionSheetId: string,
  request: CompleteEvolutionSheetNewIndicationsRequest,
): Promise<EvolutionSheetResponse> {
  const normalizedEvolutionSheetId = evolutionSheetId.trim();

  if (!normalizedEvolutionSheetId) {
    throw new Error("El identificador de la hoja de evolución es requerido.");
  }

  const response = await apiClient.put<EvolutionSheetResponse>(
    `/api/v1/evolution-sheets/${encodeURIComponent(normalizedEvolutionSheetId)}/new-indications`,
    request,
  );

  return response.data;
}
