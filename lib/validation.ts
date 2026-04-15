import { z } from "zod";
import { isSupportedLocale } from "@/lib/i18n";

export const registerSchema = z.object({
  ownerName: z.string().min(2),
  restaurantName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  whatsappNumber: z.string().min(8)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const categorySchema = z.object({
  name: z.string().min(2)
});

export const menuItemSchema = z.object({
  categoryId: z.string().min(2),
  name: z.string().min(2),
  description: z.string().min(2),
  price: z.coerce.number().positive(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  available: z.coerce.boolean().default(true),
  tags: z.string().optional()
});

export const tableSchema = z.object({
  name: z.string().min(2),
  number: z.coerce.number().int().positive()
});

export const settingsSchema = z.object({
  address: z.string().min(2),
  currency: z.string().min(3).max(3),
  whatsappNumber: z.string().min(8),
  defaultLocale: z.string().refine((value) => isSupportedLocale(value))
});

export const adminOwnerStatusSchema = z.object({
  userId: z.string().min(2),
  status: z.enum(["pending", "active", "canceled"])
});
