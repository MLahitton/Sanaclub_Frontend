import { useEffect } from "react";
import type { FieldError } from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateAppointmentSchema,
  type UpdateAppointmentFormValues,
} from "../schemas/appointment.schemas";
import { AppointmentTherapistSelector } from "./AppointmentTherapistSelector";

type EditAppointmentContext = {
  patientFullName: string;
  patientIdentificationNumber: string;
  clinicalReference: string;
  status: string;
  currentSchedule: string;
};

type EditAppointmentFormProps = {
  defaultValues: UpdateAppointmentFormValues;
  isSubmitting: boolean;
  isSubmitDisabled?: boolean;
  onCancel: () => void;
  onSubmit: (values: UpdateAppointmentFormValues) => void | Promise<void>;
  context: EditAppointmentContext;
};

function controlInputClass(disabled?: boolean) {
  return `w-full rounded-xl border border-[var(--color-sanaclub-border)] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[var(--color-sanaclub-green)] focus:ring-2 focus:ring-[var(--color-sanaclub-green)]/20 disabled:cursor-not-allowed disabled:opacity-60 ${
    disabled ? "bg-[var(--color-sanaclub-bg)]" : "bg-white"
  }`;
}

function controlTextAreaClass(disabled?: boolean) {
  return `${controlInputClass(
    disabled,
  )} resize-y disabled:cursor-not-allowed disabled:opacity-70`;
}

export function EditAppointmentForm({
  defaultValues,
  isSubmitting,
  isSubmitDisabled,
  onCancel,
  onSubmit,
  context,
}: EditAppointmentFormProps) {
  const {
    register,
    setValue,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UpdateAppointmentFormValues>({
    resolver: zodResolver(updateAppointmentSchema),
    defaultValues,
  });

  useEffect(() => {
    reset({
      therapistUserId: defaultValues.therapistUserId,
      appointmentDate: defaultValues.appointmentDate,
      startTime: defaultValues.startTime,
      notes: defaultValues.notes,
    });
  }, [defaultValues, reset]);

  const selectedTherapistId = useWatch({ control, name: "therapistUserId" });

  const therapistError = errors.therapistUserId as FieldError | undefined;
  const dateError = errors.appointmentDate as FieldError | undefined;
  const timeError = errors.startTime as FieldError | undefined;
  const notesError = errors.notes as FieldError | undefined;

  const isDisabled = isSubmitDisabled || isSubmitting;

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-[var(--color-sanaclub-border)] bg-[var(--color-sanaclub-bg)] p-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-sanaclub-coral-dark)]">
          Datos de contexto
        </h2>
        <div className="mt-2 space-y-1 text-sm text-[var(--color-sanaclub-text)]">
          <p>
            <span className="font-semibold">Paciente:</span> {context.patientFullName}
          </p>
          <p>
            <span className="font-semibold">Identificación:</span>{" "}
            {context.patientIdentificationNumber}
          </p>
          <p>
            <span className="font-semibold">Referencia clínica:</span>{" "}
            {context.clinicalReference}
          </p>
          <p>
            <span className="font-semibold">Estado actual:</span> {context.status}
          </p>
          <p>
            <span className="font-semibold">Horario actual:</span> {context.currentSchedule}
          </p>
        </div>
      </section>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <label className="block space-y-2 text-sm">
            <span className="font-semibold text-[var(--color-sanaclub-text)]">
              Terapeuta <span className="text-[var(--color-sanaclub-coral-dark)]">(*)</span>
            </span>
            <input
              type="hidden"
              {...register("therapistUserId")}
              aria-invalid={Boolean(therapistError)}
              aria-required
            />
            <AppointmentTherapistSelector
              value={selectedTherapistId || ""}
              disabled={isDisabled}
              onChange={(therapistId) => {
                setValue("therapistUserId", therapistId, {
                  shouldValidate: true,
                });
              }}
              error={therapistError}
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-2 text-sm">
            <span className="font-semibold text-[var(--color-sanaclub-text)]">
              Fecha de cita <span className="text-[var(--color-sanaclub-coral-dark)]">(*)</span>
            </span>
            <input
              type="date"
              {...register("appointmentDate")}
              disabled={isDisabled}
              className={controlInputClass(isDisabled)}
              aria-invalid={Boolean(dateError)}
              aria-required
            />
            {dateError ? (
              <p className="text-xs text-[var(--color-sanaclub-coral-dark)]">{dateError.message}</p>
            ) : null}
          </label>

          <label className="block space-y-2 text-sm">
            <span className="font-semibold text-[var(--color-sanaclub-text)]">
              Hora de inicio <span className="text-[var(--color-sanaclub-coral-dark)]">(*)</span>
            </span>
            <input
              type="time"
              {...register("startTime")}
              disabled={isDisabled}
              className={controlInputClass(isDisabled)}
              aria-invalid={Boolean(timeError)}
              aria-required
            />
            {timeError ? (
              <p className="text-xs text-[var(--color-sanaclub-coral-dark)]">{timeError.message}</p>
            ) : null}
          </label>
        </div>

        <label className="block space-y-2 text-sm">
          <span className="font-semibold text-[var(--color-sanaclub-text)]">Notas</span>
          <textarea
            {...register("notes")}
            rows={4}
            disabled={isDisabled}
            className={controlTextAreaClass(isDisabled)}
            aria-invalid={Boolean(notesError)}
          />
          {notesError ? (
            <p className="text-xs text-[var(--color-sanaclub-coral-dark)]">{notesError.message}</p>
          ) : null}
        </label>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-[var(--color-sanaclub-border)] px-5 py-2.5 text-sm font-semibold text-[var(--color-sanaclub-text)] transition hover:border-[var(--color-sanaclub-green)] hover:text-[var(--color-sanaclub-green)] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isDisabled}
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={isDisabled}
            className="rounded-full bg-[var(--color-sanaclub-green)] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-sanaclub-green-dark)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
