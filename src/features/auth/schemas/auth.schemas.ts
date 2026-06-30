import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Ingresa un correo valido"),
  password: z.string().min(1, "La contrasena es requerida"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "La contrasena actual es requerida"),
    newPassword: z.string().min(8, "La nueva contrasena debe tener al menos 8 caracteres"),
    confirmNewPassword: z.string().min(1, "Confirma la nueva contrasena"),
  })
  .refine((values) => values.newPassword === values.confirmNewPassword, {
    message: "Las contrasenas no coinciden",
    path: ["confirmNewPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
