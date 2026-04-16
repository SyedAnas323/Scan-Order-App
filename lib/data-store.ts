import "server-only";
import { unstable_cache } from "next/cache";
import { PrismaClient } from "@prisma/client";
import {
  AdminActivity,
  AdminDashboardData,
  AdminOrder,
  AppData,
  MenuCategory,
  MenuItem,
  Restaurant,
  RestaurantOwnerRequest,
  Table,
  User
} from "@/lib/types";
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

function normalizeConnectionString(value?: string) {
  if (!value) {
    return "";
  }

  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

// On Vercel/serverless, prefer the pooled connection string.
const connectionString = normalizeConnectionString(process.env.DATABASE_URL) || normalizeConnectionString(process.env.DIRECT_URL);

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

const prismaUnsafe = prisma as any;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaPool = pool;
}

function mapSubscriptionStatus(status: string): User["subscriptionStatus"] {
  const normalized = status.toLowerCase();

  if (normalized === "active") {
    return "active";
  }

  if (normalized === "canceled" || normalized === "past_due") {
    return "canceled";
  }

  return "pending";
}

function toPrismaSubscriptionStatus(status: User["subscriptionStatus"]): "PENDING" | "ACTIVE" | "CANCELED" | "PAST_DUE" {
  if (status === "active") {
    return "ACTIVE";
  }

  if (status === "canceled") {
    return "CANCELED";
  }

  return "PENDING";
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

function mapAdminOrder(record: any): AdminOrder {
  return {
    id: record.id,
    restaurantId: record.restaurantId,
    restaurantName: record.restaurant?.name ?? "Unknown restaurant",
    tableName: record.table?.name ?? undefined,
    customerName: record.customerName,
    status: record.status.toLowerCase(),
    totalAmount: typeof record.totalAmount?.toNumber === "function" ? record.totalAmount.toNumber() : Number(record.totalAmount ?? 0),
    source: record.source,
    createdAt: record.createdAt.toISOString(),
    items: (record.items ?? []).map((item: any) => ({
      id: item.id,
      menuItemName: item.menuItemName,
      quantity: item.quantity,
      unitPrice: typeof item.unitPrice?.toNumber === "function" ? item.unitPrice.toNumber() : Number(item.unitPrice ?? 0),
      lineTotal: typeof item.lineTotal?.toNumber === "function" ? item.lineTotal.toNumber() : Number(item.lineTotal ?? 0)
    }))
  };
}

function mapAdminActivity(record: any): AdminActivity {
  return {
    id: record.id,
    actorType: record.actorType,
    actorName: record.actorName,
    action: record.action,
    details: record.details,
    restaurantName: record.restaurant?.name ?? undefined,
    createdAt: record.createdAt.toISOString()
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
          subscriptionStatus: toPrismaSubscriptionStatus(user.subscriptionStatus)
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

  await logAdminActivity({
    actorType: "restaurant_owner",
    actorName: input.ownerName,
    action: "signup_request",
    details: `${input.ownerName} created a signup request for ${input.restaurantName}.`,
    restaurantId: created.restaurant?.id
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

  if (user) {
    await logAdminActivity({
      actorType: "restaurant_owner",
      actorName: user.name,
      action: "login",
      details: `${user.name} logged into the platform.`,
      restaurantId: user.restaurant?.id ?? undefined,
      userId: user.id
    });
  }

  return user ? mapUser(user) : null;
}

export async function hasSeenWelcome(userId: string) {
  if (!prismaUnsafe.activityLog) {
    return false;
  }

  const existing = await prismaUnsafe.activityLog.findFirst({
    where: {
      userId,
      action: "welcome_seen"
    },
    select: {
      id: true
    }
  }).catch(() => null);

  return Boolean(existing);
}

export async function markWelcomeSeen(input: {
  userId: string;
  actorName: string;
  restaurantId?: string;
}) {
  const alreadySeen = await hasSeenWelcome(input.userId);
  if (alreadySeen) {
    return null;
  }

  return logAdminActivity({
    actorType: "restaurant_owner",
    actorName: input.actorName,
    action: "welcome_seen",
    details: `${input.actorName} viewed the first-time welcome page.`,
    restaurantId: input.restaurantId,
    userId: input.userId
  });
}

export async function getRestaurantOwnerRequests(): Promise<RestaurantOwnerRequest[]> {
  const users = await prisma.user.findMany({
    where: {
      role: "restaurant"
    },
    include: {
      restaurant: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return users.map((record) => ({
    user: mapUser(record),
    restaurant: record.restaurant ? mapRestaurant(record.restaurant) : null,
    createdAt: record.createdAt.toISOString()
  }));
}

export async function getAdminUsers() {
  const users = await prisma.user.findMany({
    include: {
      restaurant: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return users.map((user) => ({
    user: mapUser(user),
    restaurant: user.restaurant ? mapRestaurant(user.restaurant) : null,
    createdAt: user.createdAt.toISOString()
  }));
}

export async function getAdminRestaurants() {
  const restaurants = await prisma.restaurant.findMany({
    include: {
      owner: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return restaurants.map((restaurant) => ({
    restaurant: mapRestaurant(restaurant),
    owner: mapUser({
      ...restaurant.owner,
      restaurant: {
        id: restaurant.id
      }
    }),
    createdAt: restaurant.createdAt.toISOString()
  }));
}

export async function getAdminSummary() {
  const [restaurantCount, userCount] = await Promise.all([prisma.restaurant.count(), prisma.user.count()]);

  return {
    restaurantCount,
    userCount
  };
}

export async function logAdminActivity(input: {
  actorType: "admin" | "restaurant_owner" | "customer";
  actorName: string;
  action: string;
  details: string;
  restaurantId?: string;
  userId?: string;
}) {
  if (!prismaUnsafe.activityLog) {
    return null;
  }

  return prismaUnsafe.activityLog.create({
    data: {
      actorType: input.actorType,
      actorName: input.actorName,
      action: input.action,
      details: input.details,
      restaurantId: input.restaurantId,
      userId: input.userId
    }
  }).catch(() => null);
}

export async function createCustomerOrder(input: {
  restaurantId: string;
  tableId?: string;
  customerName: string;
  source?: string;
  items: Array<{
    menuItemName: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
}) {
  if (!prismaUnsafe.order) {
    return null;
  }

  const totalAmount = input.items.reduce((sum, item) => sum + item.lineTotal, 0);
  const order = await prismaUnsafe.order.create({
    data: {
      restaurantId: input.restaurantId,
      tableId: input.tableId,
      customerName: input.customerName,
      status: "PENDING",
      totalAmount,
      source: input.source ?? "whatsapp",
      items: {
        create: input.items.map((item) => ({
          menuItemName: item.menuItemName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          lineTotal: item.lineTotal
        }))
      }
    },
    include: {
      restaurant: true,
      table: true,
      items: true
    }
  }).catch(() => null);

  if (order) {
    await logAdminActivity({
      actorType: "customer",
      actorName: input.customerName,
      action: "order_created",
      details: `${input.customerName} placed an order with ${input.items.length} items.`,
      restaurantId: input.restaurantId
    });
  }

  return order ? mapAdminOrder(order) : null;
}

export async function updateOrderStatus(orderId: string, status: "pending" | "completed" | "canceled") {
  if (!prismaUnsafe.order) {
    return null;
  }

  const order = await prismaUnsafe.order.update({
    where: { id: orderId },
    data: {
      status: status.toUpperCase()
    },
    include: {
      restaurant: true,
      table: true,
      items: true
    }
  }).catch(() => null);

  if (order) {
    await logAdminActivity({
      actorType: "admin",
      actorName: "Admin",
      action: "order_status_updated",
      details: `Order ${order.id} marked as ${status}.`,
      restaurantId: order.restaurantId
    });
  }

  return order ? mapAdminOrder(order) : null;
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const signupRequests = await getRestaurantOwnerRequests();
  const [recentOrdersRaw, recentActivityRaw] = await Promise.all([
    prismaUnsafe.order
      ? prismaUnsafe.order.findMany({
          include: {
            restaurant: true,
            table: true,
            items: true
          },
          orderBy: {
            createdAt: "desc"
          },
          take: 12
        })
      : Promise.resolve([]),
    prismaUnsafe.activityLog
      ? prismaUnsafe.activityLog.findMany({
          include: {
            restaurant: true
          },
          orderBy: {
            createdAt: "desc"
          },
          take: 20
        })
      : Promise.resolve([])
  ]);

  const recentOrders = recentOrdersRaw.map(mapAdminOrder);
  const recentActivity = recentActivityRaw.map(mapAdminActivity);
  const lastTenMinutes = Date.now() - 10 * 60 * 1000;

  const onlineOwners = recentActivity
    .filter((entry: AdminActivity) => entry.actorType === "restaurant_owner" && new Date(entry.createdAt).getTime() >= lastTenMinutes)
    .map((entry: AdminActivity) => ({
      id: entry.id,
      name: entry.actorName,
      restaurantName: entry.restaurantName,
      lastSeenAt: entry.createdAt
    }));

  const onlineCustomers = recentActivity
    .filter((entry: AdminActivity) => entry.actorType === "customer" && new Date(entry.createdAt).getTime() >= lastTenMinutes)
    .map((entry: AdminActivity) => ({
      id: entry.id,
      name: entry.actorName,
      restaurantName: entry.restaurantName,
      lastSeenAt: entry.createdAt
    }));

  return {
    signupRequests,
    recentOrders,
    recentActivity,
    onlineOwners,
    onlineCustomers
  };
}

export async function trackCustomerMenuVisit(input: {
  restaurantId: string;
  customerName: string;
  tableName?: string;
}) {
  return logAdminActivity({
    actorType: "customer",
    actorName: input.customerName,
    action: "menu_opened",
    details: `${input.customerName} opened the menu${input.tableName ? ` for ${input.tableName}` : ""}.`,
    restaurantId: input.restaurantId
  });
}

export async function updateRestaurantOwnerStatus(userId: string, status: User["subscriptionStatus"]) {
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

  if (!existing || existing.role !== "restaurant") {
    return null;
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionStatus: toPrismaSubscriptionStatus(status)
    },
    include: {
      restaurant: {
        select: {
          id: true
        }
      }
    }
  }).catch(() => null);

  return user ? mapUser(user) : null;
}

export async function updateUserSubscriptionStatus(userId: string, status: User["subscriptionStatus"]) {
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

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionStatus: toPrismaSubscriptionStatus(status)
    },
    include: {
      restaurant: {
        select: {
          id: true
        }
      }
    }
  }).catch(() => null);

  return user ? mapUser(user) : null;
}

export async function deleteUserById(userId: string) {
  const existing = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      restaurant: true
    }
  });

  if (!existing) {
    return false;
  }

  await prisma.$transaction(async (tx) => {
    if (existing.restaurant) {
      if ((tx as any).orderItem && (tx as any).order) {
        await (tx as any).orderItem.deleteMany({
          where: {
            order: {
              restaurantId: existing.restaurant.id
            }
          }
        });
        await (tx as any).order.deleteMany({
          where: {
            restaurantId: existing.restaurant.id
          }
        });
      }

      if ((tx as any).activityLog) {
        await (tx as any).activityLog.deleteMany({
          where: {
            OR: [{ restaurantId: existing.restaurant.id }, { userId }]
          }
        });
      }

      await tx.subscription.deleteMany({
        where: {
          restaurantId: existing.restaurant.id
        }
      });
      await tx.menuItem.deleteMany({
        where: {
          restaurantId: existing.restaurant.id
        }
      });
      await tx.menuCategory.deleteMany({
        where: {
          restaurantId: existing.restaurant.id
        }
      });
      await tx.table.deleteMany({
        where: {
          restaurantId: existing.restaurant.id
        }
      });
      await tx.restaurant.delete({
        where: {
          id: existing.restaurant.id
        }
      });
    }

    await tx.user.delete({
      where: {
        id: userId
      }
    });
  });

  return true;
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

const getCachedPublicRestaurants = unstable_cache(
  async () =>
    prisma.restaurant.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        address: true,
        currency: true,
        whatsappNumber: true,
        defaultLocale: true,
        logoUrl: true
      },
      orderBy: {
        name: "asc"
      }
    }),
  ["public-restaurants"],
  { revalidate: 120 }
);

export async function getPublicRestaurants() {
  return getCachedPublicRestaurants();
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

export async function updateMenuItem(
  restaurantId: string,
  itemId: string,
  input: Omit<MenuItem, "id" | "restaurantId">
) {
  const updated = await prisma.menuItem.updateMany({
    where: {
      id: itemId,
      restaurantId
    },
    data: {
      categoryId: input.categoryId,
      name: input.name,
      description: input.description,
      price: input.price,
      imageUrl: input.imageUrl || null,
      available: input.available,
      tags: input.tags
    }
  });

  if (!updated.count) {
    return null;
  }

  const record = await prisma.menuItem.findUnique({ where: { id: itemId } });
  return record ? mapMenuItem(record) : null;
}

export async function deleteMenuItem(restaurantId: string, itemId: string) {
  const deleted = await prisma.menuItem.deleteMany({
    where: {
      id: itemId,
      restaurantId
    }
  });

  return deleted.count > 0;
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
  input: Pick<Restaurant, "address" | "currency" | "whatsappNumber" | "defaultLocale" | "logoUrl">
) {
  const restaurant = await prisma.restaurant.update({
    where: { id: restaurantId },
    data: {
      address: input.address,
      currency: input.currency,
      whatsappNumber: input.whatsappNumber,
      defaultLocale: input.defaultLocale,
      logoUrl: input.logoUrl || null
    }
  }).catch(() => null);

  return restaurant ? mapRestaurant(restaurant) : null;
}
