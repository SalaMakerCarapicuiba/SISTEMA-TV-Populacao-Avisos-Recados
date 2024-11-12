import { UserRoleEnum } from "@/core/enum/userRole";
import { z } from "zod";

export const responseUserSchema = z.object({
  id: z.any(),
  email: z.string(),
  full_name: z.string(),
  is_approved: z.boolean(),
  role: z.nativeEnum(UserRoleEnum),
  created_at: z.date(),
  updated_at: z.date(),
});

export type responseUserSchemaType = z.infer<typeof responseUserSchema>;
