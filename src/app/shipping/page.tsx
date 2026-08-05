import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#faf9f6] flex flex-col font-sans selection:bg-[#f472b6] selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-8 py-16 space-y-6">
        <h1 className="font-serif text-4xl font-bold text-white tracking-wide">
          Shipping & Delivery Policy
        </h1>
        <div className="p-8 rounded-2xl bg-[#141414] border border-[#262626] space-y-4 text-xs text-[#d1d5db] leading-relaxed">
          <p>
            We ship nationwide across the Philippines. Orders above ₱15,000 qualify for complimentary express delivery.
          </p>
          <h3 className="text-sm font-bold text-white uppercase pt-2">Metro Manila Same-Day / Next-Day Delivery</h3>
          <p>
            Orders placed before 2:00 PM PHT in Metro Manila are dispatched via Lalamove or express courier.
          </p>
          <h3 className="text-sm font-bold text-white uppercase pt-2">Provincial Shipping</h3>
          <p>
            Deliveries to Luzon, Visayas, and Mindanao are handled via J&T Express with insured tracking numbers provided via SMS and email.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
