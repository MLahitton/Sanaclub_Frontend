import { useForm } from "react-hook-form";
import type { FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTreatmentSheetSchema } from "../schemas/treatmentSheet.schemas";
import type { CreateTreatmentSheetFormValues } from "../schemas/treatmentSheet.schemas";
import { TreatmentSheetFormField } from "./TreatmentSheetFormField";
import { TreatmentSheetFormSection } from "./TreatmentSheetFormSection";

type TreatmentSheetInitialFormProps = {
  onSubmit: (values: CreateTreatmentSheetFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
  onCancel?: () => void;
  submitLabel?: string;
};

function controlInputClass(disabled?: boolean) {
  return `w-full rounded-xl border border-[var(--color-sanaclub-border)] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[var(--color-sanaclub-green)] focus:ring-2 focus:ring-[var(--color-sanaclub-green)]/20 disabled:cursor-not-allowed disabled:opacity-60 ${
    disabled ? "bg-[var(--color-sanaclub-bg)]" : "bg-white"
  }`;
}

export function TreatmentSheetInitialForm({
  onSubmit,
  isSubmitting,
  onCancel,
  submitLabel,
}: TreatmentSheetInitialFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTreatmentSheetFormValues>({
    resolver: zodResolver(createTreatmentSheetSchema),
    defaultValues: {
      treatmentNumber: "",
      consultationDate: "",
      epsTreatingDoctorDiagnosis: "",
      referredClinicalHistory: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values);
      })}
      className="space-y-6"
    >
      <TreatmentSheetFormSection title="Información inicial">
        <TreatmentSheetFormField
          label="Número de tratamiento"
          id="treatmentNumber"
          error={errors.treatmentNumber as FieldError | undefined}
        >
          <input
            id="treatmentNumber"
            type="text"
            {...register("treatmentNumber")}
            className={controlInputClass(isSubmitting)}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.treatmentNumber)}
          />
        </TreatmentSheetFormField>

        <TreatmentSheetFormField
          label="Fecha de consulta"
          id="consultationDate"
          error={errors.consultationDate as FieldError | undefined}
        >
          <input
            id="consultationDate"
            type="date"
            {...register("consultationDate")}
            className={controlInputClass(isSubmitting)}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.consultationDate)}
          />
        </TreatmentSheetFormField>

        <TreatmentSheetFormField
          label="Diagnóstico del médico tratante EPS"
          id="epsTreatingDoctorDiagnosis"
          className="md:col-span-2"
          error={errors.epsTreatingDoctorDiagnosis as FieldError | undefined}
        >
          <textarea
            id="epsTreatingDoctorDiagnosis"
            {...register("epsTreatingDoctorDiagnosis")}
            rows={3}
            className={`${controlInputClass(isSubmitting)} resize-y`}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.epsTreatingDoctorDiagnosis)}
          />
        </TreatmentSheetFormField>

        <TreatmentSheetFormField
          label="Historia clínica referida"
          id="referredClinicalHistory"
          className="md:col-span-2"
          error={errors.referredClinicalHistory as FieldError | undefined}
        >
          <textarea
            id="referredClinicalHistory"
            {...register("referredClinicalHistory")}
            rows={4}
            className={`${controlInputClass(isSubmitting)} resize-y`}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.referredClinicalHistory)}
          />
        </TreatmentSheetFormField>
      </TreatmentSheetFormSection>

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
          {isSubmitting ? "Creando..." : submitLabel ?? "Crear hoja de tratamiento"}
        </button>
      </div>
    </form>
  );
}
