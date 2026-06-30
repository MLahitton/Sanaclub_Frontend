import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiErrorResponse } from "../../../shared/types/api.types";
import { createPatient } from "../api/patients.api";
import type { CreatePatientRequest, PatientResponse } from "../types/patient.types";

function getCreatePatientErrorMessage(error: unknown): string {
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

  return "No fue posible crear el paciente.";
}

export function useCreatePatient() {
  const queryClient = useQueryClient();

  return useMutation<PatientResponse, Error, CreatePatientRequest>({
    mutationFn: (request) => createPatient(request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast.success("Paciente creado exitosamente.");
    },
    onError: (error) => {
      toast.error(getCreatePatientErrorMessage(error));
    },
  });
}
