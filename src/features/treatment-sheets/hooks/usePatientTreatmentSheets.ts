import { useQuery } from "@tanstack/react-query";
import { listTreatmentSheetsByPatient } from "../api/treatmentSheets.api";

export function usePatientTreatmentSheets(patientId?: string, enabled = true) {
  const normalizedPatientId = patientId?.trim();

  return useQuery({
    queryKey: ["patients", normalizedPatientId, "treatment-sheets"],
    queryFn: () => listTreatmentSheetsByPatient(normalizedPatientId ?? ""),
    enabled: Boolean(normalizedPatientId) && enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
