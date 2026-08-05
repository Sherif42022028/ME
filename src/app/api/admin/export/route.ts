import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const type = req.nextUrl.searchParams.get("type") || "orders";

    let csvContent = "";
    let filename = `ME_${type}_export_${Date.now()}.csv`;

    if (type === "orders") {
      const orders = await prisma.order.findMany({
        include: { customer: true, items: { include: { product: true } } },
        orderBy: { createdAt: "desc" },
      });

      const headers = ["Order Number", "Date", "Customer Name", "Customer Email", "Total (PHP)", "Status", "Payment Status", "Tracking Number"];
      const rows = orders.map((o) => [
        o.orderNumber,
        o.createdAt.toISOString().split("T")[0],
        `"${o.customer.name}"`,
        o.customer.email,
        o.totalAmount,
        o.status,
        o.paymentStatus,
        o.trackingNumber || "N/A",
      ]);

      csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    } else if (type === "products") {
      const products = await prisma.product.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
      });

      const headers = ["SKU", "Name", "Brand", "Category", "Price (PHP)", "Stock", "Condition", "Status"];
      const rows = products.map((p) => [
        p.sku,
        `"${p.name.replace(/"/g, '""')}"`,
        `"${p.brand}"`,
        `"${p.category.name}"`,
        p.price,
        p.stock,
        p.condition,
        p.status,
      ]);

      csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    } else if (type === "customers") {
      const customers = await prisma.customer.findMany({
        orderBy: { totalSpent: "desc" },
      });

      const headers = ["Name", "Email", "Phone", "Orders Count", "Total Spent (PHP)", "Customer Since"];
      const rows = customers.map((c) => [
        `"${c.name}"`,
        c.email,
        c.phone || "N/A",
        c.orderCount,
        c.totalSpent,
        c.createdAt.toISOString().split("T")[0],
      ]);

      csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    }

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    if (error.message?.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: false, message: "Internal error" }, { status: 500 });
  }
}
