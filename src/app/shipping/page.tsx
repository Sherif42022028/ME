import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0B0B0B] text-[#171717] dark:text-[#faf9f6] flex flex-col font-sans selection:bg-[#E99AB4] dark:selection:bg-[#F3A6BE] selection:text-black transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-8 py-16 space-y-6">
        <h1 className="font-serif text-4xl font-bold text-[#171717] dark:text-white tracking-wide">
          Shipping & Delivery Policy
        </h1>
        <div className="p-8 rounded-2xl bg-white dark:bg-[#141414] border border-[#E8E3DD] dark:border-[#262626] space-y-4 text-xs text-[#66615D] dark:text-[#d1d5db] leading-relaxed shadow-xs">
          <p>
            We ship nationwide across the Philippines. Orders above ₱15,000 qualify for complimentary express delivery.
          </p>
          <h3 className="text-sm font-bold text-[#171717] dark:text-white uppercase pt-2">Metro Manila Same-Day / Next-Day Delivery</h3>
          <p>
            Orders placed before 2:00 PM PHT in Metro Manila are dispatched via Lalamove or express courier.
          </p>
          <h3 className="text-sm font-bold text-[#171717] dark:text-white uppercase pt-2">Provincial Shipping</h3>
          <p>
            Deliveries to Luzon, Visayas, and Mindanao are handled via J&T Express with insured tracking numbers provided via SMS and email.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
