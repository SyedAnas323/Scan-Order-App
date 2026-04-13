import { promises as fs } from "fs";
import path from "path";
import { seedData } from "@/data/seed";
import { AppData, MenuCategory, MenuItem, Restaurant, Table, User } from "@/lib/types";
import { createId, slugify } from "@/lib/utils";

const dataPath = path.join(process.cwd(), "data", "runtime.json");

async function ensureDataFile() {
  try {
    await fs.access(dataPath);
  } catch {
    await fs.mkdir(path.dirname(dataPath), { recursive: true });
    await fs.writeFile(dataPath, JSON.stringify(seedData, null, 2), "utf8");
  }
}

export async function readData(): Promise<AppData> {
  await ensureDataFile();
  const raw = await fs.readFile(dataPath, "utf8");
  return JSON.parse(raw) as AppData;
}

export async function writeData(data: AppData) {
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2), "utf8");
}

export async function createPendingRestaurant(input: {
  ownerName: string;
  email: string;
  password: string;
  restaurantName: string;
  whatsappNumber: string;
}) {
  const data = await readData();
  const existing = data.users.find((user) => user.email.toLowerCase() === input.email.toLowerCase());

  if (existing) {
    return existing;
  }

  const restaurantId = createId("rest");
  const userId = createId("user");
  const slugBase = slugify(input.restaurantName) || createId("restaurant");
  const duplicateCount = data.restaurants.filter((restaurant) => restaurant.slug.startsWith(slugBase)).length;
  const slug = duplicateCount ? `${slugBase}-${duplicateCount + 1}` : slugBase;

  const user: User = {
    id: userId,
    name: input.ownerName,
    email: input.email,
    password: input.password,
    role: "restaurant",
    restaurantId,
    subscriptionStatus: "pending"
  };

  const restaurant: Restaurant = {
    id: restaurantId,
    ownerId: userId,
    name: input.restaurantName,
    slug,
    address: "",
    whatsappNumber: input.whatsappNumber,
    currency: "PKR",
    defaultLocale: "en"
  };

  data.users.push(user);
  data.restaurants.push(restaurant);
  await writeData(data);
  return user;
}

export async function activateSubscription(userId: string) {
  const data = await readData();
  const user = data.users.find((entry) => entry.id === userId);
  if (!user) {
    return null;
  }

  user.subscriptionStatus = "active";
  await writeData(data);
  return user;
}

export async function getUserById(userId: string) {
  const data = await readData();
  return data.users.find((entry) => entry.id === userId) ?? null;
}

export async function authenticateUser(email: string, password: string) {
  const data = await readData();
  return (
    data.users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password && user.subscriptionStatus === "active"
    ) ?? null
  );
}

export async function getRestaurantBundleByUserId(userId: string) {
  const data = await readData();
  const user = data.users.find((entry) => entry.id === userId);
  if (!user) {
    return null;
  }

  const restaurant = data.restaurants.find((entry) => entry.id === user.restaurantId);
  if (!restaurant) {
    return null;
  }

  return {
    user,
    restaurant,
    categories: data.categories.filter((entry) => entry.restaurantId === restaurant.id),
    menuItems: data.menuItems.filter((entry) => entry.restaurantId === restaurant.id),
    tables: data.tables.filter((entry) => entry.restaurantId === restaurant.id)
  };
}

export async function getRestaurantBySlug(slug: string) {
  const data = await readData();
  const restaurant = data.restaurants.find((entry) => entry.slug === slug);
  if (!restaurant) {
    return null;
  }

  return {
    restaurant,
    categories: data.categories.filter((entry) => entry.restaurantId === restaurant.id),
    menuItems: data.menuItems.filter((entry) => entry.restaurantId === restaurant.id),
    tables: data.tables.filter((entry) => entry.restaurantId === restaurant.id)
  };
}

export async function addCategory(restaurantId: string, name: string) {
  const data = await readData();
  const category: MenuCategory = {
    id: createId("cat"),
    restaurantId,
    name
  };
  data.categories.push(category);
  await writeData(data);
  return category;
}

export async function addMenuItem(
  restaurantId: string,
  input: Omit<MenuItem, "id" | "restaurantId">
) {
  const data = await readData();
  const item: MenuItem = {
    id: createId("item"),
    restaurantId,
    ...input
  };
  data.menuItems.push(item);
  await writeData(data);
  return item;
}

export async function addTable(restaurantId: string, input: Pick<Table, "name" | "number">) {
  const data = await readData();
  const table: Table = {
    id: createId("table"),
    restaurantId,
    ...input
  };
  data.tables.push(table);
  await writeData(data);
  return table;
}

export async function updateRestaurantSettings(
  restaurantId: string,
  input: Pick<Restaurant, "address" | "currency" | "whatsappNumber" | "defaultLocale">
) {
  const data = await readData();
  const restaurant = data.restaurants.find((entry) => entry.id === restaurantId);
  if (!restaurant) {
    return null;
  }

  restaurant.address = input.address;
  restaurant.currency = input.currency;
  restaurant.whatsappNumber = input.whatsappNumber;
  restaurant.defaultLocale = input.defaultLocale;
  await writeData(data);
  return restaurant;
}
