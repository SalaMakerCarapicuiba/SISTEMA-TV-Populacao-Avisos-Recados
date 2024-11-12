import { API } from "@/config/api";
import {
  createNoticeSchemaType,
  createNoticeSchema,
} from "@/core/models/notice/createNoticeSchema";
import { format } from "date-fns";
import { Form } from "react-hook-form";

export async function createNoticeHandler(
  data: createNoticeSchemaType,
  token: string,
) {
  if (token) {
    createNoticeSchema.parse(data);

    if (data.start_date > data.end_date)
      throw new Error("Data inicial deve ser menor ou igual a data final");

    if (data.start_time > data.end_time)
      throw new Error("Hora inicial deve ser menor ou igual a hora final");

    const formData = new FormData();

    if (data.image_url) {
      formData.append("image_file", data.image_url);
    }

    formData.append("start_date", format(data.start_date, "yyy-MM-dd"));
    formData.append("end_date", format(data.end_date, "yyy-MM-dd"));
    formData.append("start_time", data.start_time);
    formData.append("end_time", data.end_time);
    formData.append("is_approved", data.is_approved.toString());
    formData.append("local", data.local);
    formData.append("subject", data.subject);
    formData.append("category", data.category);
    formData.append("subcategory", data.subcategory);
    formData.append("content", data.content);
    formData.append("id_user", data.id_user);
    formData.append("responsible", data.id_user);
    formData.append("share_morning", data.share_morning.toString());
    formData.append("share_afternoon", data.share_afternoon.toString());
    formData.append("share_evening", data.share_evening.toString());
    formData.append("interest_area", data.interest_area);

    const response = await API.post("/notices/", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } else {
    throw new Error("Sessão do usuário expirou");
  }
}
