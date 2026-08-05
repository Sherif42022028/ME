import { PrismaClient, Role, ProductCondition, ProductStatus, OrderStatus, PaymentStatus, EventType, MessageSender, MessageStatus, ConversationStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Neon PostgreSQL database seed for ME (Micaela Ella)...");

  // 1. Initial Admin User from Environment Variables
  const adminEmail = (process.env.ADMIN_EMAIL || "micaela.ella.admin@gmail.com").trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "MeAdminPass2026!Secure";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "Micaela Ella (Owner)",
      passwordHash,
      role: Role.ADMIN,
    },
    create: {
      name: "Micaela Ella (Owner)",
      email: adminEmail,
      passwordHash,
      role: Role.ADMIN,
    },
  });

  console.log(`✅ Admin account configured: ${admin.email}`);

  // Create Staff user
  const staff = await prisma.user.upsert({
    where: { email: "staff@micaelaella.com" },
    update: {},
    create: {
      name: "Sophia Santos (Operations)",
      email: "staff@micaelaella.com",
      passwordHash: await bcrypt.hash("StaffPass2026!", 10),
      role: Role.STAFF,
    },
  });

  // 2. Categories
  const categoriesData = [
    { name: "Dresses & Gowns", slug: "dresses-gowns", description: "Curated pre-loved evening dresses, gowns, and silk slips.", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80" },
    { name: "Luxury Bags", slug: "luxury-bags", description: "Authenticated designer handbags and leather totes.", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80" },
    { name: "Outerwear & Blazers", slug: "outerwear-blazers", description: "Structured vintage blazers, trench coats, and jackets.", image: "https://images.unsplash.com/photo-1548624149-f1e4004944d1?w=800&q=80" },
    { name: "Tops & Corsets", slug: "tops-corsets", description: "Feminine silk blouses, corsets, and knit tops.", image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&q=80" },
    { name: "Footwear", slug: "footwear", description: "Pre-loved heels, mules, and designer boots.", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80" },
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
  console.log(`✅ Created ${categories.length} categories.`);

  // 3. One-of-One Products
  const productsData = [
    {
      name: "Vintage Chanel Tweed Structured Blazer",
      slug: "vintage-chanel-tweed-structured-blazer",
      description: "Timeless 1990s Chanel black tweed jacket with gold lion buttons. 100% wool exterior with silk camellia lining. Exceptional condition.",
      brand: "Chanel",
      categoryId: categories[2].id, // Outerwear
      price: 28500,
      size: "S / EU 36",
      color: "Black & Gold",
      condition: ProductCondition.EXCELLENT,
      sku: "ME-BLZ-001",
      stock: 1,
      images: [
        "https://images.unsplash.com/photo-1548624149-f1e4004944d1?w=800&q=80",
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80"
      ],
      measurements: { bust: "34 in", waist: "28 in", length: "24 in" },
      status: ProductStatus.PUBLISHED,
    },
    {
      name: "Jacquemus Le Chiquito Moyen Pink Leather Bag",
      slug: "jacquemus-le-chiquito-moyen-pink-leather-bag",
      description: "Iconic Jacquemus signature bag in soft blush pink smooth calfskin. Includes detachable shoulder strap and original dust bag.",
      brand: "Jacquemus",
      categoryId: categories[1].id, // Bags
      price: 18900,
      size: "One Size",
      color: "Blush Pink",
      condition: ProductCondition.LIKE_NEW,
      sku: "ME-BAG-002",
      stock: 1,
      images: [
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80"
      ],
      measurements: { width: "18 cm", height: "13.5 cm", depth: "8 cm" },
      status: ProductStatus.PUBLISHED,
    },
    {
      name: "Zimmermann Silk Floral Cutout Midi Dress",
      slug: "zimmermann-silk-floral-cutout-midi-dress",
      description: "Ethereal Zimmermann 100% silk chiffon midi dress with delicate botanical floral print and waist cutouts.",
      brand: "Zimmermann",
      categoryId: categories[0].id, // Dresses
      price: 14500,
      size: "M / US 6",
      color: "Floral Cream",
      condition: ProductCondition.EXCELLENT,
      sku: "ME-DRS-003",
      stock: 1,
      images: [
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
        "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80"
      ],
      measurements: { bust: "36 in", waist: "29 in", length: "46 in" },
      status: ProductStatus.PUBLISHED,
    },
    {
      name: "Saint Laurent Black Leather Slingback Pumps",
      slug: "saint-laurent-black-leather-slingback-pumps",
      description: "Classic YSL pointed-toe slingback heels in supple Italian patent leather. 85mm stiletto heel.",
      brand: "Saint Laurent",
      categoryId: categories[4].id, // Footwear
      price: 16200,
      size: "EU 38 / US 7.5",
      color: "Black",
      condition: ProductCondition.GOOD,
      sku: "ME-SHOE-004",
      stock: 1,
      images: [
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80"
      ],
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
      images: [
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80"
      ],
      measurements: { width: "21 cm", height: "11 cm" },
      status: ProductStatus.PUBLISHED,
    },
    {
      name: "Silk Satin Corset Top in Champagne",
      slug: "silk-satin-corset-top-champagne",
      description: "Bespoke vintage satin corset with boning and lace-up back tie. Flattering hourglass silhouette.",
      brand: "Micaela Ella Archive",
      categoryId: categories[3].id,
      price: 4850,
      size: "XS / S",
      color: "Champagne Gold",
      condition: ProductCondition.LIKE_NEW,
      sku: "ME-TOP-006",
      stock: 1,
      images: [
        "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&q=80"
      ],
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
      images: [
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80"
      ],
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
  console.log(`✅ Created ${products.length} products.`);

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
  console.log(`✅ Created ${customers.length} customers.`);

  // 5. Orders & Order Histories
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
      productId: products[0].id, // Chanel Blazer
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
      productId: products[1].id, // Jacquemus
      price: 18900,
    },
    {
      orderNumber: "ME-2026-1003",
      customerId: customers[2].id,
      totalAmount: 14950,
      subtotal: 14500,
      shippingFee: 450,
      discountAmount: 0,
      status: OrderStatus.PROCESSING,
      paymentStatus: PaymentStatus.PAID,
      shippingAddress: { addressLine1: "88 Bonifacio Ridge", city: "Taguig City", province: "Metro Manila", postalCode: "1634", country: "Philippines" },
      createdAt: daysAgo(1),
      productId: products[2].id, // Zimmermann
      price: 14500,
    },
    {
      orderNumber: "ME-2026-1004",
      customerId: customers[3].id,
      totalAmount: 16650,
      subtotal: 16200,
      shippingFee: 450,
      discountAmount: 0,
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      shippingAddress: { addressLine1: "12 Ayala Alabang Village", city: "Muntinlupa", province: "Metro Manila", postalCode: "1780", country: "Philippines" },
      createdAt: daysAgo(0),
      productId: products[3].id, // YSL Shoes
      price: 16200,
    },
  ];

  for (const ord of ordersData) {
    const { productId, price, ...orderFields } = ord;

    const existingOrder = await prisma.order.findUnique({
      where: { orderNumber: ord.orderNumber },
    });

    if (!existingOrder) {
      const createdOrder = await prisma.order.create({
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
          payments: {
            create: [
              {
                amount: ord.totalAmount,
                currency: "PHP",
                status: ord.paymentStatus,
                provider: "PayMongo GCash / Maya",
                transactionId: `PAY-${Math.floor(Math.random() * 899999 + 100000)}`,
              },
            ],
          },
        },
      });

      // Update customer total spent
      await prisma.customer.update({
        where: { id: ord.customerId },
        data: {
          totalSpent: { increment: ord.paymentStatus === PaymentStatus.PAID ? ord.totalAmount : 0 },
          orderCount: { increment: 1 },
        },
      });
    }
  }
  console.log(`✅ Orders and status histories seeded.`);

  // 6. Analytics Events (First-Party Event Log for Revenue, Funnel & Traffic analytics)
  console.log("📊 Seeding analytics traffic events...");
  const eventTypes = [
    { type: EventType.PAGE_VIEW, ratio: 0.5 },
    { type: EventType.PRODUCT_VIEW, ratio: 0.25 },
    { type: EventType.ADD_TO_CART, ratio: 0.12 },
    { type: EventType.CHECKOUT_STARTED, ratio: 0.08 },
    { type: EventType.PURCHASE, ratio: 0.05 },
  ];

  const trafficSources = ["Instagram", "Direct", "Facebook", "Google", "WhatsApp"];

  // Seed events for the past 30 days
  const eventsToCreate = [];
  for (let d = 30; d >= 0; d--) {
    const countForDay = Math.floor(Math.random() * 25) + 15;
    for (let i = 0; i < countForDay; i++) {
      const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)].type;
      const randomSource = trafficSources[Math.floor(Math.random() * trafficSources.length)];
      const randomProd = products[Math.floor(Math.random() * products.length)];

      eventsToCreate.push({
        sessionId: `sess_${d}_${i}_${Math.random().toString(36).substring(7)}`,
        eventType: randomType,
        page: randomType === EventType.PRODUCT_VIEW ? `/products/${randomProd.slug}` : "/",
        productId: randomType === EventType.PRODUCT_VIEW || randomType === EventType.ADD_TO_CART ? randomProd.id : null,
        source: randomSource,
        createdAt: daysAgo(d),
      });
    }
  }

  await prisma.analyticsEvent.createMany({ data: eventsToCreate });
  console.log(`✅ Seeded ${eventsToCreate.length} analytics events.`);

  // 7. WhatsApp Conversations
  const waConv = await prisma.whatsAppConversation.upsert({
    where: { id: "conv-camille-1" },
    update: {},
    create: {
      id: "conv-camille-1",
      customerId: customers[0].id,
      customerPhone: customers[0].phone || "+639171234567",
      customerName: customers[0].name,
      lastMessage: "Hi ME! Is the Vintage Chanel Blazer still available?",
      unreadCount: 1,
      status: ConversationStatus.OPEN,
      relatedProductId: products[0].id,
      messages: {
        create: [
          {
            sender: MessageSender.CUSTOMER,
            text: "Hi ME! I'm interested in the Vintage Chanel Tweed Structured Blazer.\nProduct ID: ME-BLZ-001\nPrice: ₱28,500\nIs it still available?",
            status: MessageStatus.DELIVERED,
            wamid: "wamid.HBgLMjAyNjAwMDAx",
          },
          {
            sender: MessageSender.ADMIN,
            text: "Hi Camille! Yes, it's available and 100% authenticated. Would you like us to hold it for you?",
            status: MessageStatus.READ,
          },
          {
            sender: MessageSender.CUSTOMER,
            text: "Yes please! Processing my payment via GCash now.",
            status: MessageStatus.READ,
          },
        ],
      },
    },
  });

  console.log(`✅ Seeded WhatsApp Conversation.`);

  // 8. Founder Profile & Site Content
  await prisma.founderProfile.upsert({
    where: { id: "founder-micaela" },
    update: {},
    create: {
      id: "founder-micaela",
      name: "Micaela Ella",
      bio: "Micaela Ella is a Manila-based fashion curator and archivist with a passion for timeless, high-craftsmanship vintage and pre-loved luxury. ME was born out of a desire to redefine sustainable luxury fashion in the Philippines.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
      quote: "Fashion should carry history, grace, and an unforgettable story.",
      socialLinks: {
        instagram: "https://instagram.com/micaelaella",
        facebook: "https://facebook.com/micaelaellaofficial",
        whatsapp: "https://wa.me/639171234567",
      },
      published: true,
    },
  });

  // Discounts
  await prisma.discount.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      type: "PERCENTAGE",
      value: 10,
      minimumOrder: 5000,
      usageLimit: 100,
      usedCount: 14,
      active: true,
    },
  });

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Database seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
