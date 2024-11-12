import { API } from "@/config/api";
import {
  createUserSchema,
  createUserSchemaType,
} from "@/core/models/user/createUserSchema";

export async function createUserHandler(
  data: createUserSchemaType,
  token: string,
) {
  if (token) {
    createUserSchema.parse(data);

    const response = await API.post(`/register`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } else {
    throw new Error("Sessão do usuário expirou");
  }
}
