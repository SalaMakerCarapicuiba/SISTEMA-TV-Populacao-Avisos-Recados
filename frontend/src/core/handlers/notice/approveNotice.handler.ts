import { API } from "@/config/api";
import { updateNoticeSchemaType } from "@/core/models/notice/updateNoticeSchema";

export async function approveNoticeHandler(
  data: updateNoticeSchemaType,
  token: string,
) {
  if (token) {
    const payload = {
      is_approved: data.is_approved,
    };

    const response = await API.patch(`/notices/${data.id}/approve/`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } else {
    throw new Error("Sessão do usuário expirou");
  }
}
