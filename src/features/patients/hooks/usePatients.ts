import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { PatientListParams, PatientListResult } from "../types/patient.types";
import { listPatients } from "../api/patients.api";

function normalizePatientsParams(params: PatientListParams): PatientListParams {
  const pageNumber = params.pageNumber ?? 1;
  const pageSize = params.pageSize ?? 10;

  return {
    ...params,
    pageNumber: Math.max(pageNumber, 1),
    pageSize: Math.max(pageSize, 1),
  };
}

export function usePatients(params: PatientListParams = {}) {
  const normalizedParams = useMemo(
    () => normalizePatientsParams(params),
    [params],
  );

  return useQuery<PatientListResult, Error>({
    queryKey: ["patients", normalizedParams],
    queryFn: () => listPatients(normalizedParams),
    placeholderData: (previousData) => previousData,
    staleTime: 30_000,
  });
}
