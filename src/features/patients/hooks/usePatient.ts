import { useQuery } from "@tanstack/react-query";
import type { PatientResponse } from "../types/patient.types";
import { getPatientById } from "../api/patients.api";

export function usePatient(patientId?: string) {
  const normalizedPatientId = patientId?.trim();
  
  return useQuery<PatientResponse, Error>({
    queryKey: ["patients", "detail", normalizedPatientId],
    queryFn: () => getPatientById(normalizedPatientId ?? ""),
    enabled: Boolean(normalizedPatientId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

