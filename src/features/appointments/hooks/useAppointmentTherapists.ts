import { useQuery } from "@tanstack/react-query";
import { listAppointmentTherapists } from "../api/appointments.api";
import type { AppointmentTherapistResponse } from "../types/appointment.types";

type UseAppointmentTherapistsOptions = {
  enabled?: boolean;
};

export function useAppointmentTherapists(options: UseAppointmentTherapistsOptions = {}) {
  const enabled = options.enabled ?? true;

  return useQuery<AppointmentTherapistResponse[]>({
    queryKey: ["appointments", "therapists"],
    queryFn: listAppointmentTherapists,
    enabled,
    refetchOnWindowFocus: false,
    staleTime: 60_000,
    placeholderData: (previousData) => previousData,
  });
}
