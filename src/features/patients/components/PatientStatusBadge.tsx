type PatientStatusBadgeProps = {
  isActive: boolean;
};

export function PatientStatusBadge({ isActive }: PatientStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        isActive
          ? "bg-[var(--color-sanaclub-green)]/15 text-[var(--color-sanaclub-green-dark)]"
          : "bg-[var(--color-sanaclub-sand)]/20 text-[#6b4a32]"
      }`}
    >
      {isActive ? "Activo" : "Archivado"}
    </span>
  );
}
