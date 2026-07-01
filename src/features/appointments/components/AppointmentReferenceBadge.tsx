import type { AppointmentResponse } from "../types/appointment.types";
import { formatClinicalReferenceLabel } from "../utils/appointmentFormatters";

export function AppointmentReferenceBadge({
  appointment,
}: {
  appointment: AppointmentResponse;
}) {
  const label = formatClinicalReferenceLabel(appointment);

  return (
    <span className="inline-flex items-center rounded-full border border-[var(--color-sanaclub-border)] bg-[var(--color-sanaclub-bg)] px-3 py-1 text-xs font-medium text-[var(--color-sanaclub-text)]">
      {label}
    </span>
  );
}
