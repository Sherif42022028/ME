"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Truck, ShieldCheck, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { formatPHP, formatDateTime } from "@/lib/utils";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [note, setNote] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`);
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
        setNewStatus(data.order.status);
        setTrackingNumber(data.order.trackingNumber || "");
      }
    } catch (e) {
      console.error("Order fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          note,
          trackingNumber,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
        setNote("");
        fetchOrder();
      }
    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-[#9ca3af] flex flex-col items-center space-y-3">
        <Loader2 className="w-6 h-6 text-[#f472b6] animate-spin" />
        <span className="text-xs">Fetching order details from Neon DB...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 text-center text-white space-y-4">
        <p>Order not found.</p>
        <Link href="/admin/orders" className="text-xs text-[#f472b6] underline">
          Back to Orders
        </Link>
      </div>
    );
  }

  const statuses = [
    "PENDING_CONFIRMATION",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED",
  ];

  const handleQuickConfirm = async () => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "CONFIRMED",
          note: "Order confirmed by admin via WhatsApp verification",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
        setNewStatus("CONFIRMED");
        fetchOrder();
      }
    } catch (err) {
      console.error("Confirm error:", err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/orders"
            className="p-2 bg-[#181818] border border-[#2a2a2a] hover:border-[#333333] text-[#9ca3af] hover:text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif text-3xl font-bold text-white tracking-wide flex items-center space-x-3">
              <span>Order {order.orderNumber}</span>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#f472b6]/20 text-[#f472b6]">
                {order.status}
              </span>
            </h1>
            <p className="text-xs text-[#9ca3af] mt-0.5">
              Placed on {formatDateTime(order.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Pending Confirmation Callout */}
      {order.status === "PENDING_CONFIRMATION" && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-300">Pending Order Confirmation</p>
              <p className="text-[11px] text-[#9ca3af]">
                Customer submitted checkout and was redirected to WhatsApp. Click Confirm Order to record this as an active Sale.
              </p>
            </div>
          </div>
          <button
            onClick={handleQuickConfirm}
            disabled={updating}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shrink-0 flex items-center space-x-2"
          >
            <CheckCircle className="w-4 h-4 text-black" />
            <span>CONFIRM ORDER</span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Items & Customer Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="p-6 rounded-xl bg-[#141414] border border-[#262626] space-y-4">
            <h3 className="text-base font-serif font-bold text-white">Order Items</h3>
            <div className="divide-y divide-[#222222]">
              {order.items?.map((item: any) => (
                <div key={item.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{item.product?.name}</p>
                    <p className="text-xs text-[#9ca3af] font-mono">SKU: {item.product?.sku}</p>
                  </div>
                  <div className="text-right font-mono">
                    <p className="text-sm font-bold text-[#f472b6]">{formatPHP(item.price)}</p>
                    <p className="text-xs text-[#6b7280]">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#222222] space-y-2 text-xs">
              <div className="flex justify-between text-[#9ca3af]">
                <span>Subtotal:</span>
                <span className="font-mono text-white">{formatPHP(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#9ca3af]">
                <span>Shipping Fee:</span>
                <span className="font-mono text-white">{formatPHP(order.shippingFee)}</span>
              </div>
              <div className="flex justify-between text-[#9ca3af]">
                <span>Discount:</span>
                <span className="font-mono text-emerald-400">-{formatPHP(order.discountAmount)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[#222222]">
                <span>Total Amount:</span>
                <span className="font-mono text-[#f472b6]">{formatPHP(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Customer & Shipping Address */}
          <div className="p-6 rounded-xl bg-[#141414] border border-[#262626] grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-bold uppercase text-[#9ca3af] tracking-wider mb-2">Customer Information</h4>
              <p className="text-sm font-semibold text-white">{order.customer?.name}</p>
              <p className="text-xs text-[#9ca3af]">{order.customer?.email}</p>
              <p className="text-xs text-[#9ca3af] font-mono">{order.customer?.phone || "No phone provided"}</p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase text-[#9ca3af] tracking-wider mb-2">Shipping Destination</h4>
              <p className="text-xs text-[#e5e5e5]">{order.shippingAddress?.addressLine1}</p>
              <p className="text-xs text-[#9ca3af]">{order.shippingAddress?.city}, {order.shippingAddress?.province} {order.shippingAddress?.postalCode}</p>
              <p className="text-xs text-[#6b7280]">{order.shippingAddress?.country}</p>
            </div>
          </div>

          {/* Status Timeline History */}
          <div className="p-6 rounded-xl bg-[#141414] border border-[#262626] space-y-4">
            <h3 className="text-base font-serif font-bold text-white flex items-center space-x-2">
              <Clock className="w-4 h-4 text-[#f472b6]" />
              <span>Order Status Audit History</span>
            </h3>

            <div className="relative pl-6 space-y-4 border-l border-[#262626]">
              {order.statusHistory?.map((hist: any) => (
                <div key={hist.id} className="relative">
                  <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-[#f472b6]" />
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-bold text-white uppercase">{hist.status}</span>
                    <span className="text-[10px] text-[#6b7280] font-mono">{formatDateTime(hist.createdAt)}</span>
                  </div>
                  {hist.note && <p className="text-xs text-[#9ca3af] mt-0.5">{hist.note}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Status Control Form */}
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-[#141414] border border-[#262626] space-y-4">
            <h3 className="text-base font-serif font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#f472b6]" />
              <span>Update Order Status</span>
            </h3>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-2">
                  Order Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#f472b6]"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-2">
                  Tracking Number (Courier)
                </label>
                <input
                  type="text"
                  placeholder="e.g. LALAMOVE-88291"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg p-2.5 text-xs text-white placeholder-[#555555] focus:outline-none focus:border-[#f472b6]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-2">
                  Status Change Note
                </label>
                <textarea
                  rows={3}
                  placeholder="Add note for customer or internal audit..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg p-2.5 text-xs text-white placeholder-[#555555] focus:outline-none focus:border-[#f472b6]"
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full py-2.5 px-4 bg-[#f472b6] hover:bg-[#db2777] text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {updating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating Neon DB...</span>
                  </>
                ) : (
                  <span>Save Status Change</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
