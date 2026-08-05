import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { ProductCard } from "@/components/public/ProductCard";
import { WhatsAppFloatingButton } from "@/components/public/WhatsAppFloatingButton";
import { prisma } from "@/lib/prisma";

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
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0B0B0B] text-[#171717] dark:text-[#faf9f6] flex flex-col font-sans selection:bg-[#E99AB4] dark:selection:bg-[#F3A6BE] selection:text-black transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-10 space-y-8">
        <div>
          <span className="text-xs font-mono font-bold uppercase text-[#E99AB4] dark:text-[#F3A6BE] tracking-widest">
            Complete Catalog
          </span>
          <h1 className="font-serif text-4xl font-bold text-[#171717] dark:text-white tracking-wide mt-1">
            Shop 1-of-1 Pre-Loved Archives
          </h1>
          <p className="text-xs text-[#66615D] dark:text-[#9ca3af] mt-1">
            Browse our authenticated collection of pre-loved luxury dresses, bags, blazers, and footwear.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-[#141414] border border-[#E8E3DD] dark:border-[#262626] shadow-xs">
          <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <a
              href="/shop"
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                !categorySlug
                  ? "bg-[#171717] text-white dark:bg-[#F3A6BE] dark:text-black font-bold"
                  : "text-[#66615D] dark:text-[#9ca3af] hover:text-[#171717] dark:hover:text-white"
              }`}
            >
              All Categories ({products.length})
            </a>
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  categorySlug === cat.slug
                    ? "bg-[#171717] text-white dark:bg-[#F3A6BE] dark:text-black font-bold"
                    : "text-[#66615D] dark:text-[#9ca3af] hover:text-[#171717] dark:hover:text-white"
                }`}
              >
                {cat.name}
              </a>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="p-16 text-center text-[#66615D] dark:text-[#9ca3af] space-y-3 bg-white dark:bg-[#141414] rounded-2xl border border-[#E8E3DD] dark:border-[#262626]">
            <p className="text-base font-semibold text-[#171717] dark:text-white">No products found matching your filter</p>
            <p className="text-xs">Try clearing category or search filters.</p>
            <a href="/shop" className="inline-block text-xs font-bold text-[#E99AB4] dark:text-[#F3A6BE] hover:underline pt-2">
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
