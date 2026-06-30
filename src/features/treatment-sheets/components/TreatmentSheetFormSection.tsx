import type { ReactNode } from "react";

type TreatmentSheetFormSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function TreatmentSheetFormSection({
  title,
  description,
  children,
}: TreatmentSheetFormSectionProps) {
  return (
    <section className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-[var(--color-sanaclub-bg)] p-4 md:p-5">
      <div className="mb-4 space-y-1">
        <h3 className="text-base font-semibold text-[var(--color-sanaclub-text)]">{title}</h3>
        {description ? <p className="text-xs text-[var(--color-sanaclub-muted)]">{description}</p> : null}
      </div>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}
