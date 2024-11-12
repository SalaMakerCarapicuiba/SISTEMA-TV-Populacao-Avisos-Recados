import { z } from "zod";

export const authenticateSchema = z.object({
  email: z.string().email("E-mail não está no formato correto"),
  password: z
    .string()
    .min(8, "Senha deve conter no mínimo 8 caracteres")
    .regex(/^[^\s]+$/, "Senha não deve conter espaços"),
});

export type authenticateSchemaType = z.infer<typeof authenticateSchema>;
