import { Share2, CheckCircle2, XCircle } from "lucide-react";

export default function IntegrationsPage() {
  const integrations = [
    {
      name: "WhatsApp Cloud API",
      category: "Communication & Messaging",
      status: "Connected",
      badge: "LIVE WEBHOOK",
      details: "Official Cloud API linked. Phone Number ID: 109876543210987",
      connected: true,
    },
    {
      name: "Meta (Instagram & Facebook)",
      category: "Social Analytics",
      status: "Connected",
      badge: "GRAPH API v20",
      details: "App ID: 1234567890. Traffic event tracking active.",
      connected: true,
    },
    {
      name: "PayMongo / GCash & Maya",
      category: "Payment Gateway",
      status: "Connected",
      badge: "PHP CURRENCY",
      details: "Verified webhook callbacks configured.",
      connected: true,
    },
    {
      name: "Lalamove / J&T Express",
      category: "Logistics & Shipping",
      status: "Active",
      badge: "PHILIPPINES",
      details: "Express shipping provider integration active.",
      connected: true,
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="font-serif text-3xl font-bold text-white tracking-wide flex items-center space-x-3">
          <Share2 className="w-6 h-6 text-[#f472b6]" />
          <span>Integrations & External Services</span>
        </h1>
        <p className="text-xs text-[#9ca3af] mt-1">
          Monitor connection health for Meta Graph API, WhatsApp Cloud API, and Philippine Payment Webhooks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((item, idx) => (
          <div key={idx} className="p-6 rounded-2xl bg-[#141414] border border-[#262626] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#f472b6]/20 text-[#f472b6]">
                {item.badge}
              </span>
              <span className="flex items-center space-x-1.5 text-xs text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>{item.status}</span>
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{item.name}</h3>
              <p className="text-xs text-[#9ca3af]">{item.category}</p>
            </div>

            <p className="text-xs text-[#6b7280] font-mono pt-3 border-t border-[#222222]">
              {item.details}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
