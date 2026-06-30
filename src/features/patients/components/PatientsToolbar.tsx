import { Plus } from "lucide-react";
import type { ChangeEvent, FormEvent } from "react";
import type { PatientActiveFilter } from "../types/patient.types";

type PatientsToolbarProps = {
  searchInput: string;
  activeFilter: PatientActiveFilter;
  canCreate: boolean;
  isLoading: boolean;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: PatientActiveFilter) => void;
  onSearchSubmit: () => void;
  onClearFilters: () => void;
  onCreatePatient: () => void;
};

export function PatientsToolbar({
  searchInput,
  activeFilter,
  canCreate,
  isLoading,
  onSearchChange,
  onFilterChange,
  onSearchSubmit,
  onClearFilters,
  onCreatePatient,
}: PatientsToolbarProps) {
  const hasActiveFilters = searchInput.trim().length > 0 || activeFilter !== "all";

  const handleFilter = (event: ChangeEvent<HTMLSelectElement>) => {
    onFilterChange(event.target.value as PatientActiveFilter);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearchSubmit();
  };

  return (
    <div className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-4">
      <form
        className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_auto_auto] md:items-end"
        onSubmit={handleSubmit}
      >
        <div>
          <label htmlFor="patients-search" className="mb-1 block text-xs font-medium">
            Buscar
          </label>
          <div className="flex items-center gap-2">
            <input
              id="patients-search"
              type="text"
              value={searchInput}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Buscar por nombre, documento, correo o ciudad"
              className="w-full rounded-xl border border-[var(--color-sanaclub-border)] px-3 py-2.5 text-sm outline-none transition focus:border-[var(--color-sanaclub-green)]"
            />
            <button
              type="submit"
              className="rounded-xl bg-[var(--color-sanaclub-green)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-sanaclub-green-dark)] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isLoading}
            >
              Buscar
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="patients-status" className="mb-1 block text-xs font-medium">
            Estado
          </label>
          <select
            id="patients-status"
            value={activeFilter}
            onChange={handleFilter}
            className="w-full rounded-xl border border-[var(--color-sanaclub-border)] px-3 py-2.5 text-sm"
          >
            <option value="all">Todos</option>
            <option value="active">Activos</option>
            <option value="inactive">Archivados</option>
          </select>
        </div>

        <div>
          <button
            type="button"
            onClick={onClearFilters}
            className="w-full rounded-xl border border-[var(--color-sanaclub-border)] px-4 py-2.5 text-sm text-[var(--color-sanaclub-text)] transition hover:border-[var(--color-sanaclub-green)] hover:text-[var(--color-sanaclub-green)]"
          >
            Limpiar
          </button>
        </div>

        {canCreate ? (
          <button
            type="button"
            onClick={onCreatePatient}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-sanaclub-coral)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-sanaclub-coral-dark)]"
            disabled={isLoading}
          >
            <Plus className="h-4 w-4" />
            Nuevo paciente
          </button>
        ) : null}
      </form>

      {hasActiveFilters ? (
        <p className="mt-3 text-xs text-[var(--color-sanaclub-muted)]">
          Filtros activos: {activeFilter === "active" ? "activos" : activeFilter === "inactive" ? "archivados" : "todos"}
        </p>
      ) : null}
    </div>
  );
}
