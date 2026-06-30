import { ArrowLeft, Pencil, Archive, CircleCheckBig } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { UserInitialsAvatar } from "../../../shared/components/UserInitialsAvatar";
import { PatientStatusBadge } from "./PatientStatusBadge";
import type { PatientResponse } from "../types/patient.types";
import { formatPatientCreatedDate } from "../utils/patientFormatters";

type PatientDetailHeaderProps = {
  patient: PatientResponse;
  identificationTypeLabel?: string;
  canEdit: boolean;
  canArchive: boolean;
  onEdit: () => void;
  onArchive: () => void;
};

export function PatientDetailHeader({
  patient,
  identificationTypeLabel = "No disponible",
  canEdit,
  canArchive,
  onEdit,
  onArchive,
}: PatientDetailHeaderProps) {
  const navigate = useNavigate();
  const status = patient.isActive ? "Activo" : "Archivado";
  const patientStatusClass = useMemo(() => {
    if (!patient.isActive) {
      return "bg-[var(--color-sanaclub-coral)]/12 text-[var(--color-sanaclub-coral-dark)]";
    }

    return "bg-[var(--color-sanaclub-green)]/12 text-[var(--color-sanaclub-green-dark)]";
  }, [patient.isActive]);

  return (
    <section className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-4 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <UserInitialsAvatar
            fullName={patient.fullName}
            email={patient.email ?? undefined}
            size="lg"
          />

          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold text-[var(--color-sanaclub-text)]">
              {patient.fullName}
            </h1>
            <p className="mt-1 text-sm text-[var(--color-sanaclub-muted)]">
              {identificationTypeLabel} · {patient.identificationNumber}
            </p>

            <p className="mt-2 text-xs text-[var(--color-sanaclub-muted)]">
              Creado: {formatPatientCreatedDate(patient.createdAtUtc)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium ${patientStatusClass}`}
          >
            <CircleCheckBig className="h-3.5 w-3.5" />
            {status}
          </span>

          <PatientStatusBadge isActive={patient.isActive} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => navigate("/app/patients")}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-sanaclub-border)] px-4 py-2 text-sm font-semibold text-[var(--color-sanaclub-text)] transition hover:border-[var(--color-sanaclub-green)] hover:text-[var(--color-sanaclub-green)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al listado
        </button>

        {canEdit ? (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-sanaclub-border)] px-4 py-2 text-sm font-semibold text-[var(--color-sanaclub-text)] transition hover:border-[var(--color-sanaclub-green)] hover:text-[var(--color-sanaclub-green)]"
          >
            <Pencil className="h-4 w-4" />
            Editar
          </button>
        ) : null}

        {canArchive && patient.isActive ? (
          <button
            type="button"
            onClick={onArchive}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-sanaclub-coral)] px-4 py-2 text-sm font-semibold text-[var(--color-sanaclub-coral-dark)] transition hover:bg-[var(--color-sanaclub-coral)] hover:text-white"
          >
            <Archive className="h-4 w-4" />
            Archivar
          </button>
        ) : null}
      </div>
    </section>
  );
}
