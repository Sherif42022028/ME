import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const searchParams = req.nextUrl.searchParams;
    const conversationId = searchParams.get("conversationId");

    if (conversationId) {
      const conversation = await prisma.whatsAppConversation.findUnique({
        where: { id: conversationId },
        include: {
          customer: true,
          messages: { orderBy: { createdAt: "asc" } },
        },
      });

      // Mark unread messages as read
      if (conversation && conversation.unreadCount > 0) {
        await prisma.whatsAppConversation.update({
          where: { id: conversationId },
          data: { unreadCount: 0 },
        });
      }

      return NextResponse.json({ success: true, conversation });
    }

    const conversations = await prisma.whatsAppConversation.findMany({
      include: {
        customer: true,
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ success: true, conversations });
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

    const { conversationId, text } = body;

    if (!conversationId || !text) {
      return NextResponse.json({ success: false, message: "Missing conversationId or text" }, { status: 400 });
    }

    const message = await prisma.whatsAppMessage.create({
      data: {
        conversationId,
        sender: "ADMIN",
        text,
        status: "SENT",
      },
    });

    await prisma.whatsAppConversation.update({
      where: { id: conversationId },
      data: {
        lastMessage: text,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, message });
  } catch (error: any) {
    if (error.message?.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: false, message: "Internal error" }, { status: 500 });
  }
}
