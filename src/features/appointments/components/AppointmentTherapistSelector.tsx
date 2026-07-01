import type { FieldError } from "react-hook-form";
import type { AppointmentTherapistResponse } from "../types/appointment.types";
import { useAppointmentTherapists } from "../hooks/useAppointmentTherapists";

type AppointmentTherapistSelectorProps = {
  value: string;
  disabled?: boolean;
  onChange: (therapistId: string) => void;
  error?: FieldError;
};

function controlSelectClass(disabled?: boolean) {
  return `w-full rounded-xl border border-[var(--color-sanaclub-border)] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[var(--color-sanaclub-green)] focus:ring-2 focus:ring-[var(--color-sanaclub-green)]/20 ${
    disabled ? "cursor-not-allowed bg-[var(--color-sanaclub-bg)]" : ""
  }`;
}

export function AppointmentTherapistSelector({
  value,
  disabled,
  onChange,
  error,
}: AppointmentTherapistSelectorProps) {
  const therapistsQuery = useAppointmentTherapists({ enabled: !disabled });
  const therapists = therapistsQuery.data ?? [];
  const hasNoTherapists =
    !therapistsQuery.isLoading && !therapistsQuery.isError && therapists.length === 0;

  return (
    <div className="space-y-2">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled || therapistsQuery.isError || hasNoTherapists}
        className={controlSelectClass(disabled || therapistsQuery.isError || hasNoTherapists)}
        aria-invalid={Boolean(error)}
      >
        <option value="">{disabled ? "Sin terapeuta" : "Selecciona un terapeuta"}</option>
        {therapists.map((therapist: AppointmentTherapistResponse) => (
          <option key={therapist.id} value={therapist.id}>
            {therapist.fullName.trim()} — {therapist.email}
          </option>
        ))}
      </select>

      {therapistsQuery.isLoading ? (
        <p className="text-sm text-[var(--color-sanaclub-muted)]">
          Cargando terapeutas disponibles...
        </p>
      ) : null}

      {hasNoTherapists ? (
        <p className="text-sm text-[var(--color-sanaclub-muted)]">
          No hay terapeutas activas disponibles para agendar citas.
        </p>
      ) : null}

      {therapistsQuery.isError ? (
        <p className="text-xs text-[var(--color-sanaclub-coral-dark)]">
          No fue posible cargar las terapeutas disponibles.
        </p>
      ) : null}

      {error ? <p className="text-xs text-[var(--color-sanaclub-coral-dark)]">{error.message}</p> : null}
    </div>
  );
}
