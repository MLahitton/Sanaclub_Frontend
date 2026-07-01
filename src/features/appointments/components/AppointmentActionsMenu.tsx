import { useState } from "react";
import { CalendarCheck, CalendarX, Eye, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  isAppointmentCancelled,
  isAppointmentConfirmed,
} from "../utils/appointmentFormatters";
import { toCancelAppointmentRequest } from "../schemas/appointment.schemas";
import type { AppointmentResponse } from "../types/appointment.types";
import { useCancelAppointment } from "../hooks/useCancelAppointment";
import { useConfirmAppointment } from "../hooks/useConfirmAppointment";
import { ConfirmAppointmentDialog } from "./ConfirmAppointmentDialog";
import { CancelAppointmentDialog } from "./CancelAppointmentDialog";

type AppointmentActionsMenuProps = {
  appointment: AppointmentResponse;
  canRead: boolean;
  canUpdate: boolean;
  canConfirm: boolean;
  canCancel: boolean;
};

export function AppointmentActionsMenu({
  appointment,
  canRead,
  canUpdate,
  canConfirm,
  canCancel,
}: AppointmentActionsMenuProps) {
  const navigate = useNavigate();
  const isCancelled = isAppointmentCancelled(appointment);
  const isConfirmed = isAppointmentConfirmed(appointment);
  const canShowEdit = canUpdate && !isCancelled;
  const canShowConfirm = canConfirm && !isCancelled && !isConfirmed;
  const canShowCancel = canCancel && !isCancelled;
  const appointmentId = appointment.id?.trim();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const confirmAppointment = useConfirmAppointment();
  const cancelAppointment = useCancelAppointment();

  const handleView = () => {
    if (!appointmentId) {
      toast.error("No fue posible abrir el detalle de la cita.");
      return;
    }

    navigate(`/app/appointments/${encodeURIComponent(appointmentId)}`);
  };

  const handleEdit = () => {
    if (!appointmentId) {
      toast.error("No fue posible abrir el editor de esta cita.");
      return;
    }

    navigate(`/app/appointments/${encodeURIComponent(appointmentId)}/edit`);
  };

  const handleOpenConfirmDialog = () => {
    if (!appointmentId) {
      toast.error("No fue posible confirmar esta cita.");
      return;
    }

    setIsConfirmDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setIsConfirmDialogOpen(false);
  };

  const handleOpenCancelDialog = () => {
    if (!appointmentId) {
      toast.error("No fue posible cancelar esta cita.");
      return;
    }

    setIsCancelDialogOpen(true);
  };

  const handleCloseCancelDialog = () => {
    setIsCancelDialogOpen(false);
  };

  const handleConfirmAppointment = async () => {
    if (!appointmentId) {
      toast.error("No fue posible confirmar esta cita.");
      return;
    }

    try {
      await confirmAppointment.mutateAsync({ appointmentId });
      setIsConfirmDialogOpen(false);
    } catch {
      // El error lo maneja el hook y lo mostramos via toast.
    }
  };

  const handleCancelAppointment = async (
    _appointment: AppointmentResponse,
    values: Parameters<typeof toCancelAppointmentRequest>[0],
  ) => {
    if (!appointmentId) {
      toast.error("No fue posible cancelar esta cita.");
      return;
    }

    try {
      await cancelAppointment.mutateAsync({
        appointmentId,
        request: toCancelAppointmentRequest(values),
      });
      setIsCancelDialogOpen(false);
    } catch {
      // El error lo maneja el hook y lo mostramos via toast.
    }
  };

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {canRead ? (
        <button
          type="button"
          onClick={handleView}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-sanaclub-border)] px-3 py-1.5 text-xs font-semibold text-[var(--color-sanaclub-text)] transition hover:border-[var(--color-sanaclub-green)] hover:text-[var(--color-sanaclub-green)]"
        >
          <Eye className="h-3.5 w-3.5" />
          Ver detalle
        </button>
      ) : null}

      {canShowEdit ? (
        <button
          type="button"
          onClick={handleEdit}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-sanaclub-border)] px-3 py-1.5 text-xs font-semibold text-[var(--color-sanaclub-text)] transition hover:border-[var(--color-sanaclub-green)] hover:text-[var(--color-sanaclub-green)]"
        >
          <Pencil className="h-3.5 w-3.5" />
          Editar
        </button>
      ) : null}

      {canShowConfirm ? (
        <button
          type="button"
          onClick={handleOpenConfirmDialog}
          disabled={confirmAppointment.isPending}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-sanaclub-coral)] px-3 py-1.5 text-xs font-semibold text-[var(--color-sanaclub-coral-dark)] transition hover:bg-[var(--color-sanaclub-coral)] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <CalendarCheck className="h-3.5 w-3.5" />
          Confirmar
        </button>
      ) : null}

      {canShowCancel ? (
        <button
          type="button"
          onClick={handleOpenCancelDialog}
          disabled={cancelAppointment.isPending}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-sanaclub-coral-dark)] px-3 py-1.5 text-xs font-semibold text-[var(--color-sanaclub-coral-dark)] transition hover:bg-[var(--color-sanaclub-coral-dark)] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <CalendarX className="h-3.5 w-3.5" />
          Cancelar
        </button>
      ) : null}

      <ConfirmAppointmentDialog
        appointment={appointment}
        open={isConfirmDialogOpen}
        isSubmitting={confirmAppointment.isPending}
        onClose={handleCloseConfirmDialog}
        onConfirm={handleConfirmAppointment}
      />

      <CancelAppointmentDialog
        appointment={appointment}
        open={isCancelDialogOpen}
        isSubmitting={cancelAppointment.isPending}
        onClose={handleCloseCancelDialog}
        onSubmit={handleCancelAppointment}
      />
    </div>
  );
}
