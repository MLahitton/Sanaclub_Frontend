import { useForm } from "react-hook-form";
import type { FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientFormSchema, type CreatePatientFormValues } from "../schemas/patient.schemas";
import type { PatientFormOptionsResponse } from "../types/patient.types";
import { PatientFormField } from "./PatientFormField";
import { PatientFormSection } from "./PatientFormSection";

type PatientFormProps = {
  formOptions: PatientFormOptionsResponse;
  defaultValues?: CreatePatientFormValues;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
  onCancel?: () => void;
  submitLabel?: string;
  onSubmit: (values: CreatePatientFormValues) => void | Promise<void>;
};

function renderSelectOptions(
  options: PatientFormOptionsResponse[keyof Pick<
    PatientFormOptionsResponse,
    "identificationTypes" | "genders" | "civilStatuses" | "patientStatuses"
  >],
) {
  return options.map((option) => (
    <option key={option.id} value={option.id}>
      {option.name}
    </option>
  ));
}

function controlInputClass(disabled?: boolean) {
  return `w-full rounded-xl border border-[var(--color-sanaclub-border)] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[var(--color-sanaclub-green)] focus:ring-2 focus:ring-[var(--color-sanaclub-green)]/20 disabled:cursor-not-allowed disabled:opacity-60 ${
    disabled ? "bg-[var(--color-sanaclub-bg)]" : "bg-white"
  }`;
}

export function PatientForm({
  formOptions,
  defaultValues,
  isSubmitting,
  mode = "create",
  onCancel,
  submitLabel,
  onSubmit,
}: PatientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: defaultValues ?? {
      identificationTypeId: "",
      identificationNumber: "",
      firstName: "",
      lastName: "",
      birthDate: "",
      genderId: "",
      civilStatusId: "",
      phoneNumber: "",
      email: "",
      address: "",
      cityOrMunicipality: "",
      occupation: "",
      emergencyContactName: "",
      emergencyContactRelationship: "",
      emergencyContactPhone: "",
      patientStatusId: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values);
      })}
      className="space-y-6"
    >
      <PatientFormSection title="Identificacion">
        <PatientFormField
          label="Tipo de identificacion"
          id="identificationTypeId"
          required
          error={errors.identificationTypeId as FieldError | undefined}
        >
          <select
            id="identificationTypeId"
            {...register("identificationTypeId")}
            disabled={isSubmitting}
            className={controlInputClass(isSubmitting)}
            aria-invalid={Boolean(errors.identificationTypeId)}
            aria-required
          >
            <option value="">Selecciona una opcion</option>
            {renderSelectOptions(formOptions.identificationTypes)}
          </select>
        </PatientFormField>

        <PatientFormField
          label="Numero de identificacion"
          id="identificationNumber"
          required
          error={errors.identificationNumber as FieldError | undefined}
        >
          <input
            id="identificationNumber"
            type="text"
            {...register("identificationNumber")}
            className={controlInputClass(isSubmitting)}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.identificationNumber)}
            aria-required
          />
        </PatientFormField>
      </PatientFormSection>

      <PatientFormSection title="Informacion personal">
        <PatientFormField
          label="Primer nombre"
          id="firstName"
          required
          error={errors.firstName as FieldError | undefined}
        >
          <input
            id="firstName"
            type="text"
            {...register("firstName")}
            className={controlInputClass(isSubmitting)}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.firstName)}
            aria-required
          />
        </PatientFormField>

        <PatientFormField
          label="Primer apellido"
          id="lastName"
          required
          error={errors.lastName as FieldError | undefined}
        >
          <input
            id="lastName"
            type="text"
            {...register("lastName")}
            className={controlInputClass(isSubmitting)}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.lastName)}
            aria-required
          />
        </PatientFormField>

        <PatientFormField
          label="Fecha de nacimiento"
          id="birthDate"
          error={errors.birthDate as FieldError | undefined}
          className="md:col-span-2"
        >
          <input
            id="birthDate"
            type="date"
            {...register("birthDate")}
            className={controlInputClass(isSubmitting)}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.birthDate)}
          />
        </PatientFormField>

        <PatientFormField
          label="Genero"
          id="genderId"
          error={errors.genderId as FieldError | undefined}
        >
          <select
            id="genderId"
            {...register("genderId")}
            disabled={isSubmitting}
            className={controlInputClass(isSubmitting)}
            aria-invalid={Boolean(errors.genderId)}
          >
            <option value="">Selecciona una opcion</option>
            {renderSelectOptions(formOptions.genders)}
          </select>
        </PatientFormField>

        <PatientFormField
          label="Estado civil"
          id="civilStatusId"
          error={errors.civilStatusId as FieldError | undefined}
        >
          <select
            id="civilStatusId"
            {...register("civilStatusId")}
            disabled={isSubmitting}
            className={controlInputClass(isSubmitting)}
            aria-invalid={Boolean(errors.civilStatusId)}
          >
            <option value="">Selecciona una opcion</option>
            {renderSelectOptions(formOptions.civilStatuses)}
          </select>
        </PatientFormField>

        <PatientFormField
          label="Estado del paciente"
          id="patientStatusId"
          required
          error={errors.patientStatusId as FieldError | undefined}
        >
          <select
            id="patientStatusId"
            {...register("patientStatusId")}
            disabled={isSubmitting}
            className={controlInputClass(isSubmitting)}
            aria-invalid={Boolean(errors.patientStatusId)}
            aria-required
          >
            <option value="">Selecciona una opcion</option>
            {renderSelectOptions(formOptions.patientStatuses)}
          </select>
        </PatientFormField>
      </PatientFormSection>

      <PatientFormSection title="Contacto">
        <PatientFormField
          label="Telefono"
          id="phoneNumber"
          error={errors.phoneNumber as FieldError | undefined}
        >
          <input
            id="phoneNumber"
            type="text"
            {...register("phoneNumber")}
            className={controlInputClass(isSubmitting)}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.phoneNumber)}
          />
        </PatientFormField>

        <PatientFormField
          label="Correo electronico"
          id="email"
          error={errors.email as FieldError | undefined}
        >
          <input
            id="email"
            type="email"
            {...register("email")}
            className={controlInputClass(isSubmitting)}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.email)}
          />
        </PatientFormField>

        <PatientFormField
          label="Direccion"
          id="address"
          error={errors.address as FieldError | undefined}
          className="md:col-span-2"
        >
          <input
            id="address"
            type="text"
            {...register("address")}
            className={controlInputClass(isSubmitting)}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.address)}
          />
        </PatientFormField>

        <PatientFormField
          label="Ciudad o municipio"
          id="cityOrMunicipality"
          error={errors.cityOrMunicipality as FieldError | undefined}
          className="md:col-span-2"
        >
          <input
            id="cityOrMunicipality"
            type="text"
            {...register("cityOrMunicipality")}
            className={controlInputClass(isSubmitting)}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.cityOrMunicipality)}
          />
        </PatientFormField>
      </PatientFormSection>

      <PatientFormSection title="Informacion adicional">
        <PatientFormField
          label="Ocupacion"
          id="occupation"
          error={errors.occupation as FieldError | undefined}
          className="md:col-span-2"
        >
          <input
            id="occupation"
            type="text"
            {...register("occupation")}
            className={controlInputClass(isSubmitting)}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.occupation)}
          />
        </PatientFormField>
      </PatientFormSection>

      <PatientFormSection title="Contacto de emergencia">
        <PatientFormField
          label="Nombre del contacto"
          id="emergencyContactName"
          error={errors.emergencyContactName as FieldError | undefined}
          className="md:col-span-2"
        >
          <input
            id="emergencyContactName"
            type="text"
            {...register("emergencyContactName")}
            className={controlInputClass(isSubmitting)}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.emergencyContactName)}
          />
        </PatientFormField>

        <PatientFormField
          label="Relacion"
          id="emergencyContactRelationship"
          error={errors.emergencyContactRelationship as FieldError | undefined}
        >
          <input
            id="emergencyContactRelationship"
            type="text"
            {...register("emergencyContactRelationship")}
            className={controlInputClass(isSubmitting)}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.emergencyContactRelationship)}
          />
        </PatientFormField>

        <PatientFormField
          label="Telefono del contacto"
          id="emergencyContactPhone"
          error={errors.emergencyContactPhone as FieldError | undefined}
        >
          <input
            id="emergencyContactPhone"
            type="text"
            {...register("emergencyContactPhone")}
            className={controlInputClass(isSubmitting)}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.emergencyContactPhone)}
          />
        </PatientFormField>
      </PatientFormSection>

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
          {isSubmitting
            ? mode === "edit"
              ? "Guardando cambios..."
              : "Guardando..."
            : submitLabel ?? (mode === "edit" ? "Guardar cambios" : "Crear paciente")}
        </button>
      </div>
    </form>
  );
}
