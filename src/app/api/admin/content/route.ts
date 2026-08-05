import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const [founder, siteContent] = await Promise.all([
      prisma.founderProfile.findFirst(),
      prisma.siteContent.findMany(),
    ]);

    return NextResponse.json({ success: true, founder, siteContent });
  } catch (error: any) {
    if (error.message?.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: false, message: "Internal error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { type, founderData, contentData } = body;

    if (type === "founder" && founderData) {
      const founder = await prisma.founderProfile.upsert({
        where: { id: "founder-micaela" },
        update: founderData,
        create: { id: "founder-micaela", ...founderData },
      });
      return NextResponse.json({ success: true, founder });
    }

    if (type === "siteContent" && contentData) {
      const { key, value } = contentData;
      const updated = await prisma.siteContent.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
      return NextResponse.json({ success: true, siteContent: updated });
    }

    return NextResponse.json({ success: false, message: "Invalid type" }, { status: 400 });
  } catch (error: any) {
    if (error.message?.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: false, message: "Internal error" }, { status: 500 });
  }
}
