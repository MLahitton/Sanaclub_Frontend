import { AxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AccessDeniedState } from "../../../shared/components/AccessDeniedState";
import { LoadingState } from "../../../shared/components/LoadingState";
import { PageHeader } from "../../../shared/components/PageHeader";
import type { ApiErrorResponse } from "../../../shared/types/api.types";
import { EvolutionSheetNewIndicationsForm } from "../components/EvolutionSheetNewIndicationsForm";
import {
  formatEvolutionDate,
  formatEvolutionNumber,
  isEvolutionCompleted,
} from "../utils/evolutionSheetFormatters";
import { useEvolutionSheet } from "../hooks/useEvolutionSheet";
import { useCompleteEvolutionSheetNewIndications } from "../hooks/useCompleteEvolutionSheetNewIndications";
import type {
  CompleteEvolutionSheetNewIndicationsFormValues,
} from "../schemas/evolutionSheet.schemas";
import {
  toCompleteEvolutionSheetNewIndicationsRequest,
} from "../schemas/evolutionSheet.schemas";

function getEvolutionSheetLoadErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.response?.status === 404) {
      return "La hoja de evolución no fue encontrada.";
    }

    if (error.response?.status === 403) {
      return "No tienes permisos para ver esta hoja de evolución.";
    }

    const response = error.response?.data as ApiErrorResponse | undefined;
    if (response?.message) {
      return response.message;
    }
  }

  return "No fue posible cargar la hoja de evolución.";
}

export function CompleteEvolutionSheetNewIndicationsPage() {
  const navigate = useNavigate();
  const { evolutionSheetId } = useParams<{ evolutionSheetId: string }>();
  const normalizedEvolutionSheetId = evolutionSheetId?.trim();

  const evolutionSheetQuery = useEvolutionSheet(normalizedEvolutionSheetId);
  const completeEvolutionSheetNewIndicationsMutation =
    useCompleteEvolutionSheetNewIndications();

  const handleSubmit = async (
    values: CompleteEvolutionSheetNewIndicationsFormValues,
  ) => {
    if (!evolutionSheetQuery.data) {
      return;
    }

    const request = toCompleteEvolutionSheetNewIndicationsRequest(values);

    await completeEvolutionSheetNewIndicationsMutation.mutateAsync({
      evolutionSheetId: evolutionSheetQuery.data.id,
      request,
    });

    navigate(`/app/evolution-sheets/${evolutionSheetQuery.data.id}`, { replace: true });
  };

  const handleCancel = () => {
    if (!normalizedEvolutionSheetId) {
      navigate("/app/patients", { replace: true });
      return;
    }

    navigate(`/app/evolution-sheets/${normalizedEvolutionSheetId}`, { replace: true });
  };

  if (!normalizedEvolutionSheetId) {
    return (
      <AccessDeniedState message="No se identificó la hoja de evolución en la URL." />
    );
  }

  if (evolutionSheetQuery.isLoading && !evolutionSheetQuery.data) {
    return <LoadingState message="Cargando detalle para completar indicaciones..." />;
  }

  if (evolutionSheetQuery.isError) {
    const message = getEvolutionSheetLoadErrorMessage(evolutionSheetQuery.error);

    return (
      <section className="space-y-4">
        <PageHeader
          title="Completar nuevas indicaciones"
          description="No fue posible cargar la hoja de evolución."
          breadcrumbs={[
            { label: "Inicio", path: "/app" },
            { label: "Pacientes", path: "/app/patients" },
            { label: "Detalle de hoja de evolución" },
            { label: "Completar nuevas indicaciones" },
          ]}
        />

        <article className="rounded-2xl border border-[var(--color-sanaclub-coral)]/30 bg-white p-6 text-center shadow-[0_12px_35px_rgba(36,51,43,0.08)]">
          <h2 className="text-lg font-semibold text-[var(--color-sanaclub-text)]">
            No fue posible cargar la hoja
          </h2>
          <p className="mt-2 text-sm text-[var(--color-sanaclub-muted)]">{message}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => evolutionSheetQuery.refetch()}
              className="rounded-full bg-[var(--color-sanaclub-coral)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-sanaclub-coral-dark)]"
            >
              Reintentar
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-full border border-[var(--color-sanaclub-border)] px-5 py-2.5 text-sm font-semibold text-[var(--color-sanaclub-text)] transition hover:border-[var(--color-sanaclub-green)] hover:text-[var(--color-sanaclub-green)]"
            >
              Volver al detalle
            </button>
          </div>
        </article>
      </section>
    );
  }

  if (!evolutionSheetQuery.data) {
    return null;
  }

  const evolutionSheet = evolutionSheetQuery.data;
  const isCompleted = isEvolutionCompleted(evolutionSheet);

  if (!evolutionSheet.isActive) {
    return (
      <section className="space-y-4">
        <PageHeader
          title="Completar nuevas indicaciones"
          description="Esta hoja de evolución está inactiva."
          breadcrumbs={[
            { label: "Inicio", path: "/app" },
            { label: "Pacientes", path: "/app/patients" },
            { label: "Detalle de hoja de evolución" },
            { label: "Completar nuevas indicaciones" },
          ]}
        />
        <article className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-6 text-center shadow-[0_12px_35px_rgba(36,51,43,0.08)]">
          <p className="text-sm text-[var(--color-sanaclub-text)]">
            Esta hoja de evolución está inactiva.
          </p>
          <button
            type="button"
            onClick={handleCancel}
            className="mt-4 inline-flex rounded-full bg-[var(--color-sanaclub-green)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-sanaclub-green-dark)]"
          >
            Volver al detalle de la hoja
          </button>
        </article>
      </section>
    );
  }

  if (isCompleted) {
    return (
      <section className="space-y-4">
        <PageHeader
          title="Completar nuevas indicaciones"
          description="Esta hoja de evolución ya fue completada."
          breadcrumbs={[
            { label: "Inicio", path: "/app" },
            { label: "Pacientes", path: "/app/patients" },
            { label: "Detalle de hoja de evolución" },
            { label: "Completar nuevas indicaciones" },
          ]}
        />
        <article className="rounded-2xl border border-[var(--color-sanaclub-border)] bg-white p-6 text-center shadow-[0_12px_35px_rgba(36,51,43,0.08)]">
          <p className="text-sm text-[var(--color-sanaclub-text)]">
            Esta hoja de evolución ya fue completada.
          </p>
          <button
            type="button"
            onClick={handleCancel}
            className="mt-4 inline-flex rounded-full bg-[var(--color-sanaclub-green)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-sanaclub-green-dark)]"
          >
            Volver al detalle de la hoja
          </button>
        </article>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <PageHeader
        title="Completar nuevas indicaciones"
        description="Registra las nuevas indicaciones clínicas derivadas de esta evolución."
        breadcrumbs={[
          { label: "Inicio", path: "/app" },
          { label: "Pacientes", path: "/app/patients" },
          { label: "Detalle de hoja de evolución" },
          { label: "Completar nuevas indicaciones" },
        ]}
      />

      <div className="rounded-3xl border border-[var(--color-sanaclub-border)] bg-white p-4 shadow-[0_16px_48px_rgba(36,51,43,0.08)] md:p-6">
        <div className="mb-6 rounded-2xl bg-[var(--color-sanaclub-bg)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-sanaclub-coral-dark)]">
            Hoja de evolución
          </p>
          <h2 className="mt-1 text-2xl font-bold text-[var(--color-sanaclub-text)]">
            {formatEvolutionNumber(evolutionSheet.therapyNumber)}
          </h2>
          <div className="mt-2 grid gap-2 text-sm text-[var(--color-sanaclub-muted)] md:grid-cols-3">
            <p>
              <span className="font-semibold text-[var(--color-sanaclub-text)]">
                Fecha de evolución:
              </span>{" "}
              {formatEvolutionDate(evolutionSheet.evolutionDate)}
            </p>
            <p>
              <span className="font-semibold text-[var(--color-sanaclub-text)]">
                Personal asignado:
              </span>{" "}
              {evolutionSheet.assignedStaffName?.trim() || "Sin registrar"}
            </p>
            <p>
              <span className="font-semibold text-[var(--color-sanaclub-text)]">Estado:</span>{" "}
              {isCompleted ? "Completada" : "Pendiente"}
            </p>
          </div>
          <p className="mt-2 text-sm text-[var(--color-sanaclub-muted)]">
            <span className="font-semibold text-[var(--color-sanaclub-text)]">Terapia:</span>{" "}
            {evolutionSheet.therapyName?.trim() || "Sin registrar"}
          </p>
          <p className="mt-1 text-sm text-[var(--color-sanaclub-muted)]">
            <span className="font-semibold text-[var(--color-sanaclub-text)]">ID:</span>{" "}
            {evolutionSheet.id}
          </p>
        </div>

        <EvolutionSheetNewIndicationsForm
          defaultValues={{
            newIndications: evolutionSheet.newIndications?.trim() || "",
          }}
          isSubmitting={completeEvolutionSheetNewIndicationsMutation.isPending}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
      </div>
    </section>
  );
}
