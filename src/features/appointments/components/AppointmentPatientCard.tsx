import { Users } from "lucide-react";
import type { AppointmentResponse } from "../types/appointment.types";

type AppointmentPatientCardProps = {
  appointment: AppointmentResponse;
  onViewPatient?: () => void;
};

export function AppointmentPatientCard({
  appointment,
  onViewPatient,
}: AppointmentPatientCardProps) {
  return (
    <section className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-4 md:p-5">
      <h3 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">Paciente</h3>

      <div className="mt-3 space-y-3 rounded-xl bg-[var(--color-sanaclub-bg)] p-4 text-sm text-[var(--color-sanaclub-text)]">
        <div>
          <p className="font-semibold text-[var(--color-sanaclub-text)]">Nombre</p>
          <p>{appointment.patientFullName?.trim() || "Sin paciente"}</p>
        </div>

        <div>
          <p className="font-semibold text-[var(--color-sanaclub-text)]">Numero de identificación</p>
          <p>{appointment.patientIdentificationNumber?.trim() || "Sin identificación"}</p>
        </div>

        {onViewPatient ? (
          <button
            type="button"
            onClick={onViewPatient}
            className="mt-2 inline-flex items-center gap-2 rounded-full border border-[var(--color-sanaclub-border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-sanaclub-text)] transition hover:border-[var(--color-sanaclub-green)] hover:text-[var(--color-sanaclub-green)]"
          >
            <Users className="h-4 w-4" />
            Ver paciente
          </button>
        ) : null}
      </div>
    </section>
  );
}
