import type { ReactNode } from "react";

type PatientInfoItemProps = {
  label: string;
  value?: ReactNode;
};

export function PatientInfoItem({ label, value }: PatientInfoItemProps) {
  const hasValue = value !== undefined && value !== null && value !== "";

  return (
    <div className="space-y-1 rounded-xl border border-[var(--color-sanaclub-border)] bg-[var(--color-sanaclub-bg)] p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-sanaclub-muted)]">
        {label}
      </p>
      <p className="text-sm text-[var(--color-sanaclub-text)]">
        {hasValue ? value : "Sin registrar"}
      </p>
    </div>
  );
}

