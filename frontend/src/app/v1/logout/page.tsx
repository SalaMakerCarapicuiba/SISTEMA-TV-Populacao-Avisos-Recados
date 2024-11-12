"use client";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Logout() {
  const router = useRouter();

  Cookies.remove("authenticated_user");

  router.replace("/v1/login");
}
