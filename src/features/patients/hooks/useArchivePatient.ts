import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiErrorResponse } from "../../../shared/types/api.types";
import { archivePatient } from "../api/patients.api";
import type { PatientResponse } from "../types/patient.types";

function getArchivePatientErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const response = error.response?.data as ApiErrorResponse | undefined;

    if (status === 404) {
      return "El paciente no fue encontrado.";
    }

    if (status === 403) {
      return "No tienes permisos para archivar este paciente.";
    }

    if (status === 400 || status === 409) {
      return "No fue posible archivar el paciente.";
    }

    if (response?.message) {
      return response.message;
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "No fue posible archivar el paciente.";
}

type ArchivePatientVariables = {
  patientId: string;
};

export function useArchivePatient() {
  const queryClient = useQueryClient();

  return useMutation<PatientResponse, Error, ArchivePatientVariables>({
    mutationFn: (variables) => archivePatient(variables.patientId),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["patients"] }),
        queryClient.invalidateQueries({
          queryKey: ["patients", "detail", variables.patientId],
        }),
      ]);
      toast.success("Paciente archivado exitosamente.");
    },
    onError: (error) => {
      toast.error(getArchivePatientErrorMessage(error));
    },
  });
}
