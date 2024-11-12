import { API } from "@/config/api";
import { responseUserSchemaType } from "@/core/models/user/responseUserSchema";

export async function deleteUserHandler(
  user: responseUserSchemaType,
  token: string,
) {
  if (token) {
    const response = await API.delete(`/users/${user.id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status == 204) return user.id;

    throw new Error("Impossível deletar usuário");
  } else {
    throw new Error("Sessão do usuário expirou");
  }
}
