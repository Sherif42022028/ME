import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, address, city, province, notes, items, productId } = body;

    if (!name || !phone || !email || !address || !city || !province) {
      return NextResponse.json(
        { success: false, message: "Please fill in all required customer fields." },
        { status: 400 }
      );
    }

    // 1. Fetch products or default product
    let orderItemsData: Array<{ productId: string; quantity: number; price: number; costPrice: number }> = [];
    let subtotal = 0;

    if (items && Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        const prod = await prisma.product.findUnique({ where: { id: item.productId } });
        if (prod) {
          const itemPrice = prod.price || 40.0;
          const itemCost = prod.costPrice || 15.0;
          subtotal += itemPrice * (item.quantity || 1);
          orderItemsData.push({
            productId: prod.id,
            quantity: item.quantity || 1,
            price: itemPrice,
            costPrice: itemCost,
          });
        }
      }
    }

    if (orderItemsData.length === 0) {
      const fallbackProd = productId
        ? await prisma.product.findUnique({ where: { id: productId } })
        : await prisma.product.findFirst({ where: { status: "PUBLISHED" } });

      if (fallbackProd) {
        subtotal = fallbackProd.price || 40.0;
        orderItemsData.push({
          productId: fallbackProd.id,
          quantity: 1,
          price: fallbackProd.price || 40.0,
          costPrice: fallbackProd.costPrice || 15.0,
        });
      } else {
        return NextResponse.json({ success: false, message: "No active products found to order." }, { status: 400 });
      }
    }

    const totalAmount = subtotal; // Complimentary shipping
    const randomSuffix = Math.floor(Math.random() * 8999 + 1000);
    const orderNumber = `ME-2026-${randomSuffix}`;

    // 2. Create Customer or Find existing
    const cleanEmail = email.trim().toLowerCase();
    const customer = await prisma.customer.upsert({
      where: { email: cleanEmail },
      update: { name, phone },
      create: { name, email: cleanEmail, phone },
    });

    // 3. Create Order record in Neon DB with status PENDING_CONFIRMATION
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        subtotal,
        totalAmount,
        shippingFee: 0,
        currency: "PHP",
        status: OrderStatus.PENDING_CONFIRMATION,
        notes: notes || null,
        shippingAddress: {
          name,
          phone,
          email: cleanEmail,
          addressLine1: address,
          city,
          province,
          country: "Philippines",
        },
        items: {
          create: orderItemsData.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            costPrice: item.costPrice,
          })),
        },
        statusHistory: {
          create: [
            {
              status: OrderStatus.PENDING_CONFIRMATION,
              note: "Checkout form submitted via WhatsApp flow",
            },
          ],
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    // 4. Record CheckoutEvent for conversion analytics (BEGIN_CHECKOUT)
    const sessionId = req.cookies.get("me_session_id")?.value || `session-${Date.now()}`;
    await prisma.checkoutEvent.create({
      data: {
        orderId: order.id,
        sessionId,
      },
    });

    await prisma.analyticsEvent.create({
      data: {
        sessionId,
        eventType: "CHECKOUT_STARTED",
        page: "/checkout",
        metadata: { orderNumber, total: totalAmount },
      },
    });

    // 5. Generate formatted WhatsApp message
    const whatsappPhone = (process.env.WHATSAPP_PHONE_NUMBER || "+639999680628").replace(/[^0-9]/g, "");
    const productNamesList = order.items.map((i) => `${i.product.name} (₱${i.price})`).join("\n");

    const messageText = `Hello ME — Mica Ella!\n\nI'd like to confirm my order.\n\nOrder: #${order.orderNumber}\n\nProducts:\n${productNamesList}\n\nTotal:\n₱${totalAmount}\n\nCustomer:\n${name}\n\nPhone:\n${phone}\n\nAddress:\n${address}, ${city}, ${province}\n\nPlease confirm my order.`;

    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(messageText)}`;

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
      totalAmount,
      whatsappUrl,
    });
  } catch (error: any) {
    console.error("Checkout API error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Unable to process order. Please try again." },
      { status: 500 }
    );
  }
}
