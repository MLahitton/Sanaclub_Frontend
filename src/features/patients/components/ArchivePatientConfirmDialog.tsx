type ArchivePatientConfirmDialogProps = {
  open: boolean;
  patientName: string;
  isSubmitting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ArchivePatientConfirmDialog({
  open,
  patientName,
  isSubmitting,
  onConfirm,
  onCancel,
}: ArchivePatientConfirmDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/30" onClick={onCancel} />

      <article className="relative z-10 w-full max-w-lg rounded-3xl border border-[var(--color-sanaclub-border)] bg-white p-5 shadow-[0_16px_48px_rgba(36,51,43,0.25)] md:p-6">
        <h2 className="text-xl font-semibold text-[var(--color-sanaclub-text)]">
          Archivar paciente
        </h2>
        <p className="mt-2 text-sm text-[var(--color-sanaclub-muted)]">
          Esta acción archivará al paciente y dejará de aparecer como activo. No se eliminará la información clínica.
        </p>

        <p className="mt-3 rounded-lg bg-[var(--color-sanaclub-bg)] p-3 text-sm text-[var(--color-sanaclub-text)]">
          ¿Deseas archivar a este paciente? <span className="font-semibold">{patientName}</span>
        </p>
        <p className="mt-2 text-sm text-[var(--color-sanaclub-muted)]">
          El paciente no será eliminado, pero dejará de aparecer como activo.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={Boolean(isSubmitting)}
            className="rounded-full border border-[var(--color-sanaclub-border)] px-5 py-2.5 text-sm font-semibold text-[var(--color-sanaclub-text)] transition hover:border-[var(--color-sanaclub-green)] hover:text-[var(--color-sanaclub-green)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={Boolean(isSubmitting)}
            className="rounded-full bg-[var(--color-sanaclub-coral)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-sanaclub-coral-dark)] disabled:cursor-not-allowed disabled:bg-[var(--color-sanaclub-coral)]/60 disabled:opacity-60"
          >
            {isSubmitting ? "Archivando..." : "Confirmar archivo"}
          </button>
        </div>
      </article>
    </div>
  );
}
