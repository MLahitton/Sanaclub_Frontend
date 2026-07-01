import { ExternalLink } from "lucide-react";
import {
  formatClinicalReferenceLabel,
  getClinicalReferenceKind,
} from "../utils/appointmentFormatters";
import type { AppointmentResponse } from "../types/appointment.types";

type AppointmentClinicalReferenceCardProps = {
  appointment: AppointmentResponse;
  isNavigableType: boolean;
  onViewClinicalReference?: () => void;
};

export function AppointmentClinicalReferenceCard({
  appointment,
  isNavigableType,
  onViewClinicalReference,
}: AppointmentClinicalReferenceCardProps) {
  const canOpenClinicalReference = isNavigableType && onViewClinicalReference != null;
  const canShowClinicalReferenceButWithoutPermission =
    isNavigableType && !onViewClinicalReference;

  const referenceKind = getClinicalReferenceKind(appointment);
  const referenceTypeLabel =
    referenceKind === "evolution"
      ? "Evolucion"
      : referenceKind === "treatment"
        ? "Tratamiento"
        : appointment.clinicalReferenceType?.trim() || "Referencia clinica";

  return (
    <section className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-4 md:p-5">
      <h3 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">
        Referencia clinica
      </h3>

      <div className="mt-3 space-y-3 rounded-xl bg-[var(--color-sanaclub-bg)] p-4 text-sm text-[var(--color-sanaclub-text)]">
        <div>
          <p className="font-semibold text-[var(--color-sanaclub-text)]">Tipo</p>
          <p>{referenceTypeLabel}</p>
        </div>

        <div>
          <p className="font-semibold text-[var(--color-sanaclub-text)]">Detalle</p>
          <p>{formatClinicalReferenceLabel(appointment)}</p>
        </div>

        {appointment.treatmentNumber?.trim() ? (
          <div>
            <p className="font-semibold text-[var(--color-sanaclub-text)]">Numero de tratamiento</p>
            <p>{appointment.treatmentNumber.trim()}</p>
          </div>
        ) : null}

        {canOpenClinicalReference ? (
          <button
            type="button"
            onClick={onViewClinicalReference}
            className="mt-2 inline-flex items-center gap-2 rounded-full border border-[var(--color-sanaclub-border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-sanaclub-text)] transition hover:border-[var(--color-sanaclub-green)] hover:text-[var(--color-sanaclub-green)]"
          >
            <ExternalLink className="h-4 w-4" />
            Ver referencia clinica
          </button>
        ) : null}

        {canShowClinicalReferenceButWithoutPermission ? (
          <p className="text-xs text-[var(--color-sanaclub-muted)]">
            No tienes permisos para ver la referencia clinica.
          </p>
        ) : null}
      </div>
    </section>
  );
}
