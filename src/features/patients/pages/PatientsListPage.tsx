import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../../shared/components/PageHeader";
import { LoadingState } from "../../../shared/components/LoadingState";
import { usePermissions } from "../../auth/hooks/usePermissions";
import { ArchivePatientConfirmDialog } from "../components/ArchivePatientConfirmDialog";
import { PatientsTable } from "../components/PatientsTable";
import { PatientsToolbar } from "../components/PatientsToolbar";
import type { PatientActiveFilter, PatientResponse } from "../types/patient.types";
import { useArchivePatient } from "../hooks/useArchivePatient";
import { usePatients } from "../hooks/usePatients";

const PAGE_SIZES = [10, 20, 50] as const;

export function PatientsListPage() {
  const { can } = usePermissions();
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<PatientActiveFilter>("all");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [patientToArchive, setPatientToArchive] = useState<PatientResponse | null>(null);

  const query = usePatients({
    search,
    isActive:
      activeFilter === "active"
        ? true
        : activeFilter === "inactive"
          ? false
          : undefined,
    pageNumber,
    pageSize,
  });

  const totalCount = query.data?.totalCount ?? 0;
  const totalPages = Math.max(Math.ceil(totalCount / pageSize), 1);
  const patients = query.data?.items ?? [];

  const canCreate = can("patients.create");
  const canUpdate = can("patients.update");
  const canArchive = can("patients.archive");
  const archivePatientMutation = useArchivePatient();

  const handleApplyFilters = () => {
    setPageNumber(1);
    setSearch(searchInput.trim());
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setSearch("");
    setActiveFilter("all");
    setPageNumber(1);
  };

  const handleFilterChange = (nextFilter: PatientActiveFilter) => {
    setActiveFilter(nextFilter);
    setPageNumber(1);
  };

  const handlePageSizeChange = (nextSize: number) => {
    setPageSize(nextSize);
    setPageNumber(1);
  };

  const handleCreatePatient = () => {
    navigate("/app/patients/new");
  };

  const handleViewPatient = (patient: PatientResponse) => {
    navigate(`/app/patients/${patient.id}`);
  };

  const handleEditPatient = (patient: PatientResponse) => {
    navigate(`/app/patients/${patient.id}/edit`);
  };

  const handleArchivePatient = (patient: PatientResponse) => {
    if (!patient.id.trim() || !patient.isActive) {
      return;
    }

    setPatientToArchive(patient);
  };

  const handleArchiveCancel = () => {
    if (archivePatientMutation.isPending) {
      return;
    }

    setPatientToArchive(null);
  };

  const handleArchiveConfirm = async () => {
    if (!patientToArchive?.id?.trim()) {
      return;
    }

    try {
      await archivePatientMutation.mutateAsync({ patientId: patientToArchive.id });
      setPatientToArchive(null);
    } catch {
      // error is managed in hook toasts
    }
  };

  if (query.isLoading && !query.data) {
    return <LoadingState message="Cargando pacientes..." />;
  }

  return (
    <section className="space-y-4">
      <PageHeader
        title="Pacientes"
        description="Listado interno de pacientes consumiendo GET /api/v1/patients."
        breadcrumbs={[
          { label: "Inicio", path: "/app" },
          { label: "Pacientes" },
        ]}
      />

      <PatientsToolbar
        searchInput={searchInput}
        activeFilter={activeFilter}
        canCreate={canCreate}
        isLoading={query.isFetching}
        onSearchChange={setSearchInput}
        onFilterChange={handleFilterChange}
        onSearchSubmit={handleApplyFilters}
        onClearFilters={handleClearFilters}
        onCreatePatient={handleCreatePatient}
      />

      {query.isError ? (
        <article className="rounded-2xl border border-[var(--color-sanaclub-coral)]/30 bg-white p-6 text-center shadow-[0_12px_35px_rgba(36,51,43,0.08)]">
          <h2 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">
            No se pudo cargar el listado
          </h2>
          <p className="mt-2 text-sm text-[var(--color-sanaclub-muted)]">
            Ocurrio un problema al consultar pacientes. Intenta nuevamente.
          </p>
          <button
            type="button"
            onClick={() => query.refetch()}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--color-sanaclub-coral)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-sanaclub-coral-dark)]"
          >
            Reintentar
          </button>
        </article>
      ) : null}

      {query.isSuccess && patients.length === 0 ? (
        <article className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-8 text-center">
          <h2 className="text-lg font-semibold">No se encontraron pacientes con los filtros actuales.</h2>
          <p className="mt-2 text-sm text-[var(--color-sanaclub-muted)]">
            Puedes ajustar la busqueda o el estado para ver resultados.
          </p>

          {canCreate ? (
            <button
              type="button"
              onClick={handleCreatePatient}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--color-sanaclub-green)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-sanaclub-green-dark)]"
            >
              Crear primer paciente
            </button>
          ) : null}
        </article>
      ) : null}

      {!query.isError && query.data ? (
        <div className="space-y-3">
          <PatientsTable
            patients={patients}
            canEdit={canUpdate}
            canArchive={canArchive}
            onView={handleViewPatient}
            onEdit={handleEditPatient}
            onArchive={handleArchivePatient}
          />

          <div className="flex flex-col gap-3 rounded-2xl border border-[var(--color-sanaclub-border)] bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[var(--color-sanaclub-muted)]">
              Pagina {pageNumber} de {totalPages} · {totalCount} registros
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <label className="text-xs text-[var(--color-sanaclub-muted)]">
                Registros por pagina
                <select
                  value={pageSize}
                  onChange={(event) => handlePageSizeChange(Number(event.target.value))}
                  className="ml-2 rounded-lg border border-[var(--color-sanaclub-border)] px-2 py-1 text-sm"
                >
                  {PAGE_SIZES.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </label>

              <div className="inline-flex rounded-full border border-[var(--color-sanaclub-border)]">
                <button
                  type="button"
                  onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                  disabled={pageNumber <= 1}
                  className="rounded-l-full border-r border-[var(--color-sanaclub-border)] px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPageNumber((prev) => Math.min(prev + 1, totalPages))}
                  disabled={pageNumber >= totalPages}
                  className="rounded-r-full px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <ArchivePatientConfirmDialog
        open={Boolean(patientToArchive)}
        patientName={patientToArchive?.fullName ?? patientToArchive?.identificationNumber ?? ""}
        isSubmitting={archivePatientMutation.isPending}
        onConfirm={handleArchiveConfirm}
        onCancel={handleArchiveCancel}
      />
    </section>
  );
}
