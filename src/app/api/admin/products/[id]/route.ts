import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validators";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        inventoryLogs: {
          include: { admin: { select: { name: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    if (error.message?.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: false, message: "Internal error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    const { id } = await params;
    const body = await req.json();

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const updatedProduct = await prisma.$transaction(async (tx) => {
      let status = data.status;
      if (data.stock === 0) {
        status = "SOLD";
      } else if (existingProduct.stock === 0 && data.stock > 0 && status === "SOLD") {
        status = "PUBLISHED";
      }

      const updated = await tx.product.update({
        where: { id },
        data: {
          ...data,
          status,
        },
      });

      if (existingProduct.stock !== data.stock) {
        await tx.inventoryLog.create({
          data: {
            productId: id,
            action: "STOCK_UPDATE",
            previousStock: existingProduct.stock,
            newStock: data.stock,
            reason: "Updated via product editor",
            adminId: session.userId,
          },
        });
      }

      return updated;
    });

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error: any) {
    if (error.message?.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: false, message: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    await prisma.product.update({
      where: { id },
      data: { status: "ARCHIVED" },
    });

    return NextResponse.json({ success: true, message: "Product archived successfully" });
  } catch (error: any) {
    if (error.message?.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: false, message: "Internal error" }, { status: 500 });
  }
}
