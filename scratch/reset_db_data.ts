import { PrismaClient, Role, ProductCondition, ProductStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Wiping out all demo/testing data from Neon PostgreSQL...");

  // Delete all test transactional records
  await prisma.orderStatusHistory.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.shipping.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.analyticsEvent.deleteMany();
  await prisma.whatsAppMessage.deleteMany();
  await prisma.whatsAppConversation.deleteMany();
  await prisma.inventoryLog.deleteMany();
  await prisma.discount.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.webhookEvent.deleteMany();
  await prisma.checkoutEvent.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.customer.deleteMany();

  console.log("✅ Wiped out all test orders, customers, messages, events, and analytics!");

  // Ensure Admin User exists
  const adminEmail = (process.env.ADMIN_EMAIL || "micaela.ella.admin@gmail.com").trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "MeAdminPass2026!Secure";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { name: "Mica Ella (Owner)", role: Role.ADMIN, passwordHash },
    create: { name: "Mica Ella (Owner)", email: adminEmail, passwordHash, role: Role.ADMIN },
  });
  console.log(`✅ Admin account active: ${admin.email}`);

  // Ensure Products exist and have price = 40, costPrice = 15
  await prisma.product.updateMany({
    data: {
      price: 40.0,
      costPrice: 15.0,
      status: ProductStatus.PUBLISHED,
      stock: 1,
    },
  });

  const productCount = await prisma.product.count();
  const orderCount = await prisma.order.count();
  const customerCount = await prisma.customer.count();

  console.log(`📊 DB Reset Status: Products=${productCount}, Orders=${orderCount}, Customers=${customerCount}`);
  console.log("🎉 Database is now completely clean and ready for real production transactions!");
}

main()
  .catch((e) => {
    console.error("❌ Reset error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
