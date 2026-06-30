import { AxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AccessDeniedState } from "../../../shared/components/AccessDeniedState";
import { LoadingState } from "../../../shared/components/LoadingState";
import { PageHeader } from "../../../shared/components/PageHeader";
import { usePermissions } from "../../auth/hooks/usePermissions";
import { PatientForm } from "../components/PatientForm";
import { useUpdatePatient } from "../hooks/useUpdatePatient";
import { usePatient } from "../hooks/usePatient";
import { usePatientFormOptions } from "../hooks/usePatientFormOptions";
import { toPatientFormValues, toUpdatePatientRequest, type CreatePatientFormValues } from "../schemas/patient.schemas";

function getEditPatientErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.response?.status === 404) {
      return "Paciente no encontrado";
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "No fue posible cargar el paciente para editar.";
}

export function EditPatientPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { can } = usePermissions();

  const canUpdate = can("patients.update");
  const canReadCatalogs = can("catalogs.read");
  const patientId = id?.trim();

  const patientQuery = usePatient(patientId);
  const formOptionsQuery = usePatientFormOptions();
  const updatePatientMutation = useUpdatePatient();

  const handleSubmit = async (values: CreatePatientFormValues) => {
    if (!patientId || !patientQuery.data) {
      return;
    }

    const request = toUpdatePatientRequest(values);
    await updatePatientMutation.mutateAsync({
      patientId: patientQuery.data.id,
      request,
    });

    navigate(`/app/patients/${patientQuery.data.id}`, { replace: true });
  };

  const handleCancel = () => {
    if (patientId) {
      navigate(`/app/patients/${patientId}`, { replace: true });
      return;
    }

    navigate("/app/patients");
  };

  if (!canUpdate || !canReadCatalogs) {
    return (
      <AccessDeniedState
        message="No tienes permisos para editar pacientes o cargar opciones del formulario."
        requiredPermissions={["patients.update", "catalogs.read"]}
      />
    );
  }

  if (!patientId) {
    return (
      <section className="space-y-4">
        <PageHeader
          title="Paciente no válido"
          breadcrumbs={[
            { label: "Inicio", path: "/app" },
            { label: "Pacientes", path: "/app/patients" },
            { label: "Editar paciente" },
          ]}
        />

        <article className="rounded-2xl border border-[var(--color-sanaclub-coral)]/30 bg-white p-6 text-center shadow-[0_12px_35px_rgba(36,51,43,0.08)]">
          <h2 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">
            Paciente no válido
          </h2>
          <p className="mt-2 text-sm text-[var(--color-sanaclub-muted)]">
            No se identificó un id de paciente correcto en la URL.
          </p>
          <button
            type="button"
            onClick={() => navigate("/app/patients")}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--color-sanaclub-green)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-sanaclub-green-dark)]"
          >
            Volver al listado
          </button>
        </article>
      </section>
    );
  }

  if (patientQuery.isLoading && !formOptionsQuery.data) {
    return <LoadingState message="Cargando datos del paciente..." />;
  }

  if (patientQuery.isError) {
    const message = getEditPatientErrorMessage(patientQuery.error);

    return (
      <section className="space-y-4">
        <PageHeader
          title="Editar paciente"
          description="No fue posible cargar la información del paciente."
          breadcrumbs={[
            { label: "Inicio", path: "/app" },
            { label: "Pacientes", path: "/app/patients" },
            { label: "Editar paciente" },
          ]}
        />

        <article className="rounded-2xl border border-[var(--color-sanaclub-coral)]/30 bg-white p-6 text-center shadow-[0_12px_35px_rgba(36,51,43,0.08)]">
          <h2 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">
            {message}
          </h2>
          <p className="mt-2 text-sm text-[var(--color-sanaclub-muted)]">
            Revisa el identificador o vuelve a intentarlo.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => void patientQuery.refetch()}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-sanaclub-coral)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-sanaclub-coral-dark)]"
            >
              Reintentar
            </button>
            <button
              type="button"
              onClick={() => navigate("/app/patients")}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-sanaclub-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-sanaclub-text)] transition hover:border-[var(--color-sanaclub-green)] hover:text-[var(--color-sanaclub-green)]"
            >
              Volver al listado
            </button>
          </div>
        </article>
      </section>
    );
  }

  if (formOptionsQuery.isLoading && !formOptionsQuery.data) {
    return <LoadingState message="Cargando opciones del formulario..." />;
  }

  if (formOptionsQuery.isError) {
    return (
      <section className="space-y-4">
        <PageHeader
          title="Editar paciente"
          description="No fue posible cargar los catalogos del formulario."
          breadcrumbs={[
            { label: "Inicio", path: "/app" },
            { label: "Pacientes", path: "/app/patients" },
            { label: "Editar paciente" },
          ]}
        />

        <article className="rounded-2xl border border-[var(--color-sanaclub-coral)]/30 bg-white p-6 text-center shadow-[0_12px_35px_rgba(36,51,43,0.08)]">
          <h2 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">
            No se pudieron cargar las opciones
          </h2>
          <p className="mt-2 text-sm text-[var(--color-sanaclub-muted)]">
            Ocurrio un error al consultar los catalogos del formulario.
          </p>
          <button
            type="button"
            onClick={() => formOptionsQuery.refetch()}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--color-sanaclub-coral)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-sanaclub-coral-dark)]"
          >
            Reintentar
          </button>
        </article>
      </section>
    );
  }

  if (!patientQuery.data || !formOptionsQuery.data) {
    return null;
  }

  return (
    <section className="space-y-4">
      <PageHeader
        title="Editar paciente"
        description={`Actualiza la información del paciente ${patientQuery.data.identificationNumber}.`}
        breadcrumbs={[
          { label: "Inicio", path: "/app" },
          { label: "Pacientes", path: "/app/patients" },
          { label: "Editar paciente" },
        ]}
      />

      <div className="rounded-3xl border border-[var(--color-sanaclub-border)] bg-white p-4 shadow-[0_16px_48px_rgba(36,51,43,0.08)] md:p-6">
        <PatientForm
          formOptions={formOptionsQuery.data}
          defaultValues={toPatientFormValues(patientQuery.data)}
          mode="edit"
          submitLabel="Actualizar paciente"
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={updatePatientMutation.isPending}
        />
      </div>
    </section>
  );
}
