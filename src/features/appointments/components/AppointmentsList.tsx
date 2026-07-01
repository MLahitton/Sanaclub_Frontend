import { AppointmentActionsMenu } from "./AppointmentActionsMenu";
import { AppointmentReferenceBadge } from "./AppointmentReferenceBadge";
import { AppointmentStatusBadge } from "./AppointmentStatusBadge";
import type { AppointmentResponse } from "../types/appointment.types";
import {
  formatAppointmentDate,
  formatAppointmentTimeRange,
  formatOptionalAppointmentText,
  isAppointmentCancelled,
  isAppointmentConfirmed,
  isAppointmentScheduled,
} from "../utils/appointmentFormatters";

type AppointmentsListProps = {
  appointments: AppointmentResponse[];
  canRead: boolean;
  canUpdate: boolean;
  canConfirm: boolean;
  canCancel: boolean;
};

export function AppointmentsList({
  appointments,
  canRead,
  canUpdate,
  canConfirm,
  canCancel,
}: AppointmentsListProps) {
  return (
    <section className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-[var(--color-sanaclub-border)] bg-white">
        <div className="hidden overflow-x-auto lg:block">
          <table className="min-w-full divide-y divide-[var(--color-sanaclub-border)] text-sm">
            <thead className="bg-[var(--color-sanaclub-bg)] text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Fecha</th>
                <th className="px-4 py-3 font-semibold">Hora</th>
                <th className="px-4 py-3 font-semibold">Paciente</th>
                <th className="px-4 py-3 font-semibold">Identificacion</th>
                <th className="px-4 py-3 font-semibold">Terapeuta</th>
                <th className="px-4 py-3 font-semibold">Referencia clinica</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold">Notas</th>
                <th className="px-4 py-3 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-sanaclub-border)]">
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-[var(--color-sanaclub-bg)]">
                  <td className="px-4 py-3">{formatAppointmentDate(appointment.appointmentDate)}</td>
                  <td className="px-4 py-3">
                    {formatAppointmentTimeRange(appointment.startTime, appointment.endTime)}
                  </td>
                  <td className="px-4 py-3">{appointment.patientFullName.trim() || "Sin paciente"}</td>
                  <td className="px-4 py-3">
                    {appointment.patientIdentificationNumber?.trim() || "Sin identificacion"}
                  </td>
                  <td className="px-4 py-3">{appointment.therapistFullName?.trim() || "Sin terapeuta"}</td>
                  <td className="px-4 py-3">
                    <AppointmentReferenceBadge appointment={appointment} />
                  </td>
                  <td className="px-4 py-3">
                    <AppointmentStatusBadge appointment={appointment} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[var(--color-sanaclub-muted)]">
                      {formatOptionalAppointmentText(appointment.notes)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <AppointmentActionsMenu
                      appointment={appointment}
                      canRead={canRead}
                      canUpdate={canUpdate}
                      canConfirm={canConfirm}
                      canCancel={canCancel}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 p-3 lg:hidden">
          {appointments.map((appointment) => (
            <article
              key={appointment.id}
              className="rounded-xl border border-[var(--color-sanaclub-border)] bg-[var(--color-sanaclub-bg)] p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">
                    {formatAppointmentDate(appointment.appointmentDate)} -{" "}
                    {formatAppointmentTimeRange(appointment.startTime, appointment.endTime)}
                  </p>
                  <p className="text-sm text-[var(--color-sanaclub-text)]">
                    {appointment.patientFullName?.trim() || "Sin paciente"}
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-sanaclub-muted)]">
                    {appointment.patientIdentificationNumber?.trim() || "Sin identificacion"}
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-sanaclub-muted)]">
                    {appointment.therapistFullName?.trim() || "Sin terapeuta"}
                  </p>
                </div>
                <div className="space-y-1">
                  <AppointmentStatusBadge appointment={appointment} />
                  <AppointmentReferenceBadge appointment={appointment} />
                </div>
              </div>

              <p className="mt-3 text-xs text-[var(--color-sanaclub-muted)]">
                {formatOptionalAppointmentText(appointment.notes)}
              </p>

              <div className="mt-3">
                <AppointmentActionsMenu
                  appointment={appointment}
                  canRead={canRead}
                  canUpdate={canUpdate}
                  canConfirm={canConfirm}
                  canCancel={canCancel}
                />
              </div>

              <div className="mt-3 text-xs text-[var(--color-sanaclub-muted)]">
                <span className="font-semibold">Agenda:</span>{" "}
                {isAppointmentScheduled(appointment)
                  ? "programada"
                  : isAppointmentConfirmed(appointment)
                    ? "confirmada"
                    : isAppointmentCancelled(appointment)
                      ? "cancelada"
                      : "estado variable"}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
