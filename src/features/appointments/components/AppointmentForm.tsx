import type { FieldError } from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createAppointmentSchema,
  type CreateAppointmentFormValues,
} from "../schemas/appointment.schemas";
import { AppointmentPatientSelector } from "./AppointmentPatientSelector";
import { AppointmentTherapistSelector } from "./AppointmentTherapistSelector";

type AppointmentFormProps = {
  isSubmitting: boolean;
  isSubmitDisabled?: boolean;
  onCancel: () => void;
  onSubmit: (values: CreateAppointmentFormValues) => void | Promise<void>;
};

function controlInputClass(disabled?: boolean) {
  return `w-full rounded-xl border border-[var(--color-sanaclub-border)] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[var(--color-sanaclub-green)] focus:ring-2 focus:ring-[var(--color-sanaclub-green)]/20 disabled:cursor-not-allowed disabled:opacity-60 ${
    disabled ? "bg-[var(--color-sanaclub-bg)]" : "bg-white"
  }`;
}

export function AppointmentForm({
  isSubmitting,
  isSubmitDisabled,
  onCancel,
  onSubmit,
}: AppointmentFormProps) {
  const {
    register,
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateAppointmentFormValues>({
    resolver: zodResolver(createAppointmentSchema),
    defaultValues: {
      patientId: "",
      therapistUserId: "",
      appointmentDate: "",
      startTime: "",
      notes: "",
    },
  });

  const selectedPatientId = useWatch({ control, name: "patientId" });
  const selectedTherapistId = useWatch({ control, name: "therapistUserId" });

  const patientError = errors.patientId as FieldError | undefined;
  const therapistError = errors.therapistUserId as FieldError | undefined;
  const dateError = errors.appointmentDate as FieldError | undefined;
  const timeError = errors.startTime as FieldError | undefined;
  const notesError = errors.notes as FieldError | undefined;

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <label className="block space-y-2 text-sm">
          <span className="font-semibold text-[var(--color-sanaclub-text)]">
            Paciente <span className="text-[var(--color-sanaclub-coral-dark)]">(*)</span>
          </span>
          <input
            type="hidden"
            {...register("patientId")}
            aria-invalid={Boolean(patientError)}
            aria-required
          />
          <AppointmentPatientSelector
            value={selectedPatientId}
            disabled={isSubmitting}
            onChange={(patientId) => {
              setValue("patientId", patientId, {
                shouldValidate: true,
              });
            }}
            error={patientError}
          />
        </label>
      </div>

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
            value={selectedTherapistId}
            disabled={isSubmitting}
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
            disabled={isSubmitting}
            className={controlInputClass(isSubmitting)}
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
            disabled={isSubmitting}
            className={controlInputClass(isSubmitting)}
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
          disabled={isSubmitting}
          className={`${controlInputClass(isSubmitting)} resize-y`}
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
          disabled={isSubmitting}
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={isSubmitDisabled || isSubmitting}
          className="rounded-full bg-[var(--color-sanaclub-green)] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-sanaclub-green-dark)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Creando cita..." : "Crear cita"}
        </button>
      </div>
    </form>
  );
}
