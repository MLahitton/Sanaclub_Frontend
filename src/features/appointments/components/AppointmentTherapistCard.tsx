import type { AppointmentResponse } from "../types/appointment.types";

type AppointmentTherapistCardProps = {
  appointment: AppointmentResponse;
};

export function AppointmentTherapistCard({ appointment }: AppointmentTherapistCardProps) {
  return (
    <section className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-4 md:p-5">
      <h3 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">Terapeuta</h3>

      <div className="mt-3 space-y-3 rounded-xl bg-[var(--color-sanaclub-bg)] p-4 text-sm text-[var(--color-sanaclub-text)]">
        <div>
          <p className="font-semibold text-[var(--color-sanaclub-text)]">Nombre</p>
          <p>{appointment.therapistFullName?.trim() || "Sin terapeuta"}</p>
        </div>
      </div>
    </section>
  );
}
