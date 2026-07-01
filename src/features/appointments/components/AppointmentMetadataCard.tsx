import type { AppointmentResponse } from "../types/appointment.types";
import {
  formatAppointmentCancelledDate,
  formatAppointmentConfirmedDate,
  formatAppointmentCreatedDate,
  formatAppointmentUpdatedDate,
} from "../utils/appointmentFormatters";

type AppointmentMetadataCardProps = {
  appointment: AppointmentResponse;
};

export function AppointmentMetadataCard({ appointment }: AppointmentMetadataCardProps) {
  const confirmedDate = appointment.confirmedAtUtc?.trim()
    ? formatAppointmentConfirmedDate(appointment.confirmedAtUtc)
    : "Sin confirmacion";
  const cancelledDate = appointment.cancelledAtUtc?.trim()
    ? formatAppointmentCancelledDate(appointment.cancelledAtUtc)
    : "Sin cancelacion";

  return (
    <section className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-4 md:p-5">
      <h3 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">Metadata</h3>

      <div className="mt-3 space-y-3 rounded-xl bg-[var(--color-sanaclub-bg)] p-4 text-sm text-[var(--color-sanaclub-text)]">
        <div>
          <p className="font-semibold text-[var(--color-sanaclub-text)]">Creada el</p>
          <p>{formatAppointmentCreatedDate(appointment.createdAtUtc)}</p>
        </div>

        <div>
          <p className="font-semibold text-[var(--color-sanaclub-text)]">Actualizada el</p>
          <p>{formatAppointmentUpdatedDate(appointment.updatedAtUtc)}</p>
        </div>

        <div>
          <p className="font-semibold text-[var(--color-sanaclub-text)]">Confirmada el</p>
          <p>{confirmedDate}</p>
        </div>

        <div>
          <p className="font-semibold text-[var(--color-sanaclub-text)]">Cancelada el</p>
          <p>{cancelledDate}</p>
        </div>
      </div>
    </section>
  );
}

