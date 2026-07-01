import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiErrorResponse } from "../../../shared/types/api.types";
import type {
  TreatmentSheetResponse,
  UpdateTreatmentSheetMedicalIndicationRequest,
} from "../types/treatmentSheet.types";
import { updateTreatmentSheetMedicalIndication } from "../api/treatmentSheets.api";

function getUpdateMedicalIndicationErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.response?.status === 404) {
      return "La hoja de tratamiento no fue encontrada.";
    }

    if (error.response?.status === 403) {
      return "No tienes permisos para completar indicaciones m\u00E9dicas.";
    }

    if (error.response?.status === 409) {
      return "La hoja de tratamiento no puede modificarse porque ya fue aprobada o no est\u00E1 activa.";
    }

    if (error.response?.status === 400) {
      return "Revisa la informaci\u00F3n ingresada e intenta nuevamente.";
    }

    const response = error.response?.data as ApiErrorResponse | undefined;
    if (response?.message && response.message.trim().length > 0) {
      return response.message;
    }
  }

  return "No fue posible completar la indicaci\u00F3n m\u00E9dica. Revisa la conexi\u00F3n o intenta nuevamente.";
}

type UpdateTreatmentSheetMedicalIndicationVariables = {
  treatmentSheetId: string;
  request: UpdateTreatmentSheetMedicalIndicationRequest;
};

export function useUpdateTreatmentSheetMedicalIndication() {
  const queryClient = useQueryClient();

  return useMutation<
    TreatmentSheetResponse,
    Error,
    UpdateTreatmentSheetMedicalIndicationVariables
  >({
    mutationFn: ({ treatmentSheetId, request }) =>
      updateTreatmentSheetMedicalIndication(treatmentSheetId, request),
    onSuccess: async (_data) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["treatment-sheets", _data.id] }),
        queryClient.invalidateQueries({
          queryKey: ["patients", _data.patientId, "treatment-sheets"],
        }),
      ]);

      toast.success("Indici\u00F3n m\u00E9dica completada correctamente.");
    },
    onError: (error) => {
      toast.error(getUpdateMedicalIndicationErrorMessage(error));
    },
  });
}
