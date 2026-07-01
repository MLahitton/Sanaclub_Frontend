import { useQuery } from "@tanstack/react-query";
import { listEvolutionSheetsByPatient } from "../api/evolutionSheets.api";

export function usePatientEvolutionSheets(
  patientId?: string,
  enabled = true,
) {
  const normalizedPatientId = patientId?.trim();

  return useQuery({
    queryKey: ["patients", normalizedPatientId, "evolution-sheets"],
    queryFn: () => listEvolutionSheetsByPatient(normalizedPatientId ?? ""),
    enabled: Boolean(normalizedPatientId) && enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

