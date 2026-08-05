import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSession } from "@/lib/auth";
import { AdminLayoutClient } from "./admin-layout-client";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") || "";

  // Bypass session check & admin sidebar wrapper when rendering the login page
  if (pathname === "/admin/login" || pathname.endsWith("/admin/login")) {
    return <>{children}</>;
  }

  const session = await getSession();

  // Server-side Route Authorization Protection for /admin and subroutes
  if (!session || (session.role !== "ADMIN" && session.role !== "STAFF")) {
    redirect("/admin/login");
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
