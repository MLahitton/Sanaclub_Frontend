import { apiClient } from "../../../shared/api/apiClient";
import type {
  AppointmentListQueryParams,
  CreateAppointmentRequest,
  CancelAppointmentRequest,
  UpdateAppointmentRequest,
  AppointmentTherapistResponse,
  AppointmentResponse,
  AppointmentsListResult,
} from "../types/appointment.types";

function normalizeAppointmentsQueryParams(
  params: AppointmentListQueryParams,
): AppointmentListQueryParams {
  const pageNumber = params.pageNumber ?? 1;
  const pageSize = params.pageSize ?? 20;

  return {
    date: params.date?.trim() || undefined,
    fromDate: params.fromDate?.trim() || undefined,
    toDate: params.toDate?.trim() || undefined,
    therapistUserId: params.therapistUserId?.trim() || undefined,
    patientId: params.patientId?.trim() || undefined,
    clinicalReferenceType: params.clinicalReferenceType?.trim() || undefined,
    clinicalReferenceId: params.clinicalReferenceId?.trim() || undefined,
    status: params.status?.trim() || undefined,
    includeCancelled:
      typeof params.includeCancelled === "undefined" ? false : params.includeCancelled,
    pageNumber: pageNumber > 0 ? pageNumber : 1,
    pageSize: pageSize > 0 ? pageSize : 20,
  };
}

export async function listAppointments(
  params: AppointmentListQueryParams = {},
): Promise<AppointmentsListResult> {
  const normalizedParams = normalizeAppointmentsQueryParams(params);

  const response = await apiClient.get<AppointmentsListResult>("/api/v1/appointments", {
    params: normalizedParams,
  });

  return response.data;
}

export async function listAppointmentTherapists(): Promise<AppointmentTherapistResponse[]> {
  const response = await apiClient.get<AppointmentTherapistResponse[]>(
    "/api/v1/appointments/therapists",
  );
  return response.data;
}

export async function createAppointment(
  request: CreateAppointmentRequest,
): Promise<AppointmentResponse> {
  const response = await apiClient.post<AppointmentResponse>("/api/v1/appointments", request);
  return response.data;
}

export async function updateAppointment(
  appointmentId: string,
  request: UpdateAppointmentRequest,
): Promise<AppointmentResponse> {
  const normalizedAppointmentId = appointmentId?.trim();

  if (!normalizedAppointmentId) {
    throw new Error("El ID de la cita es obligatorio.");
  }

  const response = await apiClient.put<AppointmentResponse>(
    `/api/v1/appointments/${encodeURIComponent(normalizedAppointmentId)}`,
    request,
  );
  return response.data;
}

export async function getAppointmentById(appointmentId: string): Promise<AppointmentResponse> {
  const normalizedAppointmentId = appointmentId?.trim();

  if (!normalizedAppointmentId) {
    throw new Error("El ID de la cita es obligatorio.");
  }

  const response = await apiClient.get<AppointmentResponse>(
    `/api/v1/appointments/${encodeURIComponent(normalizedAppointmentId)}`,
  );
  return response.data;
}

export async function confirmAppointment(appointmentId: string): Promise<AppointmentResponse> {
  const normalizedAppointmentId = appointmentId?.trim();

  if (!normalizedAppointmentId) {
    throw new Error("El ID de la cita es obligatorio.");
  }

  const response = await apiClient.post<AppointmentResponse>(
    `/api/v1/appointments/${encodeURIComponent(normalizedAppointmentId)}/confirm`,
  );
  return response.data;
}

export async function cancelAppointment(
  appointmentId: string,
  request: CancelAppointmentRequest,
): Promise<AppointmentResponse> {
  const normalizedAppointmentId = appointmentId?.trim();

  if (!normalizedAppointmentId) {
    throw new Error("El ID de la cita es obligatorio.");
  }

  const response = await apiClient.post<AppointmentResponse>(
    `/api/v1/appointments/${encodeURIComponent(normalizedAppointmentId)}/cancel`,
    request,
  );
  return response.data;
}
