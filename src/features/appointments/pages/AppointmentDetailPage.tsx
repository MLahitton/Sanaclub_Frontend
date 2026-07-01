import { AxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AccessDeniedState } from "../../../shared/components/AccessDeniedState";
import { LoadingState } from "../../../shared/components/LoadingState";
import { PageHeader } from "../../../shared/components/PageHeader";
import type { ApiErrorResponse } from "../../../shared/types/api.types";
import { usePermissions } from "../../auth/hooks/usePermissions";
import { AppointmentClinicalReferenceCard } from "../components/AppointmentClinicalReferenceCard";
import { AppointmentDetailHeader } from "../components/AppointmentDetailHeader";
import { AppointmentMainInfoCard } from "../components/AppointmentMainInfoCard";
import { AppointmentMetadataCard } from "../components/AppointmentMetadataCard";
import { AppointmentNotesCard } from "../components/AppointmentNotesCard";
import { AppointmentPatientCard } from "../components/AppointmentPatientCard";
import { AppointmentTherapistCard } from "../components/AppointmentTherapistCard";
import { getClinicalReferenceKind } from "../utils/appointmentFormatters";
import { useAppointment } from "../hooks/useAppointment";

function getAppointmentDetailErrorMessage(error: unknown): string {
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
  }

  return "No fue posible cargar la cita. Revisa la conexión o intenta nuevamente.";
}

function resolveClinicalReferencePath(
  clinicalReferenceType: string,
  clinicalReferenceId: string,
  canReadTreatments: boolean,
  canReadEvolutions: boolean,
): string | null {
  const hasReferenceId = Boolean(clinicalReferenceId?.trim());

  if (!hasReferenceId) {
    return null;
  }

  const normalizedType = clinicalReferenceType?.trim().toLowerCase() ?? "";

  if (
    (normalizedType.includes("treatment") ||
      normalizedType.includes("treatment_sheet") ||
      normalizedType.includes("treatmentsheet")) &&
    canReadTreatments
  ) {
    return `/app/treatment-sheets/${encodeURIComponent(clinicalReferenceId.trim())}`;
  }

  if (
    (normalizedType.includes("evolution") ||
      normalizedType.includes("evolution_sheet") ||
      normalizedType.includes("evolutionsheet")) &&
    canReadEvolutions
  ) {
    return `/app/evolution-sheets/${encodeURIComponent(clinicalReferenceId.trim())}`;
  }

  return null;
}

export function AppointmentDetailPage() {
  const params = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const normalizedAppointmentId = params.appointmentId?.trim();
  const { can } = usePermissions();

  const appointmentQuery = useAppointment(normalizedAppointmentId);
  const canReadPatient = can("patients.read");
  const canUpdate = can("appointments.update");
  const canConfirm = can("appointments.confirm");
  const canCancel = can("appointments.cancel");
  const canReadTreatments = can("treatments.read");
  const canReadEvolutions = can("evolutions.read");

  const handleBackToAgenda = () => {
    navigate("/app/appointments", { replace: true });
  };

  const handleViewPatient = () => {
    const patientId = appointmentQuery.data?.patientId?.trim();

    if (!patientId) {
      return;
    }

    navigate(`/app/patients/${encodeURIComponent(patientId)}`, { replace: true });
  };

  const handleViewClinicalReference = () => {
    const appointment = appointmentQuery.data;

    if (!appointment) {
      return;
    }

    const destination = resolveClinicalReferencePath(
      appointment.clinicalReferenceType,
      appointment.clinicalReferenceId,
      canReadTreatments,
      canReadEvolutions,
    );

    if (!destination) {
      return;
    }

    navigate(destination, { replace: true });
  };

  if (!normalizedAppointmentId) {
    return <AccessDeniedState message="No se identificó la cita en la URL." />;
  }

  if (appointmentQuery.isLoading && !appointmentQuery.data) {
    return <LoadingState message="Cargando detalle de cita..." />;
  }

  if (appointmentQuery.isError) {
    const message = getAppointmentDetailErrorMessage(appointmentQuery.error);

    return (
      <section className="space-y-4">
        <PageHeader
          title="Detalle de cita"
          description="No fue posible cargar la información solicitada."
          breadcrumbs={[
            { label: "Inicio", path: "/app" },
            { label: "Agenda", path: "/app/appointments" },
            { label: "Detalle de cita" },
          ]}
        />

        <article className="rounded-2xl border border-[var(--color-sanaclub-coral)]/30 bg-white p-6 text-center shadow-[0_12px_35px_rgba(36,51,43,0.08)]">
          <h2 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">
            No fue posible cargar la cita
          </h2>
          <p className="mt-2 text-sm text-[var(--color-sanaclub-muted)]">{message}</p>
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
              onClick={() => navigate("/app/appointments", { replace: true })}
              className="rounded-full border border-[var(--color-sanaclub-border)] px-5 py-2.5 text-sm font-semibold text-[var(--color-sanaclub-text)] transition hover:border-[var(--color-sanaclub-green)] hover:text-[var(--color-sanaclub-green)]"
            >
              Volver a agenda
            </button>
          </div>
        </article>
      </section>
    );
  }

  if (!appointmentQuery.data) {
    return null;
  }

  const appointment = appointmentQuery.data;
  const clinicalReferenceTypeKind = getClinicalReferenceKind(appointment);
  const isClinicalReferenceTypeSupported =
    clinicalReferenceTypeKind === "treatment" || clinicalReferenceTypeKind === "evolution";
  const clinicalReferencePath = resolveClinicalReferencePath(
    appointment.clinicalReferenceType,
    appointment.clinicalReferenceId,
    canReadTreatments,
    canReadEvolutions,
  );

  return (
    <section className="space-y-5">
      <PageHeader
        title="Detalle de cita"
        description="Consulta la información de agenda, paciente, terapeuta y referencia clínica."
        breadcrumbs={[
          { label: "Inicio", path: "/app" },
          { label: "Agenda", path: "/app/appointments" },
          { label: "Detalle de cita" },
        ]}
      />

      <AppointmentDetailHeader
        appointment={appointment}
        onBackToAgenda={handleBackToAgenda}
        onViewPatient={canReadPatient ? handleViewPatient : undefined}
        onViewClinicalReference={clinicalReferencePath ? handleViewClinicalReference : undefined}
        canUpdate={canUpdate}
        canConfirm={canConfirm}
        canCancel={canCancel}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <AppointmentMainInfoCard appointment={appointment} />
        <AppointmentPatientCard
          appointment={appointment}
          onViewPatient={canReadPatient ? handleViewPatient : undefined}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <AppointmentTherapistCard appointment={appointment} />
        <AppointmentClinicalReferenceCard
          appointment={appointment}
          isNavigableType={isClinicalReferenceTypeSupported}
          onViewClinicalReference={clinicalReferencePath ? handleViewClinicalReference : undefined}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <AppointmentNotesCard appointment={appointment} />
        <AppointmentMetadataCard appointment={appointment} />
      </div>
    </section>
  );
}

