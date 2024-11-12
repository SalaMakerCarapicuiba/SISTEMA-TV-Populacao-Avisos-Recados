import { z } from "zod";

export const responseNoticeSchema = z.object({
  id: z.string().uuid(),
  start_date: z.string(),
  end_date: z.string(),
  start_time: z.string().time(),
  end_time: z.string().time(),
  is_approved: z.boolean(),
  created_at: z.date(),
  updated_at: z.date(),

  responsible: z.string().uuid(),
  user_name: z.string(),

  local: z.string(),
  subject: z.string(),
  category: z.string(),
  subcategory: z.string(),
  content: z.string(),

  image_url: z.string().nullable(),
  id_user: z.string().uuid(),

  share_morning: z.boolean().default(true),
  share_afternoon: z.boolean().default(true),
  share_evening: z.boolean().default(true),
  interest_area: z.string().nullable(),
});

export type responseNoticeSchemaType = z.infer<typeof responseNoticeSchema>;
