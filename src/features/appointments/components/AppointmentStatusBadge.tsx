import type { AppointmentResponse } from "../types/appointment.types";
import { formatAppointmentStatus, getAppointmentStatusKind } from "../utils/appointmentFormatters";

export function AppointmentStatusBadge({
  appointment,
}: {
  appointment: AppointmentResponse;
}) {
  const statusKind = getAppointmentStatusKind(appointment);
  const statusLabel = formatAppointmentStatus(appointment);

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        statusKind === "confirmed"
          ? "bg-[var(--color-sanaclub-green)]/15 text-[var(--color-sanaclub-green-dark)]"
          : statusKind === "cancelled"
            ? "bg-[var(--color-sanaclub-coral)]/15 text-[var(--color-sanaclub-coral-dark)]"
            : "bg-[var(--color-sanaclub-coral)]/10 text-[var(--color-sanaclub-text)]"
      }`}
    >
      {statusLabel}
    </span>
  );
}
