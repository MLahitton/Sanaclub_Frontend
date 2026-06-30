import { Archive, Eye, Pencil } from "lucide-react";
import type { PatientResponse } from "../types/patient.types";

type PatientActionsMenuProps = {
  patient: PatientResponse;
  canEdit: boolean;
  canArchive: boolean;
  onView: (patient: PatientResponse) => void;
  onEdit: (patient: PatientResponse) => void;
  onArchive: (patient: PatientResponse) => void;
};

export function PatientActionsMenu({
  patient,
  canEdit,
  canArchive,
  onView,
  onEdit,
  onArchive,
}: PatientActionsMenuProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onView(patient)}
        className="inline-flex items-center gap-1 rounded-full border border-[var(--color-sanaclub-border)] px-2.5 py-1.5 text-xs text-[var(--color-sanaclub-text)] transition hover:border-[var(--color-sanaclub-green)] hover:text-[var(--color-sanaclub-green)]"
      >
        <Eye className="h-3.5 w-3.5" />
        Ver detalle
      </button>

      {canEdit ? (
        <button
          type="button"
          onClick={() => onEdit(patient)}
          className="inline-flex items-center gap-1 rounded-full border border-[var(--color-sanaclub-border)] px-2.5 py-1.5 text-xs text-[var(--color-sanaclub-text)] transition hover:border-[var(--color-sanaclub-green)] hover:text-[var(--color-sanaclub-green)]"
        >
          <Pencil className="h-3.5 w-3.5" />
          Editar
        </button>
      ) : null}

      {canArchive && patient.isActive ? (
        <button
          type="button"
          onClick={() => onArchive(patient)}
          className="inline-flex items-center gap-1 rounded-full border border-[var(--color-sanaclub-border)] px-2.5 py-1.5 text-xs text-[var(--color-sanaclub-text)] transition hover:border-[var(--color-sanaclub-coral)] hover:text-[var(--color-sanaclub-coral-dark)]"
        >
          <Archive className="h-3.5 w-3.5" />
          Archivar
        </button>
      ) : null}
    </div>
  );
}
