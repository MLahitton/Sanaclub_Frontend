import { AppointmentStatusBadge } from "./AppointmentStatusBadge";
import {
  formatAppointmentDate,
  formatAppointmentTime,
  formatAppointmentTimeRange,
} from "../utils/appointmentFormatters";
import type { AppointmentResponse } from "../types/appointment.types";

type AppointmentMainInfoCardProps = {
  appointment: AppointmentResponse;
};

export function AppointmentMainInfoCard({ appointment }: AppointmentMainInfoCardProps) {
  return (
    <section className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-4 md:p-5">
      <h3 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">
        Informacion principal
      </h3>

      <div className="mt-3 space-y-3 rounded-xl bg-[var(--color-sanaclub-bg)] p-4 text-sm text-[var(--color-sanaclub-text)]">
        <div>
          <p className="font-semibold text-[var(--color-sanaclub-text)]">Fecha de cita</p>
          <p>{formatAppointmentDate(appointment.appointmentDate)}</p>
        </div>

        <div>
          <p className="font-semibold text-[var(--color-sanaclub-text)]">Hora de inicio</p>
          <p>{formatAppointmentTime(appointment.startTime)}</p>
        </div>

        <div>
          <p className="font-semibold text-[var(--color-sanaclub-text)]">Hora de fin</p>
          <p>{formatAppointmentTime(appointment.endTime)}</p>
        </div>

        <div>
          <p className="font-semibold text-[var(--color-sanaclub-text)]">Rango horario</p>
          <p>{formatAppointmentTimeRange(appointment.startTime, appointment.endTime)}</p>
        </div>

        <div>
          <p className="mb-1 font-semibold text-[var(--color-sanaclub-text)]">Estado</p>
          <AppointmentStatusBadge appointment={appointment} />
        </div>

        <div>
          <p className="font-semibold text-[var(--color-sanaclub-text)]">Estado operativo</p>
          <p>{appointment.isActive ? "Activo" : "Inactivo"}</p>
        </div>
      </div>
    </section>
  );
}

