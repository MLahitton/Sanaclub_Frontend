import { useForm } from "react-hook-form";
import type { FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EvolutionSheetFormField } from "./EvolutionSheetFormField";
import { EvolutionSheetFormSection } from "./EvolutionSheetFormSection";
import { EvolutionTreatmentSheetSelector } from "./EvolutionTreatmentSheetSelector";
import {
  createEvolutionSheetSchema,
  type CreateEvolutionSheetFormValues,
} from "../schemas/evolutionSheet.schemas";
import type { TreatmentSheetResponse } from "../../treatment-sheets/types/treatmentSheet.types";

type EvolutionSheetInitialFormProps = {
  approvedTreatmentSheets: TreatmentSheetResponse[];
  onSubmit: (values: CreateEvolutionSheetFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
  onCancel?: () => void;
  submitLabel?: string;
};

function controlInputClass(disabled?: boolean) {
  return `w-full rounded-xl border border-[var(--color-sanaclub-border)] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[var(--color-sanaclub-green)] focus:ring-2 focus:ring-[var(--color-sanaclub-green)]/20 disabled:cursor-not-allowed disabled:opacity-60 ${
    disabled ? "bg-[var(--color-sanaclub-bg)]" : "bg-white"
  }`;
}

function getDefaultValues() {
  return {
    treatmentSheetId: "",
    therapyNumber: "",
    evolutionDate: "",
    assignedStaffName: "",
    therapyName: "",
    evolutionNotes: "",
  } as const;
}

export function EvolutionSheetInitialForm({
  approvedTreatmentSheets,
  onSubmit,
  isSubmitting,
  onCancel,
  submitLabel,
}: EvolutionSheetInitialFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEvolutionSheetFormValues>({
    resolver: zodResolver(createEvolutionSheetSchema),
    defaultValues: getDefaultValues(),
  });

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values);
      })}
      className="space-y-6"
    >
      <EvolutionSheetFormSection title="Hoja base y datos clínicos iniciales">
        <EvolutionSheetFormField
          label="Hoja de tratamiento base"
          id="treatmentSheetId"
          required
          error={errors.treatmentSheetId as FieldError | undefined}
        >
          <EvolutionTreatmentSheetSelector
            id="treatmentSheetId"
            name="treatmentSheetId"
            treatmentSheets={approvedTreatmentSheets}
            registerProps={register("treatmentSheetId")}
            disabled={isSubmitting}
            required
          />
        </EvolutionSheetFormField>

        <EvolutionSheetFormField
          label="Número de terapia / evolución"
          id="therapyNumber"
          error={errors.therapyNumber as FieldError | undefined}
        >
          <input
            id="therapyNumber"
            type="text"
            {...register("therapyNumber")}
            className={controlInputClass(isSubmitting)}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.therapyNumber)}
          />
        </EvolutionSheetFormField>

        <EvolutionSheetFormField
          label="Fecha de evolución"
          id="evolutionDate"
          error={errors.evolutionDate as FieldError | undefined}
        >
          <input
            id="evolutionDate"
            type="date"
            {...register("evolutionDate")}
            className={controlInputClass(isSubmitting)}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.evolutionDate)}
          />
        </EvolutionSheetFormField>

        <EvolutionSheetFormField
          label="Encargada / personal asignado"
          id="assignedStaffName"
          required
          error={errors.assignedStaffName as FieldError | undefined}
        >
          <input
            id="assignedStaffName"
            type="text"
            {...register("assignedStaffName")}
            className={controlInputClass(isSubmitting)}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.assignedStaffName)}
          />
        </EvolutionSheetFormField>

        <EvolutionSheetFormField
          label="Terapia"
          id="therapyName"
          required
          className="md:col-span-2"
          error={errors.therapyName as FieldError | undefined}
        >
          <input
            id="therapyName"
            type="text"
            {...register("therapyName")}
            className={controlInputClass(isSubmitting)}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.therapyName)}
          />
        </EvolutionSheetFormField>

        <EvolutionSheetFormField
          label="Notas de evolución"
          id="evolutionNotes"
          required
          className="md:col-span-2"
          error={errors.evolutionNotes as FieldError | undefined}
        >
          <textarea
            id="evolutionNotes"
            {...register("evolutionNotes")}
            rows={5}
            className={`${controlInputClass(isSubmitting)} resize-y`}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.evolutionNotes)}
          />
        </EvolutionSheetFormField>
      </EvolutionSheetFormSection>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-[var(--color-sanaclub-border)] px-5 py-2.5 text-sm font-semibold text-[var(--color-sanaclub-text)] transition hover:border-[var(--color-sanaclub-green)] hover:text-[var(--color-sanaclub-green)] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
        ) : null}

        <button
          type="submit"
          className="rounded-full bg-[var(--color-sanaclub-green)] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-sanaclub-green-dark)] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creando..." : submitLabel ?? "Crear hoja de evolución"}
        </button>
      </div>
    </form>
  );
}
