import type { FieldError } from "react-hook-form";
import type { UseFormRegister } from "react-hook-form";
import type {
  UpdateTreatmentSheetMedicalIndicationFormValues,
} from "../schemas/treatmentSheet.schemas";

type FlagGroup = "decompression" | "endocrine";

type TreatmentSheetBooleanFlagsFieldsetProps = {
  errors: {
    decompressSpine?: FieldError;
    decompressNeck?: FieldError;
    decompressBack?: FieldError;
    endocrineNerves?: FieldError;
    endocrineDefenses?: FieldError;
    endocrineHormones?: FieldError;
  };
  isSubmitting?: boolean;
  register: UseFormRegister<UpdateTreatmentSheetMedicalIndicationFormValues>;
  group?: FlagGroup;
};

type CheckboxField = {
  id: keyof Pick<
    UpdateTreatmentSheetMedicalIndicationFormValues,
    | "decompressSpine"
    | "decompressNeck"
    | "decompressBack"
    | "endocrineNerves"
    | "endocrineDefenses"
    | "endocrineHormones"
  >;
  label: string;
};

function controlCheckboxClass(disabled?: boolean) {
  return `h-4 w-4 rounded border border-[var(--color-sanaclub-border)] text-[var(--color-sanaclub-green)] focus:ring-[var(--color-sanaclub-green)] disabled:cursor-not-allowed disabled:opacity-60 ${
    disabled ? "cursor-not-allowed" : "cursor-pointer"
  }`;
}

function BooleanCheckbox({
  id,
  label,
  register,
  error,
  isSubmitting,
}: {
  id: CheckboxField["id"];
  label: string;
  register: UseFormRegister<UpdateTreatmentSheetMedicalIndicationFormValues>;
  error?: FieldError;
  isSubmitting?: boolean;
}) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 text-sm text-[var(--color-sanaclub-text)]">
      <input
        id={id}
        type="checkbox"
        {...register(id)}
        className={controlCheckboxClass(isSubmitting)}
        disabled={isSubmitting}
      />
      <span>{label}</span>
      {error?.message ? <span className="text-xs text-[var(--color-sanaclub-coral-dark)]">{error.message}</span> : null}
    </label>
  );
}

export function TreatmentSheetBooleanFlagsFieldset({
  errors,
  isSubmitting,
  register,
  group = "decompression",
}: TreatmentSheetBooleanFlagsFieldsetProps) {
  const decompressionFlags: CheckboxField[] = [
    { id: "decompressSpine", label: "Descomprimir columna" },
    { id: "decompressNeck", label: "Descomprimir cuello" },
    { id: "decompressBack", label: "Descomprimir espalda" },
  ];

  const endocrineFlags: CheckboxField[] = [
    { id: "endocrineNerves", label: "Nervios" },
    { id: "endocrineDefenses", label: "Defensas" },
    { id: "endocrineHormones", label: "Hormonas" },
  ];

  const flags = group === "decompression" ? decompressionFlags : endocrineFlags;

  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {flags.map((flag) => {
        const error =
          flag.id === "decompressSpine"
            ? errors.decompressSpine
            : flag.id === "decompressNeck"
              ? errors.decompressNeck
              : flag.id === "decompressBack"
                ? errors.decompressBack
                : flag.id === "endocrineNerves"
                  ? errors.endocrineNerves
                  : flag.id === "endocrineDefenses"
                    ? errors.endocrineDefenses
                    : errors.endocrineHormones;

        return (
          <BooleanCheckbox
            key={flag.id}
            id={flag.id}
            label={flag.label}
            register={register}
            isSubmitting={isSubmitting}
            error={error}
          />
        );
      })}
    </div>
  );
}
