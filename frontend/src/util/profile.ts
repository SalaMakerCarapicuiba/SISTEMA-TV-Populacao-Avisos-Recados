import { responseAuthenticationSchemaType } from "@/core/models/user/authenticateResponse";
import Cookies from "js-cookie";

export function getUserProfile() {
  const user = Cookies.get("authenticated_user");
  if (user) return JSON.parse(user) as responseAuthenticationSchemaType;
  return null;
}
