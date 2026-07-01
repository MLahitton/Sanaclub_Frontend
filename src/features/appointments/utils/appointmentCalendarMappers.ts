import type { AppointmentResponse } from "../types/appointment.types";
import {
  formatAppointmentStatus,
  formatAppointmentTime,
  getAppointmentStatusKind,
} from "./appointmentFormatters";

function normalizeEventTime(value?: string | null): string | null {
  const normalized = value?.trim();

  if (!normalized) {
    return null;
  }

  if (/^\d{2}:\d{2}$/.test(normalized)) {
    return `${normalized}:00`;
  }

  if (/^\d{2}:\d{2}:\d{2}$/.test(normalized)) {
    return normalized;
  }

  return normalized;
}

export type AppointmentCalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  classNames: string[];
  extendedProps: {
    appointment: AppointmentResponse;
    statusCode: string;
    statusName: string;
    statusLabel: string;
    patientFullName: string;
    therapistFullName: string;
    clinicalReferenceLabel: string;
  };
};

export function getCalendarEventStatusClass(appointment: AppointmentResponse): string {
  const statusKind = getAppointmentStatusKind(appointment);

  if (statusKind === "confirmed") {
    return "sanaclub-calendar-event--confirmed";
  }

  if (statusKind === "cancelled") {
    return "sanaclub-calendar-event--cancelled";
  }

  return "sanaclub-calendar-event--scheduled";
}

export function getCalendarEventStatusLabel(appointment: AppointmentResponse): string {
  const statusKind = getAppointmentStatusKind(appointment);

  if (statusKind === "confirmed") {
    return "Confirmada";
  }

  if (statusKind === "cancelled") {
    return "Cancelada";
  }

  if (statusKind === "scheduled") {
    return "Programada";
  }

  return formatAppointmentStatus(appointment);
}

export function toCalendarEvent(appointment: AppointmentResponse): AppointmentCalendarEvent {
  const startTime = normalizeEventTime(appointment.startTime);
  const endTime = normalizeEventTime(appointment.endTime) ?? startTime;
  const start = startTime ? `${appointment.appointmentDate}T${startTime}` : appointment.appointmentDate;
  const end = endTime ? `${appointment.appointmentDate}T${endTime}` : start;
  const statusLabel = getCalendarEventStatusLabel(appointment);
  const timeLabel = formatAppointmentTime(appointment.startTime);

  return {
    id: appointment.id,
    title: `${timeLabel} · ${appointment.patientFullName} · ${statusLabel}`,
    start,
    end,
    allDay: false,
    classNames: [getCalendarEventStatusClass(appointment)],
    extendedProps: {
      appointment,
      statusCode: appointment.statusCode,
      statusName: appointment.statusName,
      statusLabel,
      patientFullName: appointment.patientFullName,
      therapistFullName: appointment.therapistFullName,
      clinicalReferenceLabel: appointment.clinicalReferenceLabel,
    },
  };
}
