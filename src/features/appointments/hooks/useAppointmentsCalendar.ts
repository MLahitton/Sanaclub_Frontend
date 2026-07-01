import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { listAppointments } from "../api/appointments.api";

export type AppointmentsCalendarQuery = {
  fromDate?: string;
  toDate?: string;
  includeCancelled: boolean;
};

function normalizeCalendarQuery(query: AppointmentsCalendarQuery): AppointmentsCalendarQuery {
  return {
    fromDate: query.fromDate?.trim() || undefined,
    toDate: query.toDate?.trim() || undefined,
    includeCancelled: query.includeCancelled,
  };
}

export function useAppointmentsCalendar(query: AppointmentsCalendarQuery) {
  const normalizedQuery = useMemo(() => normalizeCalendarQuery(query), [query]);
  const hasDateRange = Boolean(normalizedQuery.fromDate && normalizedQuery.toDate);

  return useQuery({
    queryKey: ["appointments", "calendar", normalizedQuery],
    queryFn: () =>
      listAppointments({
        fromDate: normalizedQuery.fromDate,
        toDate: normalizedQuery.toDate,
        includeCancelled: normalizedQuery.includeCancelled,
        pageNumber: 1,
        pageSize: 200,
      }),
    enabled: hasDateRange,
    placeholderData: (previousData) => previousData,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
