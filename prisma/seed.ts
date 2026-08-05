import { PrismaClient, Role, ProductCondition, ProductStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Neon PostgreSQL database for ME (Mica Ella)...");

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

  // 2. Categories
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

  // 3. Products with price = 40 PHP and costPrice = 15 PHP
  const productsData = [
    {
      name: "Vintage Chanel Tweed Structured Blazer",
      slug: "vintage-chanel-tweed-structured-blazer",
      description: "Timeless Chanel black tweed jacket with gold lion buttons. 100% wool exterior with silk camellia lining. Exceptional condition.",
      brand: "Chanel",
      categoryId: categories[2].id,
      price: 40.0,
      costPrice: 15.0,
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
      price: 40.0,
      costPrice: 15.0,
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
      price: 40.0,
      costPrice: 15.0,
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
      price: 40.0,
      costPrice: 15.0,
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
      price: 40.0,
      costPrice: 15.0,
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
      price: 40.0,
      costPrice: 15.0,
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
      price: 40.0,
      costPrice: 15.0,
      size: "One Size",
      color: "Black",
      condition: ProductCondition.EXCELLENT,
      sku: "ME-BAG-007",
      stock: 1,
      images: ["/product/p11.jpg", "/product/p12.jpg"],
      status: ProductStatus.PUBLISHED,
    },
  ];

  for (const prod of productsData) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: prod,
      create: prod,
    });
  }
  console.log(`✅ Configured ${productsData.length} products with price = ₱40 and costPrice = ₱15.`);

  // 4. Founder Profile
  await prisma.founderProfile.upsert({
    where: { id: "founder-micaela" },
    update: {
      name: "Mica Ella",
      bio: "Mica Ella is a Manila-based fashion curator and archivist with a passion for timeless, high-craftsmanship vintage and pre-loved luxury. ME was born out of a desire to redefine sustainable luxury fashion in the Philippines.",
      image: "/CEO pic.png",
    },
    create: {
      id: "founder-micaela",
      name: "Mica Ella",
      bio: "Mica Ella is a Manila-based fashion curator and archivist with a passion for timeless, high-craftsmanship vintage and pre-loved luxury. ME was born out of a desire to redefine sustainable luxury fashion in the Philippines.",
      image: "/CEO pic.png",
      quote: "Fashion should carry history, grace, and an unforgettable story.",
      socialLinks: {
        instagram: "https://instagram.com/micaella",
        facebook: "https://www.facebook.com/marketplace/profile/100036193924898/?product_id=1907082703308799",
        whatsapp: "https://wa.me/639999680628",
      },
      published: true,
    },
  });

  console.log("🎉 Database seeding completed with zero demo orders for clean production deployment!");
}

main()
  .catch((e) => {
    console.error("❌ Database seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
