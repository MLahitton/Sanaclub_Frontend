import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiErrorResponse } from "../../../shared/types/api.types";
import { createTreatmentSheet } from "../api/treatmentSheets.api";
import type {
  CreateTreatmentSheetRequest,
  TreatmentSheetResponse,
} from "../types/treatmentSheet.types";

function getCreateTreatmentSheetErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.response?.status === 404) {
      return "El paciente no fue encontrado.";
    }

    if (error.response?.status === 403) {
      return "No tienes permisos para crear hojas de tratamiento.";
    }

    if (error.response?.status === 400 || error.response?.status === 409) {
      return "No fue posible crear la hoja de tratamiento.";
    }

    const response = error.response?.data as ApiErrorResponse | undefined;
    if (response?.message) {
      return response.message;
    }

    if (response?.errors && Object.keys(response.errors).length > 0) {
      return "No fue posible crear la hoja de tratamiento.";
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "No fue posible crear la hoja de tratamiento.";
}

export function useCreateTreatmentSheet(patientId?: string) {
  const queryClient = useQueryClient();
  const normalizedPatientId = patientId?.trim();

  return useMutation<TreatmentSheetResponse, Error, CreateTreatmentSheetRequest>({
    mutationFn: async (request) => {
      if (!normalizedPatientId) {
        throw new Error("No se identificó un paciente para crear la hoja.");
      }

      return createTreatmentSheet(normalizedPatientId, request);
    },
    onSuccess: async () => {
      if (!normalizedPatientId) return;
      await queryClient.invalidateQueries({
        queryKey: ["patients", normalizedPatientId, "treatment-sheets"],
      });
      toast.success("La hoja de tratamiento fue creada con éxito.");
    },
    onError: (error) => {
      toast.error(getCreateTreatmentSheetErrorMessage(error));
    },
  });
}
