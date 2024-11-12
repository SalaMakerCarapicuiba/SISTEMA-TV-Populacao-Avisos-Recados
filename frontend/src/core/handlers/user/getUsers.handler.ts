import { API } from "@/config/api";
import { responseUserSchemaType } from "@/core/models/user/responseUserSchema";
import { AxiosResponse } from "axios";

export async function getApprovedUsersHandler(token: string | undefined) {
  if (token) {
    const response: AxiosResponse<responseUserSchemaType[]> = await API.get(
      "/users/approved",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } else {
    throw new Error("Sessão do usuário expirou");
  }
}

export async function getNotApprovedUsersHandler(token: string) {
  if (token) {
    const response: AxiosResponse<responseUserSchemaType[]> = await API.get(
      "/users/unapproved",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } else {
    throw new Error("Sessão do usuário expirou");
  }
}
