import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiErrorResponse } from "../../../shared/types/api.types";
import { confirmAppointment } from "../api/appointments.api";
import type { AppointmentResponse } from "../types/appointment.types";

function getConfirmAppointmentErrorMessage(error: unknown): string {
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

type ConfirmAppointmentVariables = {
  appointmentId: string;
};

export function useConfirmAppointment() {
  const queryClient = useQueryClient();

  return useMutation<AppointmentResponse, Error, ConfirmAppointmentVariables>({
    mutationFn: (variables) => confirmAppointment(variables.appointmentId),
    onSuccess: async (_data, variables) => {
      const appointmentId = variables.appointmentId?.trim();

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["appointments"] }),
        ...(appointmentId
          ? [queryClient.invalidateQueries({ queryKey: ["appointments", appointmentId] })]
          : []),
      ]);

      toast.success("Cita confirmada correctamente.");
    },
    onError: (error) => {
      toast.error(getConfirmAppointmentErrorMessage(error));
    },
  });
}
