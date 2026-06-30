import { useNavigate } from "react-router-dom";
import { AccessDeniedState } from "../../../shared/components/AccessDeniedState";
import { LoadingState } from "../../../shared/components/LoadingState";
import { PageHeader } from "../../../shared/components/PageHeader";
import { usePermissions } from "../../auth/hooks/usePermissions";
import { PatientForm } from "../components/PatientForm";
import { useCreatePatient } from "../hooks/useCreatePatient";
import { usePatientFormOptions } from "../hooks/usePatientFormOptions";
import { toCreatePatientRequest, type CreatePatientFormValues } from "../schemas/patient.schemas";

export function CreatePatientPage() {
  const navigate = useNavigate();
  const { can } = usePermissions();
  const canCreate = can("patients.create");
  const canReadCatalogs = can("catalogs.read");
  const formOptionsQuery = usePatientFormOptions();
  const createPatientMutation = useCreatePatient();

  const handleSubmit = async (values: CreatePatientFormValues) => {
    const request = toCreatePatientRequest(values);
    await createPatientMutation.mutateAsync(request);
    navigate("/app/patients", { replace: true });
  };

  const handleCancel = () => {
    navigate("/app/patients", { replace: true });
  };

  if (!canCreate || !canReadCatalogs) {
    return (
      <AccessDeniedState
        message="No tienes permisos para crear pacientes o cargar opciones del formulario."
        requiredPermissions={["patients.create", "catalogs.read"]}
      />
    );
  }

  if (formOptionsQuery.isLoading && !formOptionsQuery.data) {
    return <LoadingState message="Cargando opciones del formulario..." />;
  }

  if (formOptionsQuery.isError) {
    return (
      <section className="space-y-4">
        <PageHeader
          title="Crear paciente"
          description="No fue posible cargar los catalogos del formulario."
          breadcrumbs={[
            { label: "Inicio", path: "/app" },
            { label: "Pacientes", path: "/app/patients" },
            { label: "Nuevo paciente" },
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

  if (!formOptionsQuery.data) {
    return null;
  }

  return (
    <section className="space-y-4">
      <PageHeader
        title="Crear paciente"
        description="Completa el formulario para registrar un nuevo paciente."
        breadcrumbs={[
          { label: "Inicio", path: "/app" },
          { label: "Pacientes", path: "/app/patients" },
          { label: "Nuevo paciente" },
        ]}
      />

      <div className="rounded-3xl border border-[var(--color-sanaclub-border)] bg-white p-4 shadow-[0_16px_48px_rgba(36,51,43,0.08)] md:p-6">
        <PatientForm
          formOptions={formOptionsQuery.data}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={createPatientMutation.isPending}
        />
      </div>
    </section>
  );
}
