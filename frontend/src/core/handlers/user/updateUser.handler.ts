import { API } from "@/config/api";
import {
  updateUserSchema,
  updateUserSchemaType,
} from "@/core/models/user/updateUserSchema";

export async function updateUserHandler(
  data: updateUserSchemaType,
  token: string,
) {
  if (token) {
    updateUserSchema.parse(data);

    if (!data.password) delete data.password;

    const response = await API.patch(`/users/${data.id}/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } else {
    throw new Error("Sessão do usuário expirou");
  }
}
