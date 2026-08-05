import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { CheckoutForm } from "./checkout-form";
import { prisma } from "@/lib/prisma";

export default async function CheckoutPage() {
  const defaultProduct = await prisma.product.findFirst({
    where: { status: "PUBLISHED" },
    select: { id: true, name: true, price: true, images: true },
  });

  const formattedProduct = defaultProduct
    ? {
        id: defaultProduct.id,
        name: defaultProduct.name,
        price: defaultProduct.price,
        image: defaultProduct.images[0] || "/product/p1.jpg",
      }
    : undefined;

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0B0B0B] text-[#171717] dark:text-[#faf9f6] flex flex-col font-sans selection:bg-[#E99AB4] dark:selection:bg-[#F3A6BE] selection:text-black transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-8 py-12 space-y-8">
        <div>
          <h1 className="font-serif text-4xl font-bold text-[#171717] dark:text-white tracking-wide">
            WhatsApp Order Checkout
          </h1>
          <p className="text-xs text-[#66615D] dark:text-[#9ca3af] mt-1">
            Fill in your delivery details to generate your order and confirm directly on WhatsApp.
          </p>
        </div>

        <CheckoutForm initialProduct={formattedProduct} />
      </main>

      <Footer />
    </div>
  );
}
