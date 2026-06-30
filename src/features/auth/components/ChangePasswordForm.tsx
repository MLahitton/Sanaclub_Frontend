import { useForm } from "react-hook-form";
import type { FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema, type ChangePasswordFormValues } from "../schemas/auth.schemas";

type ChangePasswordFormProps = {
  onSubmit: (values: ChangePasswordFormValues) => Promise<void>;
  isSubmitting: boolean;
};

function ErrorMessage({ error }: { error?: FieldError }) {
  if (!error) return null;
  return <p className="mt-1 text-xs text-[#e85a61]">{error.message}</p>;
}

const fields = [
  { name: "currentPassword", label: "Contrasena actual", type: "password" },
  { name: "newPassword", label: "Nueva contrasena", type: "password" },
  { name: "confirmNewPassword", label: "Confirmar nueva contrasena", type: "password" },
] as const;

export function ChangePasswordForm({
  onSubmit,
  isSubmitting,
}: ChangePasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values);
        reset();
      })}
      className="space-y-5"
    >
      {fields.map((field) => (
        <label key={field.name} className="block space-y-2">
          <span className="text-sm font-semibold text-[var(--color-sanaclub-text)]">
            {field.label}
          </span>
          <input
            type={field.type}
            className="w-full rounded-2xl border border-[var(--color-sanaclub-border)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--color-sanaclub-green)] focus:ring-2 focus:ring-[var(--color-sanaclub-green)]/20"
            {...register(field.name)}
            aria-invalid={Boolean(errors[field.name])}
          />
          <ErrorMessage error={errors[field.name] as FieldError | undefined} />
        </label>
      ))}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 inline-flex w-full justify-center rounded-full bg-[var(--color-sanaclub-green)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-sanaclub-green-dark)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Cambiando..." : "Cambiar contrasena"}
      </button>
    </form>
  );
}
