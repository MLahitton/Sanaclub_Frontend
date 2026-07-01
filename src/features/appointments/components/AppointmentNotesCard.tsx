import type { AppointmentResponse } from "../types/appointment.types";
import { formatOptionalAppointmentText } from "../utils/appointmentFormatters";

type AppointmentNotesCardProps = {
  appointment: AppointmentResponse;
};

export function AppointmentNotesCard({ appointment }: AppointmentNotesCardProps) {
  return (
    <section className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-4 md:p-5">
      <h3 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">Notas</h3>

      <div className="mt-3 rounded-xl bg-[var(--color-sanaclub-bg)] p-4 text-sm text-[var(--color-sanaclub-text)]">
        <p>{formatOptionalAppointmentText(appointment.notes, "Sin notas registradas.")}</p>
      </div>
    </section>
  );
}

