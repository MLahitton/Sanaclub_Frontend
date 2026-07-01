import { useMemo, useState } from "react";
import type { ComponentProps } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarPlus, List, RefreshCw } from "lucide-react";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { AccessDeniedState } from "../../../shared/components/AccessDeniedState";
import { LoadingState } from "../../../shared/components/LoadingState";
import { PageHeader } from "../../../shared/components/PageHeader";
import type { ApiErrorResponse } from "../../../shared/types/api.types";
import { usePermissions } from "../../auth/hooks/usePermissions";
import { useAppointmentsCalendar } from "../hooks/useAppointmentsCalendar";
import { formatAppointmentTimeRange } from "../utils/appointmentFormatters";
import {
  toDateOnly,
  toInclusiveCalendarEndDate,
} from "../utils/appointmentCalendarDates";
import {
  getCalendarEventStatusLabel,
  toCalendarEvent,
} from "../utils/appointmentCalendarMappers";
import type { AppointmentResponse } from "../types/appointment.types";
import "../styles/appointments-calendar.css";

type FullCalendarDatesSetArg = Parameters<
  NonNullable<ComponentProps<typeof FullCalendar>["datesSet"]>
>[0];
type FullCalendarEventClickArg = Parameters<
  NonNullable<ComponentProps<typeof FullCalendar>["eventClick"]>
>[0];
type FullCalendarEventContentArg = Parameters<
  Extract<NonNullable<ComponentProps<typeof FullCalendar>["eventContent"]>, (...args: never[]) => unknown>
>[0];

const CALENDAR_LEGEND = [
  {
    label: "Programada",
    className: "bg-[#DFA889]/55 border-[#DFA889]",
  },
  {
    label: "Confirmada",
    className: "bg-[var(--color-sanaclub-green)]/35 border-[var(--color-sanaclub-green)]",
  },
  {
    label: "Cancelada",
    className: "bg-[var(--color-sanaclub-coral)]/35 border-[var(--color-sanaclub-coral)]",
  },
] as const;

function getCalendarErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const response = error.response?.data as ApiErrorResponse | undefined;

    if (response?.message && response.message.trim().length > 0) {
      return response.message;
    }
  }

  return "No fue posible cargar las citas del calendario.";
}

function formatRangeSummary(fromDate?: string, toDate?: string): string {
  if (!fromDate || !toDate) {
    return "Preparando rango visible...";
  }

  return `${fromDate} a ${toDate}`;
}

function renderCalendarEventContent(eventInfo: FullCalendarEventContentArg) {
  const appointment = eventInfo.event.extendedProps.appointment as AppointmentResponse | undefined;
  const statusLabel =
    (eventInfo.event.extendedProps.statusLabel as string | undefined) ??
    (appointment ? getCalendarEventStatusLabel(appointment) : "Sin estado");
  const timeLabel = appointment
    ? formatAppointmentTimeRange(appointment.startTime, appointment.endTime)
    : eventInfo.timeText;

  return (
    <div className="min-w-0 space-y-0.5 px-1 py-0.5 leading-tight">
      <p className="truncate text-[0.72rem] font-black">{appointment?.patientFullName ?? eventInfo.event.title}</p>
      <p className="truncate text-[0.68rem] font-semibold opacity-85">{timeLabel}</p>
      <p className="truncate text-[0.66rem] font-semibold opacity-80">{statusLabel}</p>
    </div>
  );
}

export function AppointmentsCalendarPage() {
  const { can } = usePermissions();
  const navigate = useNavigate();
  const canRead = can("appointments.read");
  const canCreate = can("appointments.create");

  const [includeCancelled, setIncludeCancelled] = useState(false);
  const [visibleRange, setVisibleRange] = useState<{
    fromDate?: string;
    toDate?: string;
  }>({});

  const appointmentsQuery = useAppointmentsCalendar({
    fromDate: visibleRange.fromDate,
    toDate: visibleRange.toDate,
    includeCancelled,
  });

  const appointments = useMemo(
    () => appointmentsQuery.data?.items ?? [],
    [appointmentsQuery.data?.items],
  );
  const events = useMemo(() => appointments.map(toCalendarEvent), [appointments]);
  const rangeSummary = formatRangeSummary(visibleRange.fromDate, visibleRange.toDate);
  const isInitialLoading = appointmentsQuery.isLoading && !appointmentsQuery.data;
  const hasEmptyRange =
    !appointmentsQuery.isLoading &&
    !appointmentsQuery.isError &&
    Boolean(visibleRange.fromDate && visibleRange.toDate) &&
    events.length === 0;

  if (!canRead) {
    return (
      <AccessDeniedState
        message="No tienes permisos para ver el calendario de citas."
        requiredPermissions={["appointments.read"]}
      />
    );
  }

  const handleDatesSet = (dateInfo: FullCalendarDatesSetArg) => {
    setVisibleRange({
      fromDate: toDateOnly(dateInfo.start),
      toDate: toInclusiveCalendarEndDate(dateInfo.end),
    });
  };

  const handleEventClick = (eventInfo: FullCalendarEventClickArg) => {
    if (eventInfo.event.id) {
      navigate(`/app/appointments/${eventInfo.event.id}`);
    }
  };

  return (
    <section className="space-y-5">
      <PageHeader
        title="Calendario de citas"
        description="Visualiza la agenda clínica por mes, semana o día."
        breadcrumbs={[
          { label: "Inicio", path: "/app" },
          { label: "Agenda", path: "/app/appointments" },
          { label: "Calendario" },
        ]}
      />

      <div className="flex flex-col gap-3 rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-4 shadow-[0_12px_35px_rgba(36,51,43,0.06)] lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-sanaclub-green-dark)]">
            Rango visible
          </p>
          <p className="mt-1 text-sm text-[var(--color-sanaclub-muted)]">{rangeSummary}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex items-center gap-2 rounded-full border border-[var(--color-sanaclub-border)] bg-[var(--color-sanaclub-bg)] px-4 py-2 text-sm font-semibold text-[var(--color-sanaclub-text)]">
            <input
              type="checkbox"
              checked={includeCancelled}
              onChange={(event) => setIncludeCancelled(event.target.checked)}
              className="h-4 w-4 accent-[var(--color-sanaclub-green)]"
            />
            Incluir canceladas
          </label>

          <button
            type="button"
            onClick={() => navigate("/app/appointments")}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-sanaclub-border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-sanaclub-text)] transition hover:border-[var(--color-sanaclub-green)] hover:text-[var(--color-sanaclub-green-dark)]"
          >
            <List className="h-4 w-4" />
            Vista lista
          </button>

          {canCreate ? (
            <button
              type="button"
              onClick={() => navigate("/app/appointments/new")}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-sanaclub-green)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-sanaclub-green-dark)]"
            >
              <CalendarPlus className="h-4 w-4" />
              Nueva cita
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-3 rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-4 shadow-[0_12px_35px_rgba(36,51,43,0.06)] md:grid-cols-[1fr_auto] md:items-center">
        <div className="flex flex-wrap items-center gap-2">
          {CALENDAR_LEGEND.map((item) => (
            <span
              key={item.label}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-sanaclub-border)] bg-[var(--color-sanaclub-bg)] px-3 py-1.5 text-xs font-semibold text-[var(--color-sanaclub-text)]"
            >
              <span className={`h-3 w-3 rounded-full border-2 ${item.className}`} />
              {item.label}
            </span>
          ))}
        </div>

        <p className="text-sm text-[var(--color-sanaclub-muted)]">
          {appointments.length} cita{appointments.length === 1 ? "" : "s"} en pantalla
        </p>
      </div>

      {isInitialLoading ? <LoadingState message="Cargando calendario de citas..." /> : null}

      {appointmentsQuery.isError ? (
        <article className="rounded-2xl border border-[var(--color-sanaclub-coral)]/30 bg-white p-6 text-center shadow-[0_12px_35px_rgba(36,51,43,0.08)]">
          <h2 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">
            No se pudo cargar el calendario
          </h2>
          <p className="mt-2 text-sm text-[var(--color-sanaclub-muted)]">
            {getCalendarErrorMessage(appointmentsQuery.error)}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => appointmentsQuery.refetch()}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-sanaclub-coral)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-sanaclub-coral-dark)]"
            >
              <RefreshCw className="h-4 w-4" />
              Reintentar
            </button>
            <button
              type="button"
              onClick={() => navigate("/app/appointments")}
              className="inline-flex rounded-full border border-[var(--color-sanaclub-border)] px-5 py-2.5 text-sm font-semibold text-[var(--color-sanaclub-text)] transition hover:border-[var(--color-sanaclub-green)] hover:text-[var(--color-sanaclub-green-dark)]"
            >
              Volver a lista
            </button>
          </div>
        </article>
      ) : null}

      {hasEmptyRange ? (
        <article className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-5 text-center">
          <h2 className="text-base font-semibold text-[var(--color-sanaclub-text)]">
            No hay citas en el rango seleccionado.
          </h2>
          <p className="mt-2 text-sm text-[var(--color-sanaclub-muted)]">
            Cambia de semana, mes o día para consultar otro bloque de agenda.
          </p>
        </article>
      ) : null}

      <article className="sanaclub-calendar-shell rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-3 shadow-[0_12px_35px_rgba(36,51,43,0.08)] md:p-5">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          buttonText={{
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
          }}
          events={events}
          datesSet={handleDatesSet}
          eventClick={handleEventClick}
          eventContent={renderCalendarEventContent}
          height="auto"
          nowIndicator
          slotMinTime="06:00:00"
          slotMaxTime="20:00:00"
          allDaySlot={false}
          editable={false}
          selectable={false}
          eventStartEditable={false}
          eventDurationEditable={false}
        />
      </article>
    </section>
  );
}
