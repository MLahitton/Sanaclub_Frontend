import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiErrorResponse } from "../../../shared/types/api.types";
import type {
  AppointmentResponse,
  UpdateAppointmentRequest,
} from "../types/appointment.types";
import { updateAppointment } from "../api/appointments.api";

function getUpdateAppointmentErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.response?.status === 403) {
      return "No tienes permisos para editar citas.";
    }

    if (error.response?.status === 404) {
      return "La cita o la terapeuta seleccionada no fue encontrada.";
    }

    if (error.response?.status === 409) {
      return "No fue posible actualizar la cita. Verifica que no esté cancelada y que el horario esté disponible.";
    }

    if (error.response?.status === 400) {
      return "Revisa la información de la cita e intenta nuevamente.";
    }

    const response = error.response?.data as ApiErrorResponse | undefined;
    if (response?.message && response.message.trim().length > 0) {
      return response.message;
    }

    if (error.message) {
      return error.message;
    }
  }

  return "No fue posible actualizar la cita. Revisa la conexión o intenta nuevamente.";
}

type UpdateAppointmentVariables = {
  appointmentId: string;
  request: UpdateAppointmentRequest;
};

export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation<AppointmentResponse, Error, UpdateAppointmentVariables>({
    mutationFn: (variables) =>
      updateAppointment(variables.appointmentId, variables.request),
    onSuccess: async (_data, variables) => {
      const appointmentId = variables.appointmentId?.trim();

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["appointments"] }),
        ...(appointmentId
          ? [queryClient.invalidateQueries({ queryKey: ["appointments", appointmentId] })]
          : []),
      ]);

      toast.success("Cita actualizada correctamente.");
    },
    onError: (error) => {
      toast.error(getUpdateAppointmentErrorMessage(error));
    },
  });
}
