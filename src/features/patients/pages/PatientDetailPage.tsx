import { AxiosError } from "axios";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingState } from "../../../shared/components/LoadingState";
import { ArchivePatientConfirmDialog } from "../components/ArchivePatientConfirmDialog";
import { PatientTreatmentSheetsSection } from "../../treatment-sheets/components/PatientTreatmentSheetsSection";
import { PatientClinicalTabsPlaceholder } from "../components/PatientClinicalTabsPlaceholder";
import { PatientDetailHeader } from "../components/PatientDetailHeader";
import { PatientInfoCard } from "../components/PatientInfoCard";
import { PatientInfoItem } from "../components/PatientInfoItem";
import { usePermissions } from "../../auth/hooks/usePermissions";
import { useArchivePatient } from "../hooks/useArchivePatient";
import { usePatient } from "../hooks/usePatient";
import { usePatientFormOptions } from "../hooks/usePatientFormOptions";
import {
  calculateAgeFromBirthDate,
  formatPatientBirthDate,
  formatPatientCreatedDate,
  formatPatientFullName,
  resolveCatalogName,
} from "../utils/patientFormatters";
import { PageHeader } from "../../../shared/components/PageHeader";

function getPatientDetailErrorMessage(error: unknown): string {
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

  return "No fue posible cargar el detalle del paciente.";
}

export function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { can } = usePermissions();

  const normalizedId = id?.trim();
  const canEdit = can("patients.update");
  const canArchive = can("patients.archive");
  const patientQuery = usePatient(normalizedId);
  const patientFormOptionsQuery = usePatientFormOptions();
  const archivePatientMutation = useArchivePatient();
  const [patientToArchive, setPatientToArchive] = useState(false);

  const patient = patientQuery.data;

  const catalogFallback = patientFormOptionsQuery.isLoading
    ? "Cargando..."
    : "No disponible";

  const identificationTypeName = patient
    ? resolveCatalogName(
        patientFormOptionsQuery.data?.identificationTypes,
        patient.identificationTypeId,
        catalogFallback,
      )
    : "No disponible";

  const genderName = patient
    ? resolveCatalogName(
        patientFormOptionsQuery.data?.genders,
        patient.genderId,
        catalogFallback,
      )
    : "No disponible";

  const civilStatusName = patient
    ? resolveCatalogName(
        patientFormOptionsQuery.data?.civilStatuses,
        patient.civilStatusId,
        catalogFallback,
      )
    : "No disponible";

  const patientStatusName = patient
    ? resolveCatalogName(
        patientFormOptionsQuery.data?.patientStatuses,
        patient.patientStatusId,
        catalogFallback,
      )
    : "No disponible";

  const handleRetry = () => {
    void patientQuery.refetch();
  };

  const handleBack = () => {
    navigate("/app/patients");
  };

  const handleEdit = () => {
    if (!patient?.id) {
      return;
    }

    navigate(`/app/patients/${patient.id}/edit`);
  };

  const handleArchive = () => {
    if (!patient?.id?.trim() || !patient.isActive) {
      return;
    }

    setPatientToArchive(true);
  };

  const handleArchiveCancel = () => {
    if (archivePatientMutation.isPending) {
      return;
    }

    setPatientToArchive(false);
  };

  const handleArchiveConfirm = async () => {
    if (!patient?.id?.trim() || !patientToArchive) {
      return;
    }

    try {
      await archivePatientMutation.mutateAsync({ patientId: patient.id });
      setPatientToArchive(false);
    } catch {
      // error is managed in hook toasts
    }
  };

  const contentTitle = useMemo(() => {
    if (!patient) {
      return "Detalle del paciente";
    }

    return formatPatientFullName(patient);
  }, [patient]);

  if (!normalizedId) {
    return (
      <section className="space-y-4">
        <PageHeader
          title="Paciente no válido"
          breadcrumbs={[
            { label: "Inicio", path: "/app" },
            { label: "Pacientes", path: "/app/patients" },
            { label: "Detalle" },
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
            onClick={handleBack}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--color-sanaclub-green)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-sanaclub-green-dark)]"
          >
            Volver al listado
          </button>
        </article>
      </section>
    );
  }

  if (patientQuery.isLoading) {
    return <LoadingState message="Cargando detalle del paciente..." />;
  }

  if (patientQuery.isError) {
    const message = getPatientDetailErrorMessage(patientQuery.error);
    const isNotFound = message === "Paciente no encontrado";

    return (
      <section className="space-y-4">
        <PageHeader
          title="Detalle del paciente"
          breadcrumbs={[
            { label: "Inicio", path: "/app" },
            { label: "Pacientes", path: "/app/patients" },
            { label: "Detalle" },
          ]}
        />
        <article className="rounded-2xl border border-[var(--color-sanaclub-coral)]/30 bg-white p-6 text-center shadow-[0_12px_35px_rgba(36,51,43,0.08)]">
          <h2 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">
            {isNotFound ? "Paciente no encontrado" : "No fue posible cargar el paciente"}
          </h2>
          <p className="mt-2 text-sm text-[var(--color-sanaclub-muted)]">{message}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-sanaclub-coral)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-sanaclub-coral-dark)]"
            >
              Reintentar
            </button>
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-sanaclub-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-sanaclub-text)] transition hover:border-[var(--color-sanaclub-green)] hover:text-[var(--color-sanaclub-green)]"
            >
              Volver al listado
            </button>
          </div>
        </article>
      </section>
    );
  }

  if (!patient) {
    return (
      <section className="space-y-4">
        <PageHeader
          title="Paciente no encontrado"
          breadcrumbs={[
            { label: "Inicio", path: "/app" },
            { label: "Pacientes", path: "/app/patients" },
            { label: "Detalle" },
          ]}
        />
        <article className="rounded-2xl border border-[var(--color-sanaclub-coral)]/30 bg-white p-6 text-center shadow-[0_12px_35px_rgba(36,51,43,0.08)]">
          <h2 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">
            No se encontró información del paciente
          </h2>
          <p className="mt-2 text-sm text-[var(--color-sanaclub-muted)]">
            Intenta con otro paciente o vuelve al listado.
          </p>
          <button
            type="button"
            onClick={handleBack}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--color-sanaclub-green)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-sanaclub-green-dark)]"
          >
            Volver al listado
          </button>
        </article>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <PageHeader
        title={contentTitle}
        description={`ID: ${patient.id}`}
        breadcrumbs={[
          { label: "Inicio", path: "/app" },
          { label: "Pacientes", path: "/app/patients" },
          { label: "Detalle" },
        ]}
      />

      <PatientDetailHeader
        patient={patient}
        identificationTypeLabel={identificationTypeName}
        canEdit={canEdit}
        canArchive={canArchive}
        onEdit={handleEdit}
        onArchive={handleArchive}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <PatientInfoCard title="Identificación">
          <PatientInfoItem
            label="Tipo de identificación"
            value={identificationTypeName}
          />
          <PatientInfoItem
            label="Número de identificación"
            value={patient.identificationNumber}
          />
          <PatientInfoItem
            label="Nombre completo"
            value={formatPatientFullName(patient)}
          />
          <PatientInfoItem label="Estado" value={patient.isActive ? "Activo" : "Archivado"} />
        </PatientInfoCard>

        <PatientInfoCard title="Información personal">
          <PatientInfoItem
            label="Fecha de nacimiento"
            value={formatPatientBirthDate(patient.birthDate ?? null)}
          />
          <PatientInfoItem
            label="Edad"
            value={calculateAgeFromBirthDate(patient.birthDate ?? null)}
          />
          <PatientInfoItem label="Género" value={genderName} />
          <PatientInfoItem label="Estado civil" value={civilStatusName} />
          <PatientInfoItem label="Estado del paciente" value={patientStatusName} />
        </PatientInfoCard>

        <PatientInfoCard title="Contacto">
          <PatientInfoItem label="Teléfono" value={patient.phoneNumber} />
          <PatientInfoItem label="Correo electrónico" value={patient.email} />
          <PatientInfoItem label="Dirección" value={patient.address} />
        </PatientInfoCard>

        <PatientInfoCard title="Ubicación">
          <PatientInfoItem label="Ciudad o municipio" value={patient.cityOrMunicipality} />
        </PatientInfoCard>

        <PatientInfoCard title="Información adicional">
          <PatientInfoItem label="Ocupación" value={patient.occupation} />
          <PatientInfoItem
            label="Fecha de creación"
            value={formatPatientCreatedDate(patient.createdAtUtc)}
          />
        </PatientInfoCard>

        <PatientInfoCard title="Contacto de emergencia">
          <PatientInfoItem label="Nombre" value={patient.emergencyContactName} />
          <PatientInfoItem label="Relación" value={patient.emergencyContactRelationship} />
          <PatientInfoItem label="Teléfono" value={patient.emergencyContactPhone} />
        </PatientInfoCard>
      </div>

      <PatientTreatmentSheetsSection patientId={patient.id} />

      <PatientClinicalTabsPlaceholder />

      <ArchivePatientConfirmDialog
        open={patientToArchive}
        patientName={patient.fullName}
        isSubmitting={archivePatientMutation.isPending}
        onConfirm={handleArchiveConfirm}
        onCancel={handleArchiveCancel}
      />
    </section>
  );
}
