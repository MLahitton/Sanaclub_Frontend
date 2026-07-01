import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../../shared/components/PageHeader";
import { LoadingState } from "../../../shared/components/LoadingState";
import { usePermissions } from "../../auth/hooks/usePermissions";
import { AppointmentForm } from "../components/AppointmentForm";
import { useAppointmentTherapists } from "../hooks/useAppointmentTherapists";
import { useCreateAppointment } from "../hooks/useCreateAppointment";
import {
  toCreateAppointmentRequest,
  type CreateAppointmentFormValues,
} from "../schemas/appointment.schemas";

export function CreateAppointmentPage() {
  const navigate = useNavigate();
  const { can } = usePermissions();

  const canCreate = can("appointments.create");
  const canReadPatients = can("patients.read");
  const canLoadTherapists = canCreate && canReadPatients;

  const therapistsQuery = useAppointmentTherapists({ enabled: canLoadTherapists });
  const createAppointmentMutation = useCreateAppointment();

  const hasTherapists = (therapistsQuery.data?.length ?? 0) > 0;
  const isSubmitDisabled =
    !canLoadTherapists || !hasTherapists || createAppointmentMutation.isPending;

  const handleSubmit = async (values: CreateAppointmentFormValues) => {
    try {
      await createAppointmentMutation.mutateAsync(toCreateAppointmentRequest(values));
      navigate("/app/appointments", { replace: true });
    } catch {
      // error handled by hook toasts
    }
  };

  const handleCancel = () => {
    navigate("/app/appointments", { replace: true });
  };

  if (therapistsQuery.isLoading && !therapistsQuery.data) {
    return <LoadingState message="Cargando datos para agendar..." />;
  }

  if (!canLoadTherapists) {
    return (
      <section className="space-y-4">
        <PageHeader
          title="Crear cita"
          description="Agenda una atención para un paciente con documento clínico vigente."
          breadcrumbs={[
            { label: "Inicio", path: "/app" },
            { label: "Agenda", path: "/app/appointments" },
            { label: "Nueva cita" },
          ]}
        />

        <article className="rounded-2xl border border-[var(--color-sanaclub-coral)]/30 bg-white p-6 text-center">
          <h2 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">
            No tienes permisos suficientes para crear una cita.
          </h2>
          <p className="mt-2 text-sm text-[var(--color-sanaclub-muted)]">
            Esta acción requiere permisos de creación de agenda y consulta de pacientes.
          </p>
          <button
            type="button"
            onClick={handleCancel}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--color-sanaclub-green)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-sanaclub-green-dark)]"
          >
            Volver a agenda
          </button>
        </article>
      </section>
    );
  }

  if (therapistsQuery.isError) {
    return (
      <section className="space-y-4">
        <PageHeader
          title="Crear cita"
          description="Agenda una atención para un paciente con documento clínico vigente."
          breadcrumbs={[
            { label: "Inicio", path: "/app" },
            { label: "Agenda", path: "/app/appointments" },
            { label: "Nueva cita" },
          ]}
        />

        <article className="rounded-2xl border border-[var(--color-sanaclub-coral)]/30 bg-white p-6 text-center shadow-[0_12px_35px_rgba(36,51,43,0.08)]">
          <h2 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">
            No fue posible cargar las terapeutas disponibles.
          </h2>
          <button
            type="button"
            onClick={() => therapistsQuery.refetch()}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--color-sanaclub-coral)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-sanaclub-coral-dark)]"
          >
            Reintentar
          </button>
        </article>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <PageHeader
        title="Crear cita"
        description="Agenda una atención para un paciente con documento clínico vigente."
        breadcrumbs={[
          { label: "Inicio", path: "/app" },
          { label: "Agenda", path: "/app/appointments" },
          { label: "Nueva cita" },
        ]}
      />

      {!hasTherapists && !therapistsQuery.isError ? (
        <article className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-4 text-sm text-[var(--color-sanaclub-muted)]">
          No hay terapeutas activas disponibles para agendar citas.
        </article>
      ) : null}

      <AppointmentForm
        isSubmitting={createAppointmentMutation.isPending}
        isSubmitDisabled={isSubmitDisabled}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </section>
  );
}
