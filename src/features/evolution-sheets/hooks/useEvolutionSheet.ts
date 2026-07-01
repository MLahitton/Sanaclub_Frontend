import { useQuery } from "@tanstack/react-query";
import { getEvolutionSheetById } from "../api/evolutionSheets.api";
import type { EvolutionSheetResponse } from "../types/evolutionSheet.types";

export function useEvolutionSheet(evolutionSheetId?: string) {
  const normalizedEvolutionSheetId = evolutionSheetId?.trim();

  return useQuery<EvolutionSheetResponse, Error>({
    queryKey: ["evolution-sheets", normalizedEvolutionSheetId],
    queryFn: () => getEvolutionSheetById(normalizedEvolutionSheetId ?? ""),
    enabled: Boolean(normalizedEvolutionSheetId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
