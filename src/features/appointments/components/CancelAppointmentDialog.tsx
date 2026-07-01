import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  cancelAppointmentSchema,
  type CancelAppointmentFormValues,
} from "../schemas/appointment.schemas";
import {
  formatAppointmentDate,
  formatAppointmentTimeRange,
} from "../utils/appointmentFormatters";
import type { AppointmentResponse } from "../types/appointment.types";

type CancelAppointmentDialogProps = {
  appointment: AppointmentResponse | null;
  open: boolean;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (
    appointment: AppointmentResponse,
    values: CancelAppointmentFormValues,
  ) => void | Promise<void>;
};

function controlTextAreaClass(disabled?: boolean) {
  return `w-full rounded-xl border border-[var(--color-sanaclub-border)] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[var(--color-sanaclub-green)] focus:ring-2 focus:ring-[var(--color-sanaclub-green)]/20 disabled:cursor-not-allowed disabled:opacity-60 ${
    disabled ? "bg-[var(--color-sanaclub-bg)]" : "bg-white"
  }`;
}

export function CancelAppointmentDialog({
  appointment,
  open,
  isSubmitting,
  onClose,
  onSubmit,
}: CancelAppointmentDialogProps) {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CancelAppointmentFormValues>({
    resolver: zodResolver(cancelAppointmentSchema),
    defaultValues: { notes: "" },
  });

  useEffect(() => {
    if (!open) {
      reset({ notes: "" });
    }
  }, [open, reset]);

  const notesError = errors.notes as FieldError | undefined;
  const patientName = appointment?.patientFullName?.trim() || "Paciente sin identificar";
  const date = formatAppointmentDate(appointment?.appointmentDate);
  const time = formatAppointmentTimeRange(
    appointment?.startTime ?? "",
    appointment?.endTime ?? "",
  );
  const therapist = appointment?.therapistFullName?.trim() || "Sin terapeuta";

  const handleSubmitAppointment = handleSubmit((values) => {
    if (!appointment) return;
    return onSubmit(appointment, values);
  });

  if (!open || !appointment) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <article className="relative z-10 w-full max-w-lg rounded-3xl border border-[var(--color-sanaclub-border)] bg-white p-5 shadow-[0_16px_48px_rgba(36,51,43,0.25)] md:p-6">
        <h2 className="text-xl font-semibold text-[var(--color-sanaclub-text)]">Cancelar cita</h2>
        <p className="mt-2 rounded-lg bg-[var(--color-sanaclub-bg)] p-3 text-sm text-[var(--color-sanaclub-text)]">
          Esta acción cancelara la cita para este bloque de atención.
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

        <form className="mt-4 space-y-2" onSubmit={handleSubmitAppointment}>
          <label className="block space-y-2 text-sm">
            <span className="font-semibold text-[var(--color-sanaclub-text)]">Notas de cancelación</span>
            <textarea
              {...register("notes")}
              rows={4}
              disabled={Boolean(isSubmitting)}
              className={`${controlTextAreaClass(isSubmitting)} resize-y`}
              aria-invalid={Boolean(notesError)}
            />
            <p className="text-xs text-[var(--color-sanaclub-muted)]">
              Opcional. Puedes registrar el motivo o contexto de la cancelación.
            </p>
            {notesError ? (
              <p className="text-xs text-[var(--color-sanaclub-coral-dark)]">{notesError.message}</p>
            ) : null}
          </label>

          <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={Boolean(isSubmitting)}
              className="rounded-full border border-[var(--color-sanaclub-border)] px-5 py-2.5 text-sm font-semibold text-[var(--color-sanaclub-text)] transition hover:border-[var(--color-sanaclub-green)] hover:text-[var(--color-sanaclub-green)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Volver
            </button>
            <button
              type="submit"
              disabled={Boolean(isSubmitting)}
              className="rounded-full bg-[var(--color-sanaclub-coral)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-sanaclub-coral-dark)] disabled:cursor-not-allowed disabled:bg-[var(--color-sanaclub-coral)]/60 disabled:opacity-60"
            >
              {isSubmitting ? "Cancelando..." : "Cancelar cita"}
            </button>
          </div>
        </form>
      </article>
    </div>
  );
}
