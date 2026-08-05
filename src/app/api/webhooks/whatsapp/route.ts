import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || "me_whatsapp_webhook_verify_token_2026";

  if (mode === "subscribe" && token === verifyToken) {
    console.log("✅ WhatsApp webhook verified successfully.");
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Check idempotency using WebhookEvent
    const entry = body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const messageData = value?.messages?.[0];

    if (!messageData) {
      return NextResponse.json({ status: "EVENT_RECEIVED_NO_MESSAGE" }, { status: 200 });
    }

    const eventId = messageData.id || `wa_event_${Date.now()}`;

    const existingEvent = await prisma.webhookEvent.findUnique({
      where: { eventId },
    });

    if (existingEvent) {
      console.log(`⚠️ Webhook event ${eventId} already processed. Skipping.`);
      return NextResponse.json({ status: "IDEMPOTENT_SKIPPED" }, { status: 200 });
    }

    // Save webhook event log
    await prisma.webhookEvent.create({
      data: {
        eventId,
        provider: "WHATSAPP",
        eventType: "MESSAGES",
        payload: body,
        processed: true,
      },
    });

    // 2. Process incoming message
    const fromPhone = messageData.from; // e.g. "639171234567"
    const text = messageData.text?.body || "Sent a media attachment";
    const name = value.contacts?.[0]?.profile?.name || `Customer +${fromPhone}`;

    // Find or create conversation
    let conv = await prisma.whatsAppConversation.findFirst({
      where: { customerPhone: { contains: fromPhone } },
    });

    if (!conv) {
      conv = await prisma.whatsAppConversation.create({
        data: {
          customerPhone: `+${fromPhone}`,
          customerName: name,
          lastMessage: text,
          unreadCount: 1,
          status: "OPEN",
        },
      });
    } else {
      await prisma.whatsAppConversation.update({
        where: { id: conv.id },
        data: {
          lastMessage: text,
          unreadCount: { increment: 1 },
          updatedAt: new Date(),
        },
      });
    }

    // Save message
    await prisma.whatsAppMessage.create({
      data: {
        conversationId: conv.id,
        sender: "CUSTOMER",
        text,
        wamid: eventId,
        status: "DELIVERED",
      },
    });

    // Create Notification for Admin Dashboard
    await prisma.notification.create({
      data: {
        type: "WHATSAPP",
        title: "New WhatsApp Inquiry",
        message: `${name}: "${text.slice(0, 45)}..."`,
        link: "/admin/communication/whatsapp",
      },
    });

    return NextResponse.json({ status: "SUCCESS" }, { status: 200 });
  } catch (error: any) {
    console.error("WhatsApp webhook error:", error);
    return NextResponse.json({ error: "Webhook processing error" }, { status: 500 });
  }
}
