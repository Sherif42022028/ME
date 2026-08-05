import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminLayoutClient } from "./admin-layout-client";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side Route Authorization Protection
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "STAFF")) {
    redirect("/login");
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
