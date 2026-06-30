import { useQuery } from "@tanstack/react-query";
import { getPatientFormOptions } from "../api/patients.api";
import type { PatientFormOptionsResponse } from "../types/patient.types";

export function usePatientFormOptions() {
  return useQuery<PatientFormOptionsResponse, Error>({
    queryKey: ["patients", "form-options"],
    queryFn: getPatientFormOptions,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
