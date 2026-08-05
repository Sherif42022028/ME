"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Send, Phone, User, CheckCheck, Loader2 } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default function WhatsAppInboxPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/admin/whatsapp");
      const data = await res.json();
      if (data.success) {
        setConversations(data.conversations);
        if (data.conversations.length > 0 && !activeConv) {
          fetchSingleConv(data.conversations[0].id);
        }
      }
    } catch (e) {
      console.error("WhatsApp fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleConv = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/whatsapp?conversationId=${id}`);
      const data = await res.json();
      if (data.success) {
        setActiveConv(data.conversation);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeConv) return;

    setSending(true);
    try {
      const res = await fetch("/api/admin/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConv.id,
          text: replyText,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReplyText("");
        fetchSingleConv(activeConv.id);
        fetchConversations();
      }
    } catch (err) {
      console.error("Send error:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-white tracking-wide">
          WhatsApp Business Inbox
        </h1>
        <p className="text-xs text-[#9ca3af] mt-1">
          Official WhatsApp Cloud API conversation hub with instant customer inquiry replies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px] bg-[#141414] border border-[#262626] rounded-2xl overflow-hidden">
        {/* Left: Conversations List */}
        <div className="border-r border-[#262626] flex flex-col bg-[#111111]">
          <div className="p-4 border-b border-[#262626] flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-[#f472b6]" />
              <span>Conversations ({conversations.length})</span>
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#222222]">
            {loading ? (
              <div className="p-8 text-center text-[#9ca3af] flex flex-col items-center space-y-2">
                <Loader2 className="w-5 h-5 text-[#f472b6] animate-spin" />
                <span className="text-xs">Loading conversations...</span>
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-[#9ca3af] text-xs">
                No active WhatsApp conversations yet.
              </div>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => fetchSingleConv(c.id)}
                  className={`w-full text-left p-4 hover:bg-[#1a1a1a] transition-colors ${
                    activeConv?.id === c.id ? "bg-[#1f1f1f] border-l-2 border-[#f472b6]" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-white">{c.customerName}</p>
                    {c.unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-[#f472b6] text-black font-bold">
                        {c.unreadCount} new
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#9ca3af] font-mono mt-0.5">{c.customerPhone}</p>
                  <p className="text-xs text-[#6b7280] truncate mt-1">{c.lastMessage}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right: Message Window */}
        <div className="md:col-span-2 flex flex-col bg-[#141414]">
          {activeConv ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-[#262626] bg-[#1a1a1a] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">{activeConv.customerName}</h3>
                  <p className="text-[10px] text-[#9ca3af] font-mono flex items-center space-x-1">
                    <Phone className="w-3 h-3 inline text-[#f472b6]" />
                    <span>{activeConv.customerPhone}</span>
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 text-[10px] uppercase font-bold font-mono">
                  WhatsApp Connected
                </span>
              </div>

              {/* Messages Feed */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {activeConv.messages?.map((msg: any) => {
                  const isAdmin = msg.sender === "ADMIN";
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isAdmin ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-md p-3.5 rounded-2xl text-xs space-y-1 ${
                          isAdmin
                            ? "bg-gradient-to-r from-[#f472b6] to-[#db2777] text-black font-medium rounded-tr-none shadow-lg"
                            : "bg-[#222222] text-white rounded-tl-none border border-[#333333]"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                        <p className={`text-[9px] font-mono ${isAdmin ? "text-black/70" : "text-[#6b7280]"}`}>
                          {formatDateTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendReply} className="p-4 border-t border-[#262626] bg-[#1a1a1a] flex items-center space-x-3">
                <input
                  type="text"
                  placeholder="Type WhatsApp message reply to customer..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#6b7280] focus:outline-none focus:border-[#f472b6]"
                />
                <button
                  type="submit"
                  disabled={sending || !replyText.trim()}
                  className="p-2.5 bg-[#f472b6] hover:bg-[#db2777] text-black font-bold rounded-xl transition-colors disabled:opacity-50"
                >
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[#6b7280] text-xs">
              Select a conversation to view customer messages.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
