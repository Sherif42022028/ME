import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    await requireAdmin();

    const productDir = path.join(process.cwd(), "product");
    let files: string[] = [];

    if (fs.existsSync(productDir)) {
      files = fs.readdirSync(productDir).filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return [".jpg", ".jpeg", ".png", ".webp"].includes(ext) && file !== "CEO pic.png";
      });
    }

    const detectedImages = files.map((file) => ({
      filename: file,
      url: `/product/${file}`,
    }));

    return NextResponse.json({
      success: true,
      directory: productDir,
      images: detectedImages,
    });
  } catch (error: any) {
    if (error.message?.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    console.error("Import scan error:", error);
    return NextResponse.json({ success: false, message: "Internal error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = await req.json();

    const { filenames, name, brand, categoryId, price, size, color, condition, description } = body;

    if (!filenames || !Array.isArray(filenames) || filenames.length === 0) {
      return NextResponse.json({ success: false, message: "No images selected" }, { status: 400 });
    }

    // Default category ID if not provided
    const category = categoryId || (await prisma.category.findFirst())?.id;
    if (!category) {
      return NextResponse.json({ success: false, message: "No category available" }, { status: 400 });
    }

    const sku = `ME-2026-${Math.floor(Math.random() * 8999 + 1000)}`;
    const slug = `me-draft-${sku.toLowerCase()}-${Date.now()}`;
    const imageUrls = filenames.map((f: string) => `/product/${f}`);

    const product = await prisma.$transaction(async (tx) => {
      const created = await tx.product.create({
        data: {
          name: name || `Pre-Loved Archival Piece (${filenames[0]})`,
          slug,
          brand: brand || "Micaela Ella Archive",
          categoryId: category,
          price: price ? parseFloat(price) : 12500,
          size: size || "M / EU 38",
          color: color || "Black",
          condition: condition || "EXCELLENT",
          sku,
          stock: 1, // Default 1-of-1
          images: imageUrls,
          description: description || "Curated 1-of-1 archival fashion piece imported from ME product collection.",
          status: "DRAFT",
        },
      });

      // Log creation
      await tx.inventoryLog.create({
        data: {
          productId: created.id,
          action: "FOLDER_IMPORT_DRAFT",
          previousStock: 0,
          newStock: 1,
          reason: `Imported from local product assets (${filenames.join(", ")})`,
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
    console.error("Import create error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
