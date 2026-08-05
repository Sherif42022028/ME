import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { discountSchema } from "@/lib/validators";

export async function GET() {
  try {
    await requireAdmin();

    const discounts = await prisma.discount.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, discounts });
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

    const parsed = discountSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Invalid discount data", errors: parsed.error.format() }, { status: 400 });
    }

    const data = parsed.data;

    const discount = await prisma.discount.create({
      data: {
        code: data.code,
        type: data.type,
        value: data.value,
        minimumOrder: data.minimumOrder,
        maximumDiscount: data.maximumDiscount,
        usageLimit: data.usageLimit,
        startsAt: data.startsAt ? new Date(data.startsAt) : null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        active: data.active,
      },
    });

    return NextResponse.json({ success: true, discount });
  } catch (error: any) {
    if (error.message?.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: false, message: "Internal error" }, { status: 500 });
  }
}
