import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminLayoutClient } from "./admin-layout-client";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Server-side Route Authorization Protection
  if (!session || (session.role !== "ADMIN" && session.role !== "STAFF")) {
    redirect("/admin/login");
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
