import { AxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AccessDeniedState } from "../../../shared/components/AccessDeniedState";
import { LoadingState } from "../../../shared/components/LoadingState";
import { PageHeader } from "../../../shared/components/PageHeader";
import type { ApiErrorResponse } from "../../../shared/types/api.types";
import { usePermissions } from "../../auth/hooks/usePermissions";
import { EditAppointmentForm } from "../components/EditAppointmentForm";
import { formatAppointmentStatus, formatAppointmentTimeRange, isAppointmentCancelled, toTimeInputValue } from "../utils/appointmentFormatters";
import { useAppointment } from "../hooks/useAppointment";
import { useAppointmentTherapists } from "../hooks/useAppointmentTherapists";
import { useUpdateAppointment } from "../hooks/useUpdateAppointment";
import {
  toUpdateAppointmentRequest,
  type UpdateAppointmentFormValues,
} from "../schemas/appointment.schemas";

function getAppointmentErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.response?.status === 404) {
      return "La cita no fue encontrada.";
    }

    if (error.response?.status === 403) {
      return "No tienes permisos para ver esta cita.";
    }

    const response = error.response?.data as ApiErrorResponse | undefined;
    if (response?.message && response.message.trim().length > 0) {
      return response.message;
    }

    if (error.message) {
      return error.message;
    }
  }

  return "No fue posible cargar la información de la cita.";
}

export function EditAppointmentPage() {
  const navigate = useNavigate();
  const params = useParams<{ appointmentId: string }>();
  const normalizedAppointmentId = params.appointmentId?.trim();
  const { can } = usePermissions();

  const canRead = can("appointments.read");
  const canUpdate = can("appointments.update");

  const appointmentQuery = useAppointment(normalizedAppointmentId);
  const therapistsQuery = useAppointmentTherapists({ enabled: Boolean(normalizedAppointmentId) });
  const updateAppointmentMutation = useUpdateAppointment();

  if (!canRead || !canUpdate) {
    return (
      <AccessDeniedState
        message="No tienes permisos para editar esta cita."
        requiredPermissions={["appointments.read", "appointments.update"]}
      />
    );
  }

  if (!normalizedAppointmentId) {
    return <AccessDeniedState message="No se identificó la cita en la URL." />;
  }

  const isLoading =
    (appointmentQuery.isLoading && !appointmentQuery.data) ||
    (therapistsQuery.isLoading && !therapistsQuery.data && !therapistsQuery.isError);

  if (isLoading) {
    return <LoadingState message="Cargando información para editar la cita..." />;
  }

  if (appointmentQuery.isError) {
    return (
      <section className="space-y-4">
        <PageHeader
          title="Editar cita"
          description="Actualiza los datos de agenda permitidos."
          breadcrumbs={[
            { label: "Inicio", path: "/app" },
            { label: "Agenda", path: "/app/appointments" },
            { label: "Editar cita" },
          ]}
        />

        <article className="rounded-2xl border border-[var(--color-sanaclub-coral)]/30 bg-white p-6 text-center shadow-[0_12px_35px_rgba(36,51,43,0.08)]">
          <h2 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">
            No fue posible cargar la cita
          </h2>
          <p className="mt-2 text-sm text-[var(--color-sanaclub-muted)]">
            {getAppointmentErrorMessage(appointmentQuery.error)}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => appointmentQuery.refetch()}
              className="rounded-full bg-[var(--color-sanaclub-coral)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-sanaclub-coral-dark)]"
            >
              Reintentar
            </button>
            <button
              type="button"
              onClick={() => navigate(`/app/appointments/${encodeURIComponent(normalizedAppointmentId)}`)}
              className="rounded-full border border-[var(--color-sanaclub-border)] px-5 py-2.5 text-sm font-semibold text-[var(--color-sanaclub-text)] transition hover:border-[var(--color-sanaclub-green)] hover:text-[var(--color-sanaclub-green)]"
            >
              Volver al detalle
            </button>
          </div>
        </article>
      </section>
    );
  }

  if (therapistsQuery.isError) {
    return (
      <section className="space-y-4">
        <PageHeader
          title="Editar cita"
          description="Actualiza los datos de agenda permitidos."
          breadcrumbs={[
            { label: "Inicio", path: "/app" },
            { label: "Agenda", path: "/app/appointments" },
            { label: "Editar cita" },
          ]}
        />

        <article className="rounded-2xl border border-[var(--color-sanaclub-coral)]/30 bg-white p-6 text-center shadow-[0_12px_35px_rgba(36,51,43,0.08)]">
          <h2 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">
            No fue posible cargar las terapeutas disponibles.
          </h2>
          <p className="mt-2 text-sm text-[var(--color-sanaclub-muted)]">
            Verifica tu sesión o intenta nuevamente.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => therapistsQuery.refetch()}
              className="rounded-full bg-[var(--color-sanaclub-coral)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-sanaclub-coral-dark)]"
            >
              Reintentar
            </button>
            <button
              type="button"
              onClick={() => navigate(`/app/appointments/${encodeURIComponent(normalizedAppointmentId)}`)}
              className="rounded-full border border-[var(--color-sanaclub-border)] px-5 py-2.5 text-sm font-semibold text-[var(--color-sanaclub-text)] transition hover:border-[var(--color-sanaclub-green)] hover:text-[var(--color-sanaclub-green)]"
            >
              Volver al detalle
            </button>
          </div>
        </article>
      </section>
    );
  }

  const appointment = appointmentQuery.data;
  if (!appointment) {
    return null;
  }

  const isCancelled = isAppointmentCancelled(appointment);
  const hasTherapists = (therapistsQuery.data?.length ?? 0) > 0;
  const hasNoTherapists = !hasTherapists;

  if (isCancelled) {
    return (
      <section className="space-y-4">
        <PageHeader
          title="Editar cita"
          description="Edición segura de agenda permitida solo para citas activas."
          breadcrumbs={[
            { label: "Inicio", path: "/app" },
            { label: "Agenda", path: "/app/appointments" },
            { label: "Editar cita" },
          ]}
        />

        <article className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-6 text-center">
          <h2 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">
            La cita está cancelada
          </h2>
          <p className="mt-2 text-sm text-[var(--color-sanaclub-muted)]">
            Las citas canceladas no pueden editarse.
          </p>
          <button
            type="button"
            onClick={() => navigate(`/app/appointments/${encodeURIComponent(normalizedAppointmentId)}`)}
            className="mt-4 rounded-full bg-[var(--color-sanaclub-green)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-sanaclub-green-dark)]"
          >
            Volver al detalle
          </button>
        </article>
      </section>
    );
  }

  if (hasNoTherapists) {
    return (
      <section className="space-y-4">
        <PageHeader
          title="Editar cita"
          description="Actualiza los datos de agenda permitidos."
          breadcrumbs={[
            { label: "Inicio", path: "/app" },
            { label: "Agenda", path: "/app/appointments" },
            { label: "Editar cita" },
          ]}
        />

        <article className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-6 text-center">
          <h2 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">
            No hay terapeutas activas disponibles para editar esta cita.
          </h2>
          <button
            type="button"
            onClick={() => navigate(`/app/appointments/${encodeURIComponent(normalizedAppointmentId)}`)}
            className="mt-4 rounded-full bg-[var(--color-sanaclub-green)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-sanaclub-green-dark)]"
          >
            Volver al detalle
          </button>
        </article>
      </section>
    );
  }

  const defaultValues = {
    therapistUserId: appointment.therapistUserId?.trim() || "",
    appointmentDate: appointment.appointmentDate?.trim() || "",
    startTime: toTimeInputValue(appointment.startTime),
    notes: appointment.notes?.trim() || "",
  } as UpdateAppointmentFormValues;

  const context = {
    patientFullName: appointment.patientFullName?.trim() || "Sin paciente",
    patientIdentificationNumber: appointment.patientIdentificationNumber?.trim() || "Sin identificación",
    clinicalReference: appointment.clinicalReferenceLabel?.trim() || "Sin referencia clínica",
    status: formatAppointmentStatus(appointment),
    currentSchedule: formatAppointmentTimeRange(appointment.startTime, appointment.endTime),
  };

  const handleSubmit = async (values: UpdateAppointmentFormValues) => {
    await updateAppointmentMutation.mutateAsync({
      appointmentId: normalizedAppointmentId,
      request: toUpdateAppointmentRequest(values),
    });
    navigate(`/app/appointments/${encodeURIComponent(normalizedAppointmentId)}`, { replace: true });
  };

  const handleCancel = () => {
    navigate(`/app/appointments/${encodeURIComponent(normalizedAppointmentId)}`, { replace: true });
  };

  return (
    <section className="space-y-4">
      <PageHeader
        title="Editar cita"
        description="Actualiza los datos permitidos manteniendo la referencia clínica y el paciente."
        breadcrumbs={[
          { label: "Inicio", path: "/app" },
          { label: "Agenda", path: "/app/appointments" },
          { label: "Editar cita" },
        ]}
      />

      <EditAppointmentForm
        defaultValues={defaultValues}
        isSubmitting={updateAppointmentMutation.isPending}
        isSubmitDisabled={hasNoTherapists}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        context={context}
      />
    </section>
  );
}
