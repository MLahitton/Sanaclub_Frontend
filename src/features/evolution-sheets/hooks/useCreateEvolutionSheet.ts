import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiErrorResponse } from "../../../shared/types/api.types";
import { createEvolutionSheet } from "../api/evolutionSheets.api";
import type {
  CreateEvolutionSheetRequest,
  EvolutionSheetResponse,
} from "../types/evolutionSheet.types";

function getCreateEvolutionSheetErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.response?.status === 404) {
      return "El paciente o la hoja de tratamiento no fue encontrada.";
    }

    if (error.response?.status === 403) {
      return "No tienes permisos para crear hojas de evolución.";
    }

    if (error.response?.status === 409) {
      return "Solo se pueden crear evoluciones sobre hojas de tratamiento aprobadas.";
    }

    if (error.response?.status === 400) {
      return "Revisa la información ingresada e intenta nuevamente.";
    }

    const response = error.response?.data as ApiErrorResponse | undefined;
    if (response?.message) {
      return response.message;
    }

    if (response?.errors && Object.keys(response.errors).length > 0) {
      return "No fue posible crear la hoja de evolución.";
    }

    if (error.message) {
      return error.message;
    }
  }

  return "No fue posible crear la hoja de evolución. Revisa la conexión o intenta nuevamente.";
}

export function useCreateEvolutionSheet(patientId?: string) {
  const queryClient = useQueryClient();
  const normalizedPatientId = patientId?.trim();

  return useMutation<EvolutionSheetResponse, Error, CreateEvolutionSheetRequest>({
    mutationFn: async (request) => {
      if (!normalizedPatientId) {
        throw new Error("No se identificó un paciente para crear la hoja de evolución.");
      }

      return createEvolutionSheet(normalizedPatientId, request);
    },
    onSuccess: async () => {
      if (!normalizedPatientId) {
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: ["patients", normalizedPatientId, "evolution-sheets"],
      });
      toast.success("Hoja de evolución creada correctamente.");
    },
    onError: (error) => {
      toast.error(getCreateEvolutionSheetErrorMessage(error));
    },
  });
}

