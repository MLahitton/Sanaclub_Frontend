import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { FieldError } from "react-hook-form";
import type { PatientResponse } from "../../patients/types/patient.types";
import { listPatients } from "../../patients/api/patients.api";

type AppointmentPatientSelectorProps = {
  value: string;
  disabled?: boolean;
  onChange: (patientId: string) => void;
  error?: FieldError;
};

function controlButtonClass(isSelected: boolean) {
  return `w-full rounded-xl border px-3 py-2.5 text-left text-sm transition ${
    isSelected
      ? "border-[var(--color-sanaclub-green)] bg-[var(--color-sanaclub-bg)]"
      : "border-[var(--color-sanaclub-border)] hover:border-[var(--color-sanaclub-green)]"
  }`;
}

function formatPatientLabel(patient: PatientResponse) {
  const fullName = patient.fullName?.trim() || "Paciente sin nombre";
  const identification = patient.identificationNumber?.trim() || "Sin identificación";
  const phone = patient.phoneNumber?.trim();
  return phone ? `${fullName} - ${identification} - ${phone}` : `${fullName} - ${identification}`;
}

export function AppointmentPatientSelector({
  value,
  disabled,
  onChange,
  error,
}: AppointmentPatientSelectorProps) {
  const [searchInput, setSearchInput] = useState("");

  const search = searchInput.trim();
  const canSearch = !disabled && search.length >= 2;

  const patientsQuery = useQuery({
    queryKey: ["patients", "appointment-search", search],
    queryFn: () =>
      listPatients({
        search,
        isActive: true,
        pageNumber: 1,
        pageSize: 10,
      }),
    enabled: canSearch,
    select: (data) => data.items as PatientResponse[],
    staleTime: 30_000,
    placeholderData: (previousData) => previousData,
  });

  const patients = patientsQuery.data ?? [];
  const isLoading = patientsQuery.isLoading;
  const isError = patientsQuery.isError;
  const hasNoResults = canSearch && !isLoading && !isError && patients.length === 0;

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
        disabled={disabled}
        placeholder="Escribe al menos 2 caracteres para buscar..."
        className="w-full rounded-xl border border-[var(--color-sanaclub-border)] px-3 py-2.5 text-sm focus:border-[var(--color-sanaclub-green)] focus:ring-2 focus:ring-[var(--color-sanaclub-green)]/20"
        aria-label="Buscar paciente activo"
      />

      {canSearch ? (
        <div className="max-h-56 overflow-y-auto space-y-2 rounded-xl border border-[var(--color-sanaclub-border)] bg-white p-2">
          {isLoading ? (
            <p className="rounded-lg bg-[var(--color-sanaclub-bg)] px-3 py-2 text-sm text-[var(--color-sanaclub-muted)]">
              Buscando pacientes activos...
            </p>
          ) : null}

          {hasNoResults ? (
            <p className="rounded-lg bg-[var(--color-sanaclub-bg)] px-3 py-2 text-sm text-[var(--color-sanaclub-muted)]">
              No se encontraron pacientes con esos criterios.
            </p>
          ) : null}

          {patients.map((patient) => (
            <button
              key={patient.id}
              type="button"
              onClick={() => onChange(patient.id)}
              disabled={disabled}
              className={controlButtonClass(patient.id === value)}
            >
              <p className="font-semibold text-[var(--color-sanaclub-text)]">
                {patient.fullName?.trim() || "Sin nombre"}
              </p>
              <p className="text-xs text-[var(--color-sanaclub-muted)]">
                {formatPatientLabel(patient)}
              </p>
            </button>
          ))}
        </div>
      ) : null}

      {isError ? (
        <p className="text-xs text-[var(--color-sanaclub-coral-dark)]">
          No fue posible buscar pacientes.
        </p>
      ) : null}

      {error ? <p className="text-xs text-[var(--color-sanaclub-coral-dark)]">{error.message}</p> : null}
    </div>
  );
}
