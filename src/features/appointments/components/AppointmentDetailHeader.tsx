import { useState } from "react";
import { ArrowLeft, CalendarCheck, CalendarX, ClipboardEdit, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { isAppointmentCancelled, isAppointmentConfirmed } from "../utils/appointmentFormatters";
import { toCancelAppointmentRequest } from "../schemas/appointment.schemas";
import { useCancelAppointment } from "../hooks/useCancelAppointment";
import { useConfirmAppointment } from "../hooks/useConfirmAppointment";
import { ConfirmAppointmentDialog } from "./ConfirmAppointmentDialog";
import { CancelAppointmentDialog } from "./CancelAppointmentDialog";
import { AppointmentStatusBadge } from "./AppointmentStatusBadge";
import type { AppointmentResponse } from "../types/appointment.types";
import type { CancelAppointmentFormValues } from "../schemas/appointment.schemas";

type AppointmentDetailHeaderProps = {
  appointment: AppointmentResponse;
  onBackToAgenda: () => void;
  onViewPatient?: () => void;
  onViewClinicalReference?: () => void;
  canUpdate?: boolean;
  canConfirm?: boolean;
  canCancel?: boolean;
};

export function AppointmentDetailHeader({
  appointment,
  onBackToAgenda,
  onViewPatient,
  onViewClinicalReference,
  canUpdate = false,
  canConfirm = false,
  canCancel = false,
}: AppointmentDetailHeaderProps) {
  const isCancelled = isAppointmentCancelled(appointment);
  const isConfirmed = isAppointmentConfirmed(appointment);
  const canShowEdit = canUpdate && !isCancelled;
  const canShowConfirm = canConfirm && !isCancelled && !isConfirmed;
  const canShowCancel = canCancel && !isCancelled;
  const navigate = useNavigate();
  const appointmentId = appointment.id?.trim();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const confirmAppointment = useConfirmAppointment();
  const cancelAppointment = useCancelAppointment();

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
    values: CancelAppointmentFormValues,
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
    <section className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-4 shadow-[0_12px_35px_rgba(36,51,43,0.08)] md:p-6">
      <div className="mb-4 space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-sanaclub-coral-dark)]">
          Detalle de cita
        </p>
        <h2 className="text-2xl font-bold text-[var(--color-sanaclub-text)]">
          Cita de {appointment.patientFullName?.trim() || "sin identificar"}
        </h2>
        <p className="text-sm text-[var(--color-sanaclub-muted)]">
          Consulta la información de agenda, paciente, terapeuta y referencia clínica.
        </p>
      </div>

      <div className="mb-4 rounded-xl bg-[var(--color-sanaclub-bg)] p-3 text-sm text-[var(--color-sanaclub-text)]">
        <p>
          <span className="font-semibold">Paciente:</span>{" "}
          {appointment.patientFullName?.trim() || "Sin paciente"}
        </p>
        <p>
          <span className="font-semibold">Terapeuta:</span>{" "}
          {appointment.therapistFullName?.trim() || "Sin terapeuta"}
        </p>
        <p className="mt-2">
          <span className="font-semibold">Estado:</span>{" "}
          <AppointmentStatusBadge appointment={appointment} />
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onBackToAgenda}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-sanaclub-border)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-sanaclub-text)] transition hover:border-[var(--color-sanaclub-green)] hover:text-[var(--color-sanaclub-green)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a agenda
        </button>

        {onViewPatient ? (
          <button
            type="button"
            onClick={onViewPatient}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-sanaclub-border)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-sanaclub-text)] transition hover:border-[var(--color-sanaclub-green)] hover:text-[var(--color-sanaclub-green)]"
          >
            <FileText className="h-4 w-4" />
            Ver paciente
          </button>
        ) : null}

        {onViewClinicalReference ? (
          <button
            type="button"
            onClick={onViewClinicalReference}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-sanaclub-border)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-sanaclub-text)] transition hover:border-[var(--color-sanaclub-green)] hover:text-[var(--color-sanaclub-green)]"
          >
            <FileText className="h-4 w-4" />
            Ver referencia clinica
          </button>
        ) : null}

        {canShowEdit ? (
          <button
            type="button"
            onClick={handleEdit}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-sanaclub-coral)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-sanaclub-coral-dark)] transition hover:bg-[var(--color-sanaclub-coral)] hover:text-white"
          >
            <ClipboardEdit className="h-4 w-4" />
            Editar
          </button>
        ) : null}

        {canShowConfirm ? (
          <button
            type="button"
            onClick={handleOpenConfirmDialog}
            disabled={confirmAppointment.isPending}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-sanaclub-coral-dark)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-sanaclub-coral-dark)] transition hover:bg-[var(--color-sanaclub-coral-dark)] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <CalendarCheck className="h-4 w-4" />
            Confirmar
          </button>
        ) : null}

        {canShowCancel ? (
          <button
            type="button"
            onClick={handleOpenCancelDialog}
            disabled={cancelAppointment.isPending}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-sanaclub-coral)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-sanaclub-coral-dark)] transition hover:bg-[var(--color-sanaclub-coral)] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <CalendarX className="h-4 w-4" />
            Cancelar
          </button>
        ) : null}
      </div>

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
    </section>
  );
}
