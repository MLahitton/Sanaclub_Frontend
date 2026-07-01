import type { PaginatedResult } from "../../../shared/types/api.types";

export type AppointmentResponse = {
  id: string;
  patientId: string;
  patientFullName: string;
  patientIdentificationNumber: string;
  treatmentSheetId: string;
  treatmentNumber?: string | null;
  clinicalReferenceType: string;
  clinicalReferenceId: string;
  clinicalReferenceLabel: string;
  therapistUserId: string;
  therapistFullName: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  appointmentStatusId: string;
  statusCode: string;
  statusName: string;
  notes?: string | null;
  scheduledByUserId: string;
  confirmedAtUtc?: string | null;
  confirmedByUserId?: string | null;
  cancelledAtUtc?: string | null;
  cancelledByUserId?: string | null;
  isActive: boolean;
  createdAtUtc: string;
  updatedAtUtc?: string | null;
};

export type AppointmentListQueryParams = {
  date?: string | null;
  fromDate?: string | null;
  toDate?: string | null;
  therapistUserId?: string | null;
  patientId?: string | null;
  clinicalReferenceType?: string | null;
  clinicalReferenceId?: string | null;
  status?: string | null;
  includeCancelled?: boolean;
  pageNumber?: number;
  pageSize?: number;
};

export type AppointmentStatusKind =
  | "scheduled"
  | "confirmed"
  | "cancelled"
  | "unknown";

export type CreateAppointmentRequest = {
  patientId: string;
  therapistUserId: string;
  appointmentDate?: string | null;
  startTime?: string | null;
  notes?: string | null;
};

export type UpdateAppointmentRequest = {
  therapistUserId: string;
  appointmentDate?: string | null;
  startTime?: string | null;
  notes?: string | null;
};

export type CancelAppointmentRequest = {
  notes?: string | null;
};

export type AppointmentTherapistResponse = {
  id: string;
  fullName: string;
  email: string;
};

export type AppointmentsListResult = PaginatedResult<AppointmentResponse>;
