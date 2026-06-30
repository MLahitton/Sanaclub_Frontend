import { useQuery } from "@tanstack/react-query";
import { getTreatmentSheetById } from "../api/treatmentSheets.api";
import type { TreatmentSheetResponse } from "../types/treatmentSheet.types";

export function useTreatmentSheet(treatmentSheetId?: string) {
  const normalizedTreatmentSheetId = treatmentSheetId?.trim();

  return useQuery<TreatmentSheetResponse, Error>({
    queryKey: ["treatment-sheets", normalizedTreatmentSheetId],
    queryFn: () => getTreatmentSheetById(normalizedTreatmentSheetId ?? ""),
    enabled: Boolean(normalizedTreatmentSheetId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
