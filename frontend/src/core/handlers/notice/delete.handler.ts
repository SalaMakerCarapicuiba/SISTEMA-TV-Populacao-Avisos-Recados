import { API } from "@/config/api";
import { responseNoticeSchemaType } from "@/core/models/notice/responseNoticeSchema";

export async function deleteNoticeHandler(
  notice: responseNoticeSchemaType,
  token: string,
) {
  if (token) {
    const response = await API.delete(`/notices/${notice.id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status == 204) return notice.id;

    throw new Error("Impossível deletar aviso");
  } else {
    throw new Error("Sessão do usuário expirou");
  }
}
