import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.inventoryLog.findMany({
        include: {
          product: { select: { name: true, sku: true, images: true } },
          admin: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.inventoryLog.count(),
    ]);

    return NextResponse.json({
      success: true,
      logs,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    if (error.message?.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: false, message: "Internal error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = await req.json();

    const { productId, newStock, reason } = body;

    if (!productId || newStock === undefined || newStock < 0) {
      return NextResponse.json({ success: false, message: "Invalid parameters" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      let status = product.status;
      if (newStock === 0) {
        status = "SOLD";
      } else if (product.stock === 0 && newStock > 0) {
        status = "PUBLISHED";
      }

      const p = await tx.product.update({
        where: { id: productId },
        data: { stock: newStock, status },
      });

      await tx.inventoryLog.create({
        data: {
          productId,
          action: "MANUAL_ADJUSTMENT",
          previousStock: product.stock,
          newStock,
          reason: reason || "Manual adjustment by admin",
          adminId: session.userId,
        },
      });

      return p;
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    if (error.message?.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: false, message: "Internal error" }, { status: 500 });
  }
}
