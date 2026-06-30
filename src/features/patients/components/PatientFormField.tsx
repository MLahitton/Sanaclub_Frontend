import type { ReactNode } from "react";
import type { FieldError } from "react-hook-form";

type PatientFormFieldProps = {
  label: string;
  id: string;
  required?: boolean;
  error?: FieldError;
  className?: string;
  children: ReactNode;
};

export function PatientFormField({
  label,
  id,
  required,
  error,
  className,
  children,
}: PatientFormFieldProps) {
  const requiredIndicator = required ? (
    <span className="ml-1 inline-flex text-xs text-[var(--color-sanaclub-coral-dark)]">(*)</span>
  ) : null;

  return (
    <label htmlFor={id} className={`block space-y-2 ${className ?? ""}`}>
      <span className="text-sm font-semibold text-[var(--color-sanaclub-text)]">
        {label}
        {requiredIndicator}
      </span>
      {children}

      {error?.message ? (
        <p className="text-xs text-[var(--color-sanaclub-coral-dark)]">{error.message}</p>
      ) : null}
    </label>
  );
}
