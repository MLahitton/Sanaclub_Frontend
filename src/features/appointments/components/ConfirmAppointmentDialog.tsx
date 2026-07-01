import {
  formatAppointmentDate,
  formatAppointmentTimeRange,
} from "../utils/appointmentFormatters";
import type { AppointmentResponse } from "../types/appointment.types";

type ConfirmAppointmentDialogProps = {
  appointment: AppointmentResponse | null;
  open: boolean;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: (appointment: AppointmentResponse) => void | Promise<void>;
};

export function ConfirmAppointmentDialog({
  appointment,
  open,
  isSubmitting,
  onClose,
  onConfirm,
}: ConfirmAppointmentDialogProps) {
  if (!open || !appointment) {
    return null;
  }

  const patientName = appointment.patientFullName?.trim() || "Paciente sin identificar";
  const date = formatAppointmentDate(appointment.appointmentDate);
  const time = formatAppointmentTimeRange(appointment.startTime, appointment.endTime);
  const therapist = appointment.therapistFullName?.trim() || "Sin terapeuta";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <article className="relative z-10 w-full max-w-lg rounded-3xl border border-[var(--color-sanaclub-border)] bg-white p-5 shadow-[0_16px_48px_rgba(36,51,43,0.25)] md:p-6">
        <h2 className="text-xl font-semibold text-[var(--color-sanaclub-text)]">Confirmar cita</h2>

        <p className="mt-2 rounded-lg bg-[var(--color-sanaclub-bg)] p-3 text-sm text-[var(--color-sanaclub-text)]">
          ¿Confirmar esta cita?
        </p>

        <div className="mt-3 space-y-1 text-sm text-[var(--color-sanaclub-muted)]">
          <p>
            <span className="font-semibold text-[var(--color-sanaclub-text)]">Paciente:</span>{" "}
            {patientName}
          </p>
          <p>
            <span className="font-semibold text-[var(--color-sanaclub-text)]">Fecha:</span> {date}
          </p>
          <p>
            <span className="font-semibold text-[var(--color-sanaclub-text)]">Hora:</span> {time}
          </p>
          <p>
            <span className="font-semibold text-[var(--color-sanaclub-text)]">Terapeuta:</span>{" "}
            {therapist}
          </p>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={Boolean(isSubmitting)}
            className="rounded-full border border-[var(--color-sanaclub-border)] px-5 py-2.5 text-sm font-semibold text-[var(--color-sanaclub-text)] transition hover:border-[var(--color-sanaclub-green)] hover:text-[var(--color-sanaclub-green)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Volver
          </button>
          <button
            type="button"
            onClick={() => void onConfirm(appointment)}
            disabled={Boolean(isSubmitting)}
            className="rounded-full bg-[var(--color-sanaclub-coral)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-sanaclub-coral-dark)] disabled:cursor-not-allowed disabled:bg-[var(--color-sanaclub-coral)]/60 disabled:opacity-60"
          >
            {isSubmitting ? "Confirmando..." : "Confirmar cita"}
          </button>
        </div>
      </article>
    </div>
  );
}
