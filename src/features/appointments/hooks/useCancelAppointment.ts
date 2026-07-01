import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiErrorResponse } from "../../../shared/types/api.types";
import { cancelAppointment } from "../api/appointments.api";
import type { AppointmentResponse, CancelAppointmentRequest } from "../types/appointment.types";

function getCancelAppointmentErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const response = error.response?.data as ApiErrorResponse | undefined;

    if (error.response?.status === 403) {
      return "No tienes permisos para realizar esta acción.";
    }

    if (error.response?.status === 404) {
      return "La cita no fue encontrada.";
    }

    if (error.response?.status === 409) {
      return "La cita no puede actualizarse porque su estado actual no lo permite.";
    }

    if (error.response?.status === 400) {
      return "Revisa la información e intenta nuevamente.";
    }

    if (response?.message && response.message.trim().length > 0) {
      return response.message;
    }

    if (error.message) {
      return error.message;
    }
  }

  return "No fue posible actualizar la cita. Revisa la conexión o intenta nuevamente.";
}

type CancelAppointmentVariables = {
  appointmentId: string;
  request: CancelAppointmentRequest;
};

export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation<AppointmentResponse, Error, CancelAppointmentVariables>({
    mutationFn: (variables) => cancelAppointment(variables.appointmentId, variables.request),
    onSuccess: async (_data, variables) => {
      const appointmentId = variables.appointmentId?.trim();

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["appointments"] }),
        ...(appointmentId
          ? [queryClient.invalidateQueries({ queryKey: ["appointments", appointmentId] })]
          : []),
      ]);

      toast.success("Cita cancelada correctamente.");
    },
    onError: (error) => {
      toast.error(getCancelAppointmentErrorMessage(error));
    },
  });
}
