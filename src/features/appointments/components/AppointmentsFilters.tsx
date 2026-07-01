import type { AppointmentListQueryParams } from "../types/appointment.types";

type AppointmentsFiltersProps = {
  filters: AppointmentListQueryParams;
  isLoading: boolean;
  onChange: (next: AppointmentListQueryParams) => void;
  onClear: () => void;
};

const STATUS_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "SCHEDULED", label: "SCHEDULED" },
  { value: "CONFIRMED", label: "CONFIRMED" },
  { value: "CANCELLED", label: "CANCELLED" },
];

export function AppointmentsFilters({
  filters,
  isLoading,
  onChange,
  onClear,
}: AppointmentsFiltersProps) {
  const current = {
    date: filters.date ?? "",
    fromDate: filters.fromDate ?? "",
    toDate: filters.toDate ?? "",
    status: filters.status ?? "",
    includeCancelled: filters.includeCancelled ?? false,
  };

  const handleDateChange = (value: string) => {
    onChange({
      ...filters,
      date: value,
      fromDate: "",
      toDate: "",
      pageNumber: 1,
    });
  };

  const handleFromDateChange = (value: string) => {
    onChange({
      ...filters,
      date: "",
      fromDate: value,
      pageNumber: 1,
    });
  };

  const handleToDateChange = (value: string) => {
    onChange({
      ...filters,
      date: "",
      toDate: value,
      pageNumber: 1,
    });
  };

  const handleStatusChange = (value: string) => {
    onChange({
      ...filters,
      status: value || undefined,
      pageNumber: 1,
    });
  };

  const handleIncludeCancelledChange = (checked: boolean) => {
    onChange({
      ...filters,
      includeCancelled: checked,
      pageNumber: 1,
    });
  };

  return (
    <section className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-4 md:p-5">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <label className="space-y-1 text-sm">
          <span className="font-semibold text-[var(--color-sanaclub-text)]">Fecha exacta</span>
          <input
            type="date"
            value={current.date}
            disabled={isLoading}
            onChange={(event) => handleDateChange(event.target.value)}
            className="w-full rounded-xl border border-[var(--color-sanaclub-border)] px-3 py-2.5 text-sm"
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-semibold text-[var(--color-sanaclub-text)]">Desde</span>
          <input
            type="date"
            value={current.fromDate}
            disabled={isLoading}
            onChange={(event) => handleFromDateChange(event.target.value)}
            className="w-full rounded-xl border border-[var(--color-sanaclub-border)] px-3 py-2.5 text-sm"
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-semibold text-[var(--color-sanaclub-text)]">Hasta</span>
          <input
            type="date"
            value={current.toDate}
            disabled={isLoading}
            onChange={(event) => handleToDateChange(event.target.value)}
            className="w-full rounded-xl border border-[var(--color-sanaclub-border)] px-3 py-2.5 text-sm"
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-semibold text-[var(--color-sanaclub-text)]">Estado</span>
          <select
            value={current.status}
            disabled={isLoading}
            onChange={(event) => handleStatusChange(event.target.value)}
            className="w-full rounded-xl border border-[var(--color-sanaclub-border)] px-3 py-2.5 text-sm"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm">
          <span className="inline-flex items-center gap-2 font-semibold text-[var(--color-sanaclub-text)]">
            <input
              type="checkbox"
              checked={current.includeCancelled}
              disabled={isLoading}
              onChange={(event) => handleIncludeCancelledChange(event.target.checked)}
              className="h-4 w-4 rounded border-[var(--color-sanaclub-border)]"
            />
            Incluir canceladas
          </span>
        </label>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={onClear}
          className="rounded-full border border-[var(--color-sanaclub-coral)] px-4 py-2.5 text-sm font-semibold text-[var(--color-sanaclub-coral-dark)] transition hover:bg-[var(--color-sanaclub-coral)] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isLoading}
        >
          Limpiar filtros
        </button>
      </div>
    </section>
  );
}
