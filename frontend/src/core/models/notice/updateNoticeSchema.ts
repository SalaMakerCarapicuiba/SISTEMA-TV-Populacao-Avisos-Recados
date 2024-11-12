import { z } from "zod";

export const updateNoticeSchema = z.object({
  id: z.string().uuid(),
  start_date: z.date({ required_error: "Data inicial é obrigatória" }),
  end_date: z.date({ required_error: "Data final é obrigatória" }),
  start_time: z.string().time(),
  end_time: z.string().time(),
  is_approved: z.boolean(),

  local: z
    .string()
    .min(1, "Local é obrigatório")
    .max(255, "Título deve ser menor do que 255 caracteres"),
  subject: z
    .string()
    .min(1, "Assunto é obrigatório")
    .max(255, "Título deve ser menor do que 255 caracteres"),
  category: z
    .string()
    .min(1, "Categoria é obrigatório")
    .max(255, "Título deve ser menor do que 255 caracteres"),
  subcategory: z
    .string()
    .min(1, "Subcategoria é obrigatório")
    .max(255, "Título deve ser menor do que 255 caracteres"),
  content: z
    .string()
    .min(1, "Conteúdo é obrigatório")
    .max(255, "Título deve ser menor do que 255 caracteres"),

  image_url: z
    .instanceof(File)
    .refine(
      (file) => {
        const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"]; // Adjust as needed
        return allowedImageTypes.includes(file.type);
      },
      {
        message:
          "Formato de imagem inválido. Por favor, suba um JPEG, PNG, ou GIF file.",
      },
    )
    .nullable()
    .optional(),

  id_user: z.string().uuid(),

  share_morning: z.boolean(),
  share_afternoon: z.boolean(),
  share_evening: z.boolean(),
  interest_area: z.string({
    message: "Área de interesse é obrigatória",
    required_error: "Área de interesse é obrigatória",
  }),
});

export type updateNoticeSchemaType = z.infer<typeof updateNoticeSchema>;
