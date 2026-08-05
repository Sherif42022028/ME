import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL || "mica.ella.admin@gmail.com").trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "MeAdminPass2026!Secure";

  console.log(`🔍 Checking Admin User in Neon PostgreSQL: ${adminEmail}`);

  let user = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!user) {
    console.log("⚠️ Admin user not found. Creating admin user now...");
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    user = await prisma.user.create({
      data: {
        name: "Mica Ella (Owner)",
        email: adminEmail,
        passwordHash,
        role: Role.ADMIN,
      },
    });
    console.log("✅ Admin user created successfully!");
  } else {
    console.log(`✅ Admin user exists: ${user.name} (${user.email}) - Role: ${user.role}`);
    // Ensure password matches ADMIN_PASSWORD
    const isPasswordValid = await bcrypt.compare(adminPassword, user.passwordHash);
    if (!isPasswordValid) {
      console.log("🔄 Updating admin password hash...");
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash, role: Role.ADMIN },
      });
      console.log("✅ Admin password updated.");
    }
  }

  const allUsers = await prisma.user.findMany();
  console.table(allUsers.map((u) => ({ id: u.id, email: u.email, role: u.role })));
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
