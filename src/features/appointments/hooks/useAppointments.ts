import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { AppointmentListQueryParams } from "../types/appointment.types";
import { listAppointments } from "../api/appointments.api";

function normalizeParams(params: AppointmentListQueryParams): AppointmentListQueryParams {
  return {
    ...params,
    pageNumber: params.pageNumber ?? 1,
    pageSize: params.pageSize ?? 20,
  };
}

export function useAppointments(params: AppointmentListQueryParams = {}) {
  const normalizedParams = useMemo(() => normalizeParams(params), [params]);

  return useQuery({
    queryKey: ["appointments", normalizedParams],
    queryFn: () => listAppointments(normalizedParams),
    placeholderData: (previousData) => previousData,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
