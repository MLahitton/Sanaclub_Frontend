import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiErrorResponse } from "../../../shared/types/api.types";
import { updatePatient } from "../api/patients.api";
import type {
  UpdatePatientRequest,
  PatientResponse,
} from "../types/patient.types";

function getUpdatePatientErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const response = error.response?.data as ApiErrorResponse | undefined;

    if (response?.message) {
      return response.message;
    }

    if (response?.errors && Object.keys(response.errors).length > 0) {
      return "El formulario tiene datos que requieren correccion.";
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "No fue posible actualizar el paciente.";
}

type UpdatePatientVariables = {
  patientId: string;
  request: UpdatePatientRequest;
};

export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation<PatientResponse, Error, UpdatePatientVariables>({
    mutationFn: (variables) => updatePatient(variables.patientId, variables.request),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["patients"] }),
        queryClient.invalidateQueries({
          queryKey: ["patients", "detail", variables.patientId],
        }),
      ]);
      toast.success("Paciente actualizado exitosamente.");
    },
    onError: (error) => {
      toast.error(getUpdatePatientErrorMessage(error));
    },
  });
}
