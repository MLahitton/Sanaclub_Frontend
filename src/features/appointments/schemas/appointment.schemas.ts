import { isBefore, isValid, parseISO, startOfToday } from "date-fns";
import { z } from "zod";
import type {
  CreateAppointmentRequest,
  CancelAppointmentRequest,
  UpdateAppointmentRequest,
} from "../types/appointment.types";
import { toBackendTimeValue } from "../utils/appointmentFormatters";

const requiredText = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} es obligatorio.`)
    .max(200, `${label} no puede tener más de 200 caracteres.`);

const appointmentDateSchema = z
  .string()
  .trim()
  .min(1, "La fecha de cita es obligatoria.")
  .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha de cita debe tener formato YYYY-MM-DD.")
  .refine((value) => {
    const parsedDate = parseISO(value);
    return isValid(parsedDate) && !isBefore(parsedDate, startOfToday());
  }, "La fecha de cita no puede ser anterior a la fecha actual.");

const startTimeSchema = z
  .string()
  .trim()
  .min(1, "La hora de inicio es obligatoria.")
  .regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, "La hora de inicio debe tener formato HH:mm.");

export const createAppointmentSchema = z.object({
  patientId: requiredText("El paciente"),
  therapistUserId: requiredText("El terapeuta"),
  appointmentDate: appointmentDateSchema,
  startTime: startTimeSchema,
  notes: z
    .string()
    .trim()
    .max(1000, "Las notas no pueden tener más de 1000 caracteres.")
    .optional(),
});

export type CreateAppointmentFormValues = z.infer<typeof createAppointmentSchema>;

export const updateAppointmentSchema = z.object({
  therapistUserId: requiredText("El terapeuta"),
  appointmentDate: appointmentDateSchema,
  startTime: startTimeSchema,
  notes: z
    .string()
    .trim()
    .max(1000, "Las notas no pueden tener más de 1000 caracteres.")
    .optional(),
});

export type UpdateAppointmentFormValues = z.infer<typeof updateAppointmentSchema>;

export const cancelAppointmentSchema = z.object({
  notes: z
    .string()
    .trim()
    .max(1000, "Las notas de cancelación no pueden tener más de 1000 caracteres.")
    .optional(),
});

export type CancelAppointmentFormValues = z.infer<typeof cancelAppointmentSchema>;

function normalizeOptionalText(value?: string): string | null {
  const normalized = value?.trim();
  return normalized || null;
}

export function toCreateAppointmentRequest(
  values: CreateAppointmentFormValues,
): CreateAppointmentRequest {
  const backendStartTime = toBackendTimeValue(values.startTime);

  return {
    patientId: values.patientId.trim(),
    therapistUserId: values.therapistUserId.trim(),
    appointmentDate: values.appointmentDate.trim(),
    startTime: backendStartTime ?? `${values.startTime.trim()}:00`,
    notes: normalizeOptionalText(values.notes),
  };
}

export function toUpdateAppointmentRequest(
  values: UpdateAppointmentFormValues,
): UpdateAppointmentRequest {
  const backendStartTime = toBackendTimeValue(values.startTime);

  return {
    therapistUserId: values.therapistUserId.trim(),
    appointmentDate: values.appointmentDate.trim(),
    startTime: backendStartTime ?? `${values.startTime.trim()}:00`,
    notes: normalizeOptionalText(values.notes),
  };
}

export function toCancelAppointmentRequest(
  values: CancelAppointmentFormValues,
): CancelAppointmentRequest {
  return {
    notes: normalizeOptionalText(values.notes),
  };
}
