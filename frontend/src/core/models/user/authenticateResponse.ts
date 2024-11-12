import { UserRoleEnum } from "@/core/enum/userRole";
import { z } from "zod";

export const responseAuthenticationSchema = z.object({
  id: z.string().uuid(),
  email: z.string(),
  full_name: z.string(),
  is_approved: z.boolean(), // new field
  role: z.nativeEnum(UserRoleEnum),
  createdAt: z.date(),
  updatedAt: z.date(),
  access: z.string(),
  refresh: z.string(),
});

export type responseAuthenticationSchemaType = z.infer<
  typeof responseAuthenticationSchema
>;
