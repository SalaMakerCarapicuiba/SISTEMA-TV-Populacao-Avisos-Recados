import { API } from "@/config/api";
import {
  updateNoticeSchema,
  updateNoticeSchemaType,
} from "@/core/models/notice/updateNoticeSchema";
import { format } from "date-fns";

export async function updateNoticeHandler(
  data: updateNoticeSchemaType,
  token: string,
) {
  if (token) {
    updateNoticeSchema.parse(data);

    if (data.start_date > data.end_date)
      throw new Error("Data inicial deve ser menor ou igual a data final");

    if (data.start_time > data.end_time)
      throw new Error("Hora inicial deve ser menor ou igual a hora final");

    if (
      data.share_morning === false &&
      data.share_afternoon === false &&
      data.share_evening === false
    ) {
      throw new Error("Selecione pelo menos um turno");
    }

    const formData = new FormData();

    if (data.image_url) {
      formData.append("image_file", data.image_url);
    }

    formData.append("id", data.id);
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

    const response = await API.put(`/notices/${data.id}/`, formData, {
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
