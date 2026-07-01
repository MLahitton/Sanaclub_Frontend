import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { AccessDeniedState } from "../../../shared/components/AccessDeniedState";
import { LoadingState } from "../../../shared/components/LoadingState";
import { PageHeader } from "../../../shared/components/PageHeader";
import type { ApiErrorResponse } from "../../../shared/types/api.types";
import { usePermissions } from "../../auth/hooks/usePermissions";
import { AppointmentsFilters } from "../components/AppointmentsFilters";
import { AppointmentsList } from "../components/AppointmentsList";
import { useAppointments } from "../hooks/useAppointments";
import type { AppointmentListQueryParams } from "../types/appointment.types";

const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

function getAppointmentsErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.response?.status === 403) {
      return "No tienes permisos para ver la agenda.";
    }

    const response = error.response?.data as ApiErrorResponse | undefined;
    if (response?.message && response.message.trim().length > 0) {
      return response.message;
    }
  }

  return "No fue posible cargar las citas. Revisa la conexion o intenta nuevamente.";
}

export function AppointmentsPage() {
  const { can } = usePermissions();
  const navigate = useNavigate();

  const [appointmentsQuery, setAppointmentsQuery] = useState<AppointmentListQueryParams>({
    date: null,
    fromDate: null,
    toDate: null,
    status: null,
    includeCancelled: false,
    pageNumber: 1,
    pageSize: 20,
  });

  const appointmentsResult = useAppointments(appointmentsQuery);
  const appointments = appointmentsResult.data?.items ?? [];
  const totalCount = appointmentsResult.data?.totalCount ?? 0;
  const currentPageNumber = appointmentsQuery.pageNumber ?? 1;
  const currentPageSize = appointmentsQuery.pageSize ?? 20;
  const totalPages = Math.max(
    Math.ceil(totalCount / (appointmentsResult.data?.pageSize ?? currentPageSize)),
    1,
  );

  const canRead = can("appointments.read");
  const canCreate = can("appointments.create");
  const canUpdate = can("appointments.update");
  const canConfirm = can("appointments.confirm");
  const canCancel = can("appointments.cancel");

  if (!canRead) {
    return (
      <AccessDeniedState
        message="No tienes permisos para ver la agenda."
        requiredPermissions={["appointments.read"]}
      />
    );
  }

  const handleFiltersChange = (next: AppointmentListQueryParams) => {
    const normalized: AppointmentListQueryParams = {
      ...next,
      pageNumber: 1,
      pageSize: appointmentsQuery.pageSize,
    };
    setAppointmentsQuery(normalized);
  };

  const handleClearFilters = () => {
    setAppointmentsQuery({
      date: null,
      fromDate: null,
      toDate: null,
      status: null,
      includeCancelled: false,
      pageNumber: 1,
      pageSize: currentPageSize,
    });
  };

  const handleNewAppointment = () => {
    navigate("/app/appointments/new");
  };

  const handleCalendarView = () => {
    navigate("/app/appointments/calendar");
  };

  const handlePageChange = (nextPage: number) => {
    const validPage = Math.max(nextPage, 1);
    if (validPage === currentPageNumber) {
      return;
    }

    setAppointmentsQuery((current) => ({
      ...current,
      pageNumber: validPage,
    }));
  };

  const handlePageSizeChange = (nextSize: number) => {
    setAppointmentsQuery((current) => ({
      ...current,
      pageSize: nextSize,
      pageNumber: 1,
    }));
  };

  if (appointmentsResult.isLoading && !appointmentsResult.data) {
    return <LoadingState message="Cargando agenda..." />;
  }

  return (
    <section className="space-y-4">
      <PageHeader
        title="Agenda"
        description="Consulta las citas programadas, confirmadas y canceladas."
        breadcrumbs={[
          { label: "Inicio", path: "/app" },
          { label: "Agenda" },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleCalendarView}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-sanaclub-border)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-sanaclub-text)] transition hover:border-[var(--color-sanaclub-green)] hover:text-[var(--color-sanaclub-green-dark)]"
        >
          <CalendarDays className="h-4 w-4" />
          Vista calendario
        </button>

        {canCreate ? (
          <button
            type="button"
            onClick={handleNewAppointment}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-sanaclub-green)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-sanaclub-green-dark)]"
          >
            <Plus className="h-4 w-4" />
            Nueva cita
          </button>
        ) : null}
      </div>

      <AppointmentsFilters
        filters={appointmentsQuery}
        isLoading={appointmentsResult.isFetching}
        onChange={handleFiltersChange}
        onClear={handleClearFilters}
      />

      {appointmentsResult.isError ? (
        <article className="rounded-2xl border border-[var(--color-sanaclub-coral)]/30 bg-white p-6 text-center shadow-[0_12px_35px_rgba(36,51,43,0.08)]">
          <h2 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">
            No se pudo cargar la agenda
          </h2>
          <p className="mt-2 text-sm text-[var(--color-sanaclub-muted)]">
            {getAppointmentsErrorMessage(appointmentsResult.error)}
          </p>
          <button
            type="button"
            onClick={() => appointmentsResult.refetch()}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--color-sanaclub-coral)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-sanaclub-coral-dark)]"
          >
            Reintentar
          </button>
        </article>
      ) : null}

      {!appointmentsResult.isError && appointments.length === 0 ? (
        <article className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-6 text-center">
          <h2 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">
            No hay citas para los filtros seleccionados.
          </h2>
          <p className="mt-2 text-sm text-[var(--color-sanaclub-muted)]">
            Ajusta los filtros para cambiar el rango o el estado.
          </p>
        </article>
      ) : null}

      {appointmentsResult.isSuccess && appointments.length > 0 ? (
        <div className="space-y-4">
          <AppointmentsList
            appointments={appointments}
            canRead={canRead}
            canUpdate={canUpdate}
            canConfirm={canConfirm}
            canCancel={canCancel}
          />

          <div className="flex flex-col gap-3 rounded-2xl border border-[var(--color-sanaclub-border)] bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[var(--color-sanaclub-muted)]">
              Pagina {currentPageNumber} de {totalPages} - {totalCount} registros
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <label className="text-xs text-[var(--color-sanaclub-muted)]">
                Registros por pagina
                <select
                  value={currentPageSize}
                  onChange={(event) => handlePageSizeChange(Number(event.target.value))}
                  className="ml-2 rounded-lg border border-[var(--color-sanaclub-border)] px-2 py-1 text-sm"
                >
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </label>

              <div className="inline-flex rounded-full border border-[var(--color-sanaclub-border)]">
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPageNumber - 1)}
                  disabled={currentPageNumber <= 1}
                  className="rounded-l-full border-r border-[var(--color-sanaclub-border)] px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPageNumber + 1)}
                  disabled={currentPageNumber >= totalPages}
                  className="rounded-r-full px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
