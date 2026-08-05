import { PrismaClient, Role, ProductCondition, ProductStatus, OrderStatus, PaymentStatus, EventType, MessageSender, MessageStatus, ConversationStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Neon PostgreSQL database seed for ME (Micaela Ella) with local /product assets...");

  // 1. Initial Admin User from Environment Variables
  const adminEmail = (process.env.ADMIN_EMAIL || "micaela.ella.admin@gmail.com").trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "MeAdminPass2026!Secure";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "Mica Ella (Owner)",
      passwordHash,
      role: Role.ADMIN,
    },
    create: {
      name: "Mica Ella (Owner)",
      email: adminEmail,
      passwordHash,
      role: Role.ADMIN,
    },
  });

  console.log(`✅ Admin account configured: ${admin.email}`);

  // 2. Categories with local images from /product
  const categoriesData = [
    { name: "Dresses & Gowns", slug: "dresses-gowns", description: "Curated pre-loved evening dresses, gowns, and silk slips.", image: "/product/p5.jpg" },
    { name: "Luxury Bags", slug: "luxury-bags", description: "Authenticated designer handbags and leather totes.", image: "/product/p3.jpg" },
    { name: "Outerwear & Blazers", slug: "outerwear-blazers", description: "Structured vintage blazers, trench coats, and jackets.", image: "/product/p1.jpg" },
    { name: "Tops & Corsets", slug: "tops-corsets", description: "Feminine silk blouses, corsets, and knit tops.", image: "/product/p10.jpg" },
    { name: "Footwear", slug: "footwear", description: "Pre-loved heels, mules, and designer boots.", image: "/product/p7.jpg" },
  ];

  const categories = [];
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categories.push(created);
  }

  // 3. Products using /product/p1.jpg through /product/p12.jpg
  const productsData = [
    {
      name: "Vintage Chanel Tweed Structured Blazer",
      slug: "vintage-chanel-tweed-structured-blazer",
      description: "Timeless Chanel black tweed jacket with gold lion buttons. 100% wool exterior with silk camellia lining. Exceptional condition.",
      brand: "Chanel",
      categoryId: categories[2].id,
      price: 28500,
      size: "S / EU 36",
      color: "Black & Gold",
      condition: ProductCondition.EXCELLENT,
      sku: "ME-BLZ-001",
      stock: 1,
      images: ["/product/p1.jpg", "/product/p2.jpg"],
      measurements: { bust: "34 in", waist: "28 in", length: "24 in" },
      status: ProductStatus.PUBLISHED,
    },
    {
      name: "Jacquemus Le Chiquito Moyen Pink Leather Bag",
      slug: "jacquemus-le-chiquito-moyen-pink-leather-bag",
      description: "Iconic Jacquemus signature bag in soft blush pink smooth calfskin. Includes detachable shoulder strap and original dust bag.",
      brand: "Jacquemus",
      categoryId: categories[1].id,
      price: 18900,
      size: "One Size",
      color: "Blush Pink",
      condition: ProductCondition.LIKE_NEW,
      sku: "ME-BAG-002",
      stock: 1,
      images: ["/product/p3.jpg", "/product/p4.jpg"],
      measurements: { width: "18 cm", height: "13.5 cm", depth: "8 cm" },
      status: ProductStatus.PUBLISHED,
    },
    {
      name: "Zimmermann Silk Floral Cutout Midi Dress",
      slug: "zimmermann-silk-floral-cutout-midi-dress",
      description: "Ethereal Zimmermann 100% silk chiffon midi dress with delicate botanical floral print and waist cutouts.",
      brand: "Zimmermann",
      categoryId: categories[0].id,
      price: 14500,
      size: "M / US 6",
      color: "Floral Cream",
      condition: ProductCondition.EXCELLENT,
      sku: "ME-DRS-003",
      stock: 1,
      images: ["/product/p5.jpg", "/product/p6.jpg"],
      measurements: { bust: "36 in", waist: "29 in", length: "46 in" },
      status: ProductStatus.PUBLISHED,
    },
    {
      name: "Saint Laurent Black Leather Slingback Pumps",
      slug: "saint-laurent-black-leather-slingback-pumps",
      description: "Classic YSL pointed-toe slingback heels in supple Italian patent leather. 85mm stiletto heel.",
      brand: "Saint Laurent",
      categoryId: categories[4].id,
      price: 16200,
      size: "EU 38 / US 7.5",
      color: "Black",
      condition: ProductCondition.GOOD,
      sku: "ME-SHOE-004",
      stock: 1,
      images: ["/product/p7.jpg"],
      measurements: { heelHeight: "3.3 in" },
      status: ProductStatus.PUBLISHED,
    },
    {
      name: "Vintage Dior Monogram Canvas Shoulder Pochette",
      slug: "vintage-dior-monogram-canvas-shoulder-pochette",
      description: "Rare 2000s John Galliano era Christian Dior Oblique canvas mini bag with patent leather trim.",
      brand: "Dior",
      categoryId: categories[1].id,
      price: 22000,
      size: "One Size",
      color: "Navy & Beige",
      condition: ProductCondition.EXCELLENT,
      sku: "ME-BAG-005",
      stock: 1,
      images: ["/product/p8.jpg", "/product/p9.jpg"],
      measurements: { width: "21 cm", height: "11 cm" },
      status: ProductStatus.PUBLISHED,
    },
    {
      name: "Silk Satin Corset Top in Champagne",
      slug: "silk-satin-corset-top-champagne",
      description: "Bespoke vintage satin corset with boning and lace-up back tie. Flattering hourglass silhouette.",
      brand: "Mica Ella Archive",
      categoryId: categories[3].id,
      price: 4850,
      size: "XS / S",
      color: "Champagne Gold",
      condition: ProductCondition.LIKE_NEW,
      sku: "ME-TOP-006",
      stock: 1,
      images: ["/product/p10.jpg"],
      status: ProductStatus.PUBLISHED,
    },
    {
      name: "Prada Nylon Mini Backpack in Nero Black",
      slug: "prada-nylon-mini-backpack-nero-black",
      description: "Classic Tessuto Prada black nylon backpack with enamel triangle logo. Purchased in Milan.",
      brand: "Prada",
      categoryId: categories[1].id,
      price: 19800,
      size: "One Size",
      color: "Black",
      condition: ProductCondition.EXCELLENT,
      sku: "ME-BAG-007",
      stock: 0,
      images: ["/product/p11.jpg", "/product/p12.jpg"],
      status: ProductStatus.SOLD,
    },
  ];

  const products = [];
  for (const prod of productsData) {
    const created = await prisma.product.upsert({
      where: { slug: prod.slug },
      update: prod,
      create: prod,
    });
    products.push(created);
  }
  console.log(`✅ Created ${products.length} products using /product images.`);

  // 4. Customers
  const customersData = [
    { name: "Camille Co", email: "camille.co@gmail.com", phone: "+639171234567" },
    { name: "Beatriz Alonzo", email: "beatriz.a@yahoo.com", phone: "+639189876543" },
    { name: "Janine Gutierrez", email: "janine.g@outlook.com", phone: "+639205551234" },
    { name: "Isabelle Daza", email: "isabelle.daza@gmail.com", phone: "+639178889900" },
    { name: "Patricia Prieto", email: "patricia.p@gmail.com", phone: "+639994443322" },
  ];

  const customers = [];
  for (const cust of customersData) {
    const created = await prisma.customer.upsert({
      where: { email: cust.email },
      update: cust,
      create: cust,
    });
    customers.push(created);
  }

  // 5. Orders & Status History
  const now = new Date();
  const daysAgo = (d: number) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000);

  const ordersData = [
    {
      orderNumber: "ME-2026-1001",
      customerId: customers[0].id,
      totalAmount: 28950,
      subtotal: 28500,
      shippingFee: 450,
      discountAmount: 0,
      status: OrderStatus.DELIVERED,
      paymentStatus: PaymentStatus.PAID,
      shippingAddress: { addressLine1: "123 Forbes Park", city: "Makati City", province: "Metro Manila", postalCode: "1219", country: "Philippines" },
      trackingNumber: "JT-PH-9988771",
      createdAt: daysAgo(5),
      productId: products[0].id,
      price: 28500,
    },
    {
      orderNumber: "ME-2026-1002",
      customerId: customers[1].id,
      totalAmount: 19350,
      subtotal: 18900,
      shippingFee: 450,
      discountAmount: 0,
      status: OrderStatus.SHIPPED,
      paymentStatus: PaymentStatus.PAID,
      shippingAddress: { addressLine1: "45 Corinthian Gardens", city: "Quezon City", province: "Metro Manila", postalCode: "1110", country: "Philippines" },
      trackingNumber: "LLM-882233",
      createdAt: daysAgo(2),
      productId: products[1].id,
      price: 18900,
    },
  ];

  for (const ord of ordersData) {
    const { productId, price, ...orderFields } = ord;

    const existingOrder = await prisma.order.findUnique({
      where: { orderNumber: ord.orderNumber },
    });

    if (!existingOrder) {
      await prisma.order.create({
        data: {
          ...orderFields,
          items: {
            create: [
              {
                productId,
                quantity: 1,
                price,
              },
            ],
          },
          statusHistory: {
            create: [
              {
                status: ord.status,
                note: `Order initial status set to ${ord.status}`,
                createdBy: admin.id,
              },
            ],
          },
        },
      });
    }
  }

  // 6. Founder Profile with /CEO pic.png
  await prisma.founderProfile.upsert({
    where: { id: "founder-micaela" },
    update: { name: "Mica Ella", bio: "Mica Ella is a Manila-based fashion curator and archivist with a passion for timeless, high-craftsmanship vintage and pre-loved luxury. ME was born out of a desire to redefine sustainable luxury fashion in the Philippines.", image: "/CEO pic.png" },
    create: {
      id: "founder-micaela",
      name: "Mica Ella",
      bio: "Mica Ella is a Manila-based fashion curator and archivist with a passion for timeless, high-craftsmanship vintage and pre-loved luxury. ME was born out of a desire to redefine sustainable luxury fashion in the Philippines.",
      image: "/CEO pic.png",
      quote: "Fashion should carry history, grace, and an unforgettable story.",
      socialLinks: {
        instagram: "https://instagram.com/micaella",
        facebook: "https://facebook.com/micaellaofficial",
        whatsapp: "https://wa.me/639999680628",
      },
      published: true,
    },
  });

  console.log("🎉 Database seeding with local assets completed!");
}

main()
  .catch((e) => {
    console.error("❌ Database seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
