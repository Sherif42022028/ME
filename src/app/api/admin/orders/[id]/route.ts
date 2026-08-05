import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
        statusHistory: {
          include: {
            user: { select: { name: true, email: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        payments: true,
        shippings: true,
      },
    });

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    if (error.message?.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: false, message: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    const { id } = await params;
    const body = await req.json();

    const { status, note, trackingNumber } = body;

    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    // Perform transaction: Update order status & add to history
    const updatedOrder = await prisma.$transaction(async (tx) => {
      const updateData: any = {};
      if (status && Object.values(OrderStatus).includes(status as OrderStatus)) {
        updateData.status = status as OrderStatus;
      }
      if (trackingNumber !== undefined) {
        updateData.trackingNumber = trackingNumber;
      }

      const updated = await tx.order.update({
        where: { id },
        data: updateData,
        include: { customer: true, items: true },
      });

      if (status && status !== existingOrder.status) {
        await tx.orderStatusHistory.create({
          data: {
            orderId: id,
            status: status as OrderStatus,
            note: note || `Status changed from ${existingOrder.status} to ${status}`,
            createdBy: session.userId,
          },
        });
      }

      return updated;
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    if (error.message?.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    console.error("Order status update error:", error);
    return NextResponse.json({ success: false, message: "Internal error" }, { status: 500 });
  }
}
