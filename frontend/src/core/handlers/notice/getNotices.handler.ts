import { API } from "@/config/api";
import { UserRoleEnum } from "@/core/enum/userRole";
import { responseNoticeSchemaType } from "@/core/models/notice/responseNoticeSchema";
import { responseAuthenticationSchemaType } from "@/core/models/user/authenticateResponse";
import { AxiosResponse } from "axios";

export async function getAllNoticesHandler(
  profile: responseAuthenticationSchemaType | null,
  token: string,
) {
  if (token) {
    if (profile?.role === UserRoleEnum.admin) {
      const response: AxiosResponse<responseNoticeSchemaType[]> = await API.get(
        "/notices",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    }

    const response: AxiosResponse<responseNoticeSchemaType[]> = await API.get(
      "/notices/approved_notices",
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

export async function getMyNoticesHandler(userId: string, token: string) {
  if (token) {
    const response: AxiosResponse<responseNoticeSchemaType[]> = await API.get(
      "/notices",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data.filter((item) => item.id_user === userId);
  } else {
    throw new Error("Sessão do usuário expirou");
  }

  // if (token) {
  //   const response: AxiosResponse<responseNoticeSchemaType[]> = await API.get(
  //     `/notices/user/${userId}/`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     },
  //   );
  //   return response.data;
  // } else {
  //   throw new Error("Sessão do usuário expirou");
  // }
}
