import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiErrorResponse } from "../../../shared/types/api.types";
import { createAppointment } from "../api/appointments.api";
import type {
  CreateAppointmentRequest,
  AppointmentResponse,
} from "../types/appointment.types";

function getCreateAppointmentErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.response?.status === 409) {
      return "No fue posible crear la cita. Verifica disponibilidad, terapeuta y documento clínico vigente del paciente.";
    }

    if (error.response?.status === 403) {
      return "No tienes permisos para crear citas.";
    }

    if (error.response?.status === 404) {
      return "El paciente o la terapeuta seleccionada no fue encontrada.";
    }

    if (error.response?.status === 400) {
      return "Revisa la información de la cita e intenta nuevamente.";
    }

    const response = error.response?.data as ApiErrorResponse | undefined;
    if (response?.message) {
      return response.message;
    }

    if (error.message) {
      return error.message;
    }
  }

  return "No fue posible crear la cita. Revisa la conexión o intenta nuevamente.";
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation<AppointmentResponse, Error, CreateAppointmentRequest>({
    mutationFn: (request) => createAppointment(request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Cita creada correctamente.");
    },
    onError: (error) => {
      toast.error(getCreateAppointmentErrorMessage(error));
    },
  });
}
