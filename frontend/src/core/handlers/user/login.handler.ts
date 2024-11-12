import { API } from "@/config/api";
import { authenticateSchemaType } from "@/core/models/user/authenticate";
import { responseAuthenticationSchemaType } from "@/core/models/user/authenticateResponse";
import { AxiosResponse } from "axios";

export interface ErrorFromApi {
  detail: string;
}

export async function authenticate(data: authenticateSchemaType) {
  const response: AxiosResponse<responseAuthenticationSchemaType> =
    await API.post("/login", data);

  return response.data;
}
