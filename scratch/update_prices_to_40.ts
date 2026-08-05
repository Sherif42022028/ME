import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔄 Updating all product prices in Neon PostgreSQL to 40 PHP...");

  const updateResult = await prisma.product.updateMany({
    data: {
      price: 40,
    },
  });

  console.log(`✅ Updated ${updateResult.count} products to price = 40 PHP.`);

  const products = await prisma.product.findMany({
    select: { id: true, name: true, price: true },
  });

  console.log("Current database products:");
  console.table(products);
}

main()
  .catch((e) => {
    console.error("Error updating prices:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
