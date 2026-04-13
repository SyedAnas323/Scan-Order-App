import "server-only";
import { PrismaClient } from "@prisma/client";
import { AppData, MenuCategory, MenuItem, Restaurant, Table, User } from "@/lib/types";
import { slugify } from "@/lib/utils";

const { PrismaPg } = require("@prisma/adapter-pg") as {
  PrismaPg: new (pool: unknown) => unknown;
};
const { Pool } = require("pg") as {
  Pool: new (options: { connectionString: string }) => unknown;
};

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaPool?: unknown;
};

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL or DIRECT_URL must be set for Prisma.");
}

const pool =
  globalForPrisma.prismaPool ??
  new Pool({
    connectionString
  });

const adapter = new PrismaPg(pool) as any;

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaPool = pool;
}

function mapSubscriptionStatus(status: string): User["subscriptionStatus"] {
  return status.toLowerCase() === "active" ? "active" : "pending";
}

function mapUser(record: {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  subscriptionStatus: string;
  restaurant?: { id: string } | null;
}): User {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    password: record.password,
    role: record.role as User["role"],
    restaurantId: record.restaurant?.id ?? "",
    subscriptionStatus: mapSubscriptionStatus(record.subscriptionStatus)
  };
}

function mapRestaurant(record: {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  address: string | null;
  whatsappNumber: string;
  currency: string;
  defaultLocale: string;
  logoUrl: string | null;
}): Restaurant {
  return {
    id: record.id,
    ownerId: record.ownerId,
    name: record.name,
    slug: record.slug,
    address: record.address ?? "",
    whatsappNumber: record.whatsappNumber,
    currency: record.currency,
    defaultLocale: record.defaultLocale as Restaurant["defaultLocale"],
    logoUrl: record.logoUrl ?? undefined
  };
}

function mapCategory(record: { id: string; restaurantId: string; name: string }): MenuCategory {
  return {
    id: record.id,
    restaurantId: record.restaurantId,
    name: record.name
  };
}

function mapMenuItem(record: {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description: string;
  price: { toNumber(): number };
  imageUrl: string | null;
  available: boolean;
  tags: string[];
}): MenuItem {
  return {
    id: record.id,
    restaurantId: record.restaurantId,
    categoryId: record.categoryId,
    name: record.name,
    description: record.description,
    price: record.price.toNumber(),
    imageUrl: record.imageUrl ?? undefined,
    available: record.available,
    tags: record.tags
  };
}

function mapTable(record: { id: string; restaurantId: string; name: string; number: number }): Table {
  return {
    id: record.id,
    restaurantId: record.restaurantId,
    name: record.name,
    number: record.number
  };
}

export async function readData(): Promise<AppData> {
  const [users, restaurants, categories, menuItems, tables] = await Promise.all([
    prisma.user.findMany({
      include: {
        restaurant: {
          select: {
            id: true
          }
        }
      }
    }),
    prisma.restaurant.findMany(),
    prisma.menuCategory.findMany(),
    prisma.menuItem.findMany(),
    prisma.table.findMany()
  ]);

  return {
    users: users.map(mapUser),
    restaurants: restaurants.map(mapRestaurant),
    categories: categories.map(mapCategory),
    menuItems: menuItems.map(mapMenuItem),
    tables: tables.map(mapTable)
  };
}

export async function writeData(data: AppData) {
  await prisma.$transaction(async (tx) => {
    await tx.subscription.deleteMany();
    await tx.menuItem.deleteMany();
    await tx.menuCategory.deleteMany();
    await tx.table.deleteMany();
    await tx.restaurant.deleteMany();
    await tx.user.deleteMany();

    for (const user of data.users) {
      await tx.user.create({
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role,
          subscriptionStatus: user.subscriptionStatus.toUpperCase() as "PENDING" | "ACTIVE"
        }
      });
    }

    for (const restaurant of data.restaurants) {
      await tx.restaurant.create({
        data: {
          id: restaurant.id,
          ownerId: restaurant.ownerId,
          name: restaurant.name,
          slug: restaurant.slug,
          address: restaurant.address,
          whatsappNumber: restaurant.whatsappNumber,
          currency: restaurant.currency,
          defaultLocale: restaurant.defaultLocale,
          logoUrl: restaurant.logoUrl
        }
      });
    }

    for (const category of data.categories) {
      await tx.menuCategory.create({
        data: category
      });
    }

    for (const item of data.menuItems) {
      await tx.menuItem.create({
        data: {
          id: item.id,
          restaurantId: item.restaurantId,
          categoryId: item.categoryId,
          name: item.name,
          description: item.description,
          price: item.price,
          imageUrl: item.imageUrl,
          available: item.available,
          tags: item.tags
        }
      });
    }

    for (const table of data.tables) {
      await tx.table.create({
        data: table
      });
    }
  });
}

export async function createPendingRestaurant(input: {
  ownerName: string;
  email: string;
  password: string;
  restaurantName: string;
  whatsappNumber: string;
}) {
  const existing = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
    include: {
      restaurant: {
        select: {
          id: true
        }
      }
    }
  });

  if (existing) {
    return mapUser(existing);
  }

  const slugBase = slugify(input.restaurantName) || "restaurant";
  let slug = slugBase;
  let counter = 2;

  while (await prisma.restaurant.findUnique({ where: { slug } })) {
    slug = `${slugBase}-${counter}`;
    counter += 1;
  }

  const created = await prisma.user.create({
    data: {
      name: input.ownerName,
      email: input.email.toLowerCase(),
      password: input.password,
      role: "restaurant",
      subscriptionStatus: "PENDING",
      restaurant: {
        create: {
          name: input.restaurantName,
          slug,
          address: "",
          whatsappNumber: input.whatsappNumber,
          currency: "PKR",
          defaultLocale: "en"
        }
      }
    },
    include: {
      restaurant: {
        select: {
          id: true
        }
      }
    }
  });

  return mapUser(created);
}

export async function activateSubscription(userId: string) {
  const existing = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      restaurant: {
        select: {
          id: true
        }
      }
    }
  });

  if (!existing) {
    return null;
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { subscriptionStatus: "ACTIVE" },
    include: {
      restaurant: {
        select: {
          id: true
        }
      }
    }
  });

  return mapUser(updated);
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      restaurant: {
        select: {
          id: true
        }
      }
    }
  });

  return user ? mapUser(user) : null;
}

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findFirst({
    where: {
      email: email.toLowerCase(),
      password,
      subscriptionStatus: "ACTIVE"
    },
    include: {
      restaurant: {
        select: {
          id: true
        }
      }
    }
  });

  return user ? mapUser(user) : null;
}

export async function getRestaurantBundleByUserId(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      restaurant: {
        include: {
          categories: true,
          menuItems: true,
          tables: true
        }
      }
    }
  });

  if (!user?.restaurant) {
    return null;
  }

  return {
    user: mapUser(user),
    restaurant: mapRestaurant(user.restaurant),
    categories: user.restaurant.categories.map(mapCategory),
    menuItems: user.restaurant.menuItems.map(mapMenuItem),
    tables: user.restaurant.tables.map(mapTable)
  };
}

export async function getRestaurantBySlug(slug: string) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    include: {
      categories: true,
      menuItems: true,
      tables: true
    }
  });

  if (!restaurant) {
    return null;
  }

  return {
    restaurant: mapRestaurant(restaurant),
    categories: restaurant.categories.map(mapCategory),
    menuItems: restaurant.menuItems.map(mapMenuItem),
    tables: restaurant.tables.map(mapTable)
  };
}

export async function addCategory(restaurantId: string, name: string) {
  const category = await prisma.menuCategory.create({
    data: {
      restaurantId,
      name
    }
  });

  return mapCategory(category);
}

export async function addMenuItem(restaurantId: string, input: Omit<MenuItem, "id" | "restaurantId">) {
  const item = await prisma.menuItem.create({
    data: {
      restaurantId,
      categoryId: input.categoryId,
      name: input.name,
      description: input.description,
      price: input.price,
      imageUrl: input.imageUrl,
      available: input.available,
      tags: input.tags
    }
  });

  return mapMenuItem(item);
}

export async function addTable(restaurantId: string, input: Pick<Table, "name" | "number">) {
  const table = await prisma.table.create({
    data: {
      restaurantId,
      name: input.name,
      number: input.number
    }
  });

  return mapTable(table);
}

export async function updateRestaurantSettings(
  restaurantId: string,
  input: Pick<Restaurant, "address" | "currency" | "whatsappNumber" | "defaultLocale">
) {
  const restaurant = await prisma.restaurant.update({
    where: { id: restaurantId },
    data: {
      address: input.address,
      currency: input.currency,
      whatsappNumber: input.whatsappNumber,
      defaultLocale: input.defaultLocale
    }
  }).catch(() => null);

  return restaurant ? mapRestaurant(restaurant) : null;
}
