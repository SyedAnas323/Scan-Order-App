import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL or DIRECT_URL must be set before seeding.");
}

const pool = new Pool({
  connectionString
});

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool) as any
});

async function main() {
  const email = "demo@sofraqr.com";

  await prisma.user.upsert({
    where: { email },
    update: {
      name: "Demo Restaurant",
      password: "demo1234",
      role: "restaurant",
      subscriptionStatus: "ACTIVE",
      restaurant: {
        upsert: {
          update: {
            name: "Mehfil Grill",
            slug: "mehfil-grill",
            whatsappNumber: "+923464777625",
            currency: "PKR",
            defaultLocale: "en"
          },
          create: {
            name: "Mehfil Grill",
            slug: "mehfil-grill",
            whatsappNumber: "+923464777625",
            currency: "PKR",
            defaultLocale: "en"
          }
        }
      }
    },
    create: {
      name: "Demo Restaurant",
      email,
      password: "demo1234",
      role: "restaurant",
      subscriptionStatus: "ACTIVE",
      restaurant: {
        create: {
          name: "Mehfil Grill",
          slug: "mehfil-grill",
          whatsappNumber: "+923464777625",
          currency: "PKR",
          defaultLocale: "en"
        }
      }
    }
  });

  console.log("Seed completed: demo@sofraqr.com / demo1234");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
