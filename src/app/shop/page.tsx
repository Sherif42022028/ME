import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { ProductCard } from "@/components/public/ProductCard";
import { WhatsAppFloatingButton } from "@/components/public/WhatsAppFloatingButton";
import { prisma } from "@/lib/prisma";
import { Search, Filter } from "lucide-react";

export const revalidate = 30;

export default async function PublicShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; condition?: string; q?: string }>;
}) {
  const params = await searchParams;
  const categorySlug = params.category;
  const condition = params.condition;
  const search = params.q;

  const where: any = {
    status: { in: ["PUBLISHED", "SOLD"] },
  };

  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  if (condition) {
    where.condition = condition;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { brand: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
    ];
  }

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany(),
  ]);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#faf9f6] flex flex-col font-sans selection:bg-[#f472b6] selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-10 space-y-8">
        <div>
          <span className="text-xs font-mono font-bold uppercase text-[#f472b6] tracking-widest">
            Complete Catalog
          </span>
          <h1 className="font-serif text-4xl font-bold text-white tracking-wide mt-1">
            Shop 1-of-1 Pre-Loved Archives
          </h1>
          <p className="text-xs text-[#9ca3af] mt-1">
            Browse our authenticated collection of pre-loved luxury dresses, bags, blazers, and footwear.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#141414] border border-[#262626]">
          <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <a
              href="/shop"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                !categorySlug ? "bg-[#f472b6] text-black" : "text-[#9ca3af] hover:text-white"
              }`}
            >
              All Categories ({products.length})
            </a>
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  categorySlug === cat.slug ? "bg-[#f472b6] text-black" : "text-[#9ca3af] hover:text-white"
                }`}
              >
                {cat.name}
              </a>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="p-16 text-center text-[#9ca3af] space-y-3 bg-[#141414] rounded-2xl border border-[#262626]">
            <p className="text-base font-semibold text-white">No products found matching your filter</p>
            <p className="text-xs">Try clearing category or search filters.</p>
            <a href="/shop" className="inline-block text-xs font-bold text-[#f472b6] hover:underline pt-2">
              Reset Filters
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>

      <WhatsAppFloatingButton />
      <Footer />
    </div>
  );
}
