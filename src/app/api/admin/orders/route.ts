import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OrderStatus, PaymentStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const searchParams = req.nextUrl.searchParams;
    const statusParam = searchParams.get("status");
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: any = {};

    if (statusParam && Object.values(OrderStatus).includes(statusParam as OrderStatus)) {
      where.status = statusParam as OrderStatus;
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { customer: { name: { contains: search, mode: "insensitive" } } },
        { customer: { email: { contains: search, mode: "insensitive" } } },
        { customer: { phone: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          customer: true,
          items: {
            include: {
              product: {
                select: { name: true, images: true, sku: true },
              },
            },
          },
          payments: true,
          shippings: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    if (error.message?.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    console.error("Orders GET error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
