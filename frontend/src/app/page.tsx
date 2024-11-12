import { redirect } from "next/navigation";

export default function Root() {
  redirect("/v1/login");
}
