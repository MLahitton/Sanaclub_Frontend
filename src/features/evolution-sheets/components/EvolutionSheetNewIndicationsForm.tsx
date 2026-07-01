import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldError } from "react-hook-form";
import {
  completeEvolutionSheetNewIndicationsSchema,
  type CompleteEvolutionSheetNewIndicationsFormValues,
} from "../schemas/evolutionSheet.schemas";
import { EvolutionSheetFormField } from "./EvolutionSheetFormField";
import { EvolutionSheetFormSection } from "./EvolutionSheetFormSection";

type EvolutionSheetNewIndicationsFormProps = {
  defaultValues?: Partial<CompleteEvolutionSheetNewIndicationsFormValues>;
  isSubmitting?: boolean;
  onCancel?: () => void;
  onSubmit: (
    values: CompleteEvolutionSheetNewIndicationsFormValues,
  ) => void | Promise<void>;
};

function controlTextAreaClass(disabled?: boolean) {
  return `w-full rounded-xl border border-[var(--color-sanaclub-border)] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[var(--color-sanaclub-green)] focus:ring-2 focus:ring-[var(--color-sanaclub-green)]/20 resize-y disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-[var(--color-sanaclub-bg)] ${
    disabled ? "cursor-not-allowed opacity-70" : ""
  }`;
}

function buildDefaultValues(
  values?: Partial<CompleteEvolutionSheetNewIndicationsFormValues>,
): CompleteEvolutionSheetNewIndicationsFormValues {
  return {
    newIndications: "",
    ...values,
  };
}

export function EvolutionSheetNewIndicationsForm({
  defaultValues,
  isSubmitting,
  onCancel,
  onSubmit,
}: EvolutionSheetNewIndicationsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompleteEvolutionSheetNewIndicationsFormValues>({
    resolver: zodResolver(completeEvolutionSheetNewIndicationsSchema),
    defaultValues: buildDefaultValues(defaultValues),
  });

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values);
      })}
      className="space-y-6"
    >
      <EvolutionSheetFormSection title="Nuevas indicaciones">
        <EvolutionSheetFormField
          label="Nuevas indicaciones"
          id="newIndications"
          required
          error={errors.newIndications as FieldError | undefined}
          className="md:col-span-2"
        >
          <textarea
            id="newIndications"
            rows={10}
            {...register("newIndications")}
            className={controlTextAreaClass(isSubmitting)}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.newIndications)}
            aria-required
          />
          <p className="mt-1.5 text-xs text-[var(--color-sanaclub-muted)]">
            Registra las nuevas indicaciones clínicas derivadas de esta evolución.
          </p>
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
          {isSubmitting ? "Guardando..." : "Completar nuevas indicaciones"}
        </button>
      </div>
    </form>
  );
}
