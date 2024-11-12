import { UserRoleEnum } from "@/core/enum/userRole";
import { z } from "zod";

export const updateUserSchema = z.object({
  id: z.any(),
  email: z
    .string()
    .min(1, "E-mail é obrigatório")
    .email("E-mail não está no formato correto"),
  full_name: z.string().min(1, "Nome completo é obrigatório").max(255),
  is_approved: z.boolean(),
  role: z.nativeEnum(UserRoleEnum, {
    invalid_type_error: "Opção do Enum inválida",
    required_error: "Tipo do usuário é obrigatório",
  }),
  password: z
    .string()
    .min(8, "Senha deve conter no mínimo 8 caracteres")
    .regex(/^[^\s]+$/, "Senha não deve conter espaços")
    .nullable()
    .optional(),
});

export type updateUserSchemaType = z.infer<typeof updateUserSchema>;
