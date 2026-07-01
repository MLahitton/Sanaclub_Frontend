import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldError } from "react-hook-form";
import { TreatmentSheetBooleanFlagsFieldset } from "./TreatmentSheetBooleanFlagsFieldset";
import { TreatmentSheetFormField } from "./TreatmentSheetFormField";
import { TreatmentSheetFormSection } from "./TreatmentSheetFormSection";
import {
  updateTreatmentSheetMedicalIndicationSchema,
  type UpdateTreatmentSheetMedicalIndicationFormValues,
} from "../schemas/treatmentSheet.schemas";

type TreatmentSheetMedicalIndicationFormProps = {
  defaultValues?: Partial<UpdateTreatmentSheetMedicalIndicationFormValues>;
  isSubmitting?: boolean;
  onCancel?: () => void;
  onSubmit: (
    values: UpdateTreatmentSheetMedicalIndicationFormValues,
  ) => void | Promise<void>;
};

function controlInputClass(disabled?: boolean) {
  return `w-full rounded-xl border border-[var(--color-sanaclub-border)] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[var(--color-sanaclub-green)] focus:ring-2 focus:ring-[var(--color-sanaclub-green)]/20 disabled:cursor-not-allowed disabled:opacity-60 ${
    disabled ? "bg-[var(--color-sanaclub-bg)]" : "bg-white"
  }`;
}

function controlTextAreaClass(disabled?: boolean) {
  return `${controlInputClass(disabled)} resize-y`;
}

function buildDefaultValues(
  values?: Partial<UpdateTreatmentSheetMedicalIndicationFormValues>,
): UpdateTreatmentSheetMedicalIndicationFormValues {
  return {
    indicationDate: "",
    assignedStaffName: "",
    therapyName: "",
    nervousSystemIndications: "",
    decompressSpine: false,
    decompressNeck: false,
    decompressBack: false,
    endocrineNerves: false,
    endocrineDefenses: false,
    endocrineHormones: false,
    cardiovascularReflexologyWith: "",
    digestiveColonReflexologyWith: "",
    respiratoryReflexologyWith: "",
    urinaryReflexologyWithAcidFruits: "",
    otherIndications: "",
    observations: "",
    ...values,
  };
}

export function TreatmentSheetMedicalIndicationForm({
  defaultValues,
  isSubmitting,
  onCancel,
  onSubmit,
}: TreatmentSheetMedicalIndicationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateTreatmentSheetMedicalIndicationFormValues>({
    resolver: zodResolver(updateTreatmentSheetMedicalIndicationSchema),
    defaultValues: buildDefaultValues(defaultValues),
  });

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values);
      })}
      className="space-y-6"
    >
      <TreatmentSheetFormSection title="Información principal">
        <TreatmentSheetFormField
          label="Fecha de indicación"
          id="indicationDate"
          required
          error={errors.indicationDate as FieldError | undefined}
        >
          <input
            id="indicationDate"
            type="date"
            {...register("indicationDate")}
            className={controlInputClass(isSubmitting)}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.indicationDate)}
            aria-required
          />
          <p className="mt-1.5 text-xs text-[var(--color-sanaclub-muted)]">
            Fecha indicada para realizar la terapia. Puede ser una fecha futura.
          </p>
        </TreatmentSheetFormField>

        <TreatmentSheetFormField
          label="Personal asignado / encargada"
          id="assignedStaffName"
          required
          error={errors.assignedStaffName as FieldError | undefined}
          className="md:col-span-2"
        >
          <input
            id="assignedStaffName"
            type="text"
            {...register("assignedStaffName")}
            className={controlInputClass(isSubmitting)}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.assignedStaffName)}
            aria-required
          />
        </TreatmentSheetFormField>

        <TreatmentSheetFormField
          label="Terapia"
          id="therapyName"
          required
          error={errors.therapyName as FieldError | undefined}
          className="md:col-span-2"
        >
          <input
            id="therapyName"
            type="text"
            {...register("therapyName")}
            className={controlInputClass(isSubmitting)}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.therapyName)}
            aria-required
          />
        </TreatmentSheetFormField>
      </TreatmentSheetFormSection>

      <TreatmentSheetFormSection title="Sistema nervioso">
        <TreatmentSheetFormField
          label="Indicaciones del sistema nervioso"
          id="nervousSystemIndications"
          className="md:col-span-2"
          error={errors.nervousSystemIndications as FieldError | undefined}
        >
          <textarea
            id="nervousSystemIndications"
            rows={4}
            {...register("nervousSystemIndications")}
            className={controlTextAreaClass(isSubmitting)}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.nervousSystemIndications)}
          />
        </TreatmentSheetFormField>
      </TreatmentSheetFormSection>

      <TreatmentSheetFormSection title="Descompresión">
        <TreatmentSheetBooleanFlagsFieldset
          register={register}
          errors={{
            decompressSpine: errors.decompressSpine as FieldError | undefined,
            decompressNeck: errors.decompressNeck as FieldError | undefined,
            decompressBack: errors.decompressBack as FieldError | undefined,
            endocrineNerves: errors.endocrineNerves as FieldError | undefined,
            endocrineDefenses: errors.endocrineDefenses as FieldError | undefined,
            endocrineHormones: errors.endocrineHormones as FieldError | undefined,
          }}
          isSubmitting={isSubmitting}
          group="decompression"
        />
      </TreatmentSheetFormSection>

      <TreatmentSheetFormSection title="Sistema endocrino">
        <TreatmentSheetBooleanFlagsFieldset
          register={register}
          errors={{
            endocrineNerves: errors.endocrineNerves as FieldError | undefined,
            endocrineDefenses: errors.endocrineDefenses as FieldError | undefined,
            endocrineHormones: errors.endocrineHormones as FieldError | undefined,
          }}
          isSubmitting={isSubmitting}
          group="endocrine"
        />
      </TreatmentSheetFormSection>

      <TreatmentSheetFormSection title="Reflexología">
        <TreatmentSheetFormField
          label="Reflexología cardiovascular con"
          id="cardiovascularReflexologyWith"
          className="md:col-span-2"
          error={errors.cardiovascularReflexologyWith as FieldError | undefined}
        >
          <input
            id="cardiovascularReflexologyWith"
            type="text"
            {...register("cardiovascularReflexologyWith")}
            className={controlInputClass(isSubmitting)}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.cardiovascularReflexologyWith)}
          />
        </TreatmentSheetFormField>

        <TreatmentSheetFormField
          label="Reflexología digestiva/colon con"
          id="digestiveColonReflexologyWith"
          className="md:col-span-2"
          error={errors.digestiveColonReflexologyWith as FieldError | undefined}
        >
          <input
            id="digestiveColonReflexologyWith"
            type="text"
            {...register("digestiveColonReflexologyWith")}
            className={controlInputClass(isSubmitting)}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.digestiveColonReflexologyWith)}
          />
        </TreatmentSheetFormField>

        <TreatmentSheetFormField
          label="Reflexología respiratoria con"
          id="respiratoryReflexologyWith"
          className="md:col-span-2"
          error={errors.respiratoryReflexologyWith as FieldError | undefined}
        >
          <input
            id="respiratoryReflexologyWith"
            type="text"
            {...register("respiratoryReflexologyWith")}
            className={controlInputClass(isSubmitting)}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.respiratoryReflexologyWith)}
          />
        </TreatmentSheetFormField>

        <TreatmentSheetFormField
          label="Reflexología urinaria con frutas ácidas"
          id="urinaryReflexologyWithAcidFruits"
          className="md:col-span-2"
          error={errors.urinaryReflexologyWithAcidFruits as FieldError | undefined}
        >
          <input
            id="urinaryReflexologyWithAcidFruits"
            type="text"
            {...register("urinaryReflexologyWithAcidFruits")}
            className={controlInputClass(isSubmitting)}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.urinaryReflexologyWithAcidFruits)}
          />
        </TreatmentSheetFormField>
      </TreatmentSheetFormSection>

      <TreatmentSheetFormSection title="Otras indicaciones">
        <TreatmentSheetFormField
          label="Otras indicaciones"
          id="otherIndications"
          className="md:col-span-2"
          error={errors.otherIndications as FieldError | undefined}
        >
          <textarea
            id="otherIndications"
            rows={3}
            {...register("otherIndications")}
            className={controlTextAreaClass(isSubmitting)}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.otherIndications)}
          />
        </TreatmentSheetFormField>

        <TreatmentSheetFormField
          label="Observaciones"
          id="observations"
          className="md:col-span-2"
          error={errors.observations as FieldError | undefined}
        >
          <textarea
            id="observations"
            rows={3}
            {...register("observations")}
            className={controlTextAreaClass(isSubmitting)}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.observations)}
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
          {isSubmitting ? "Guardando..." : "Completar indicación médica"}
        </button>
      </div>
    </form>
  );
}
