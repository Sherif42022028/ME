import { redirect } from "next/navigation";

export default function RedirectToAdminLogin() {
  redirect("/admin/login");
}
