import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validators";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const searchParams = req.nextUrl.searchParams;
    const categoryId = searchParams.get("categoryId");
    const status = searchParams.get("status");
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: any = {};

    if (categoryId) where.categoryId = categoryId;
    if (status) where.status = status;

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { name: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      products,
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
    return NextResponse.json({ success: false, message: "Internal error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = await req.json();

    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid product data", errors: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Check SKU duplicate
    const existingSku = await prisma.product.findUnique({
      where: { sku: data.sku },
    });
    if (existingSku) {
      return NextResponse.json(
        { success: false, message: "A product with this SKU already exists." },
        { status: 400 }
      );
    }

    // Auto-slug generation
    const slug =
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") +
      "-" +
      Math.floor(Math.random() * 8999 + 1000);

    const product = await prisma.$transaction(async (tx) => {
      const created = await tx.product.create({
        data: {
          ...data,
          slug,
          status: data.stock === 0 ? "SOLD" : data.status,
        },
      });

      // Audit Log
      await tx.inventoryLog.create({
        data: {
          productId: created.id,
          action: "INITIAL_CREATE",
          previousStock: 0,
          newStock: data.stock,
          reason: "Product created by admin",
          adminId: session.userId,
        },
      });

      return created;
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    if (error.message?.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    console.error("Product create error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
