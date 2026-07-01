import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiErrorResponse } from "../../../shared/types/api.types";
import type {
  CompleteEvolutionSheetNewIndicationsRequest,
  EvolutionSheetResponse,
} from "../types/evolutionSheet.types";
import { completeEvolutionSheetNewIndications } from "../api/evolutionSheets.api";

function getCompleteEvolutionSheetErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.response?.status === 404) {
      return "La hoja de evolución no fue encontrada.";
    }

    if (error.response?.status === 403) {
      return "No tienes permisos para completar nuevas indicaciones.";
    }

    if (error.response?.status === 409) {
      return "La hoja de evolución no puede modificarse porque ya fue completada o no está activa.";
    }

    if (error.response?.status === 400) {
      return "Revisa las nuevas indicaciones e intenta nuevamente.";
    }

    const response = error.response?.data as ApiErrorResponse | undefined;
    if (response?.message && response.message.trim().length > 0) {
      return response.message;
    }
  }

  return "No fue posible completar las nuevas indicaciones. Revisa la conexión o intenta nuevamente.";
}

type CompleteEvolutionSheetNewIndicationsVariables = {
  evolutionSheetId: string;
  request: CompleteEvolutionSheetNewIndicationsRequest;
};

export function useCompleteEvolutionSheetNewIndications() {
  const queryClient = useQueryClient();

  return useMutation<
    EvolutionSheetResponse,
    Error,
    CompleteEvolutionSheetNewIndicationsVariables
  >({
    mutationFn: ({ evolutionSheetId, request }) =>
      completeEvolutionSheetNewIndications(evolutionSheetId, request),
    onSuccess: async (data) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["evolution-sheets", data.id] }),
        queryClient.invalidateQueries({
          queryKey: ["patients", data.patientId, "evolution-sheets"],
        }),
      ]);

      toast.success("Nuevas indicaciones completadas correctamente.");
    },
    onError: (error) => {
      toast.error(getCompleteEvolutionSheetErrorMessage(error));
    },
  });
}
