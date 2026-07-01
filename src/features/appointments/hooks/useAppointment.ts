import { useQuery } from "@tanstack/react-query";
import { getAppointmentById } from "../api/appointments.api";
import type { AppointmentResponse } from "../types/appointment.types";

export function useAppointment(appointmentId?: string) {
  const normalizedAppointmentId = appointmentId?.trim();

  return useQuery<AppointmentResponse, Error>({
    queryKey: ["appointments", normalizedAppointmentId],
    queryFn: () => getAppointmentById(normalizedAppointmentId ?? ""),
    enabled: Boolean(normalizedAppointmentId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

