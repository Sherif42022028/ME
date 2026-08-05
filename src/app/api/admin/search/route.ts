import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const query = req.nextUrl.searchParams.get("q") || "";
    if (!query || query.trim().length < 2) {
      return NextResponse.json({ success: true, results: { products: [], orders: [], customers: [] } });
    }

    const q = query.trim();

    const [products, orders, customers] = await Promise.all([
      prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { brand: { contains: q, mode: "insensitive" } },
            { sku: { contains: q, mode: "insensitive" } },
          ],
        },
        select: { id: true, name: true, sku: true, price: true, images: true, status: true },
        take: 5,
      }),
      prisma.order.findMany({
        where: {
          OR: [
            { orderNumber: { contains: q, mode: "insensitive" } },
            { trackingNumber: { contains: q, mode: "insensitive" } },
          ],
        },
        select: { id: true, orderNumber: true, totalAmount: true, status: true, createdAt: true },
        take: 5,
      }),
      prisma.customer.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { phone: { contains: q, mode: "insensitive" } },
          ],
        },
        select: { id: true, name: true, email: true, phone: true, totalSpent: true },
        take: 5,
      }),
    ]);

    return NextResponse.json({
      success: true,
      results: {
        products,
        orders,
        customers,
      },
    });
  } catch (error: any) {
    if (error.message?.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: false, message: "Internal error" }, { status: 500 });
  }
}
