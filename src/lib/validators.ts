import { z } from "zod";

/**
 * Normalizes email address by trimming whitespace and converting to lowercase.
 * Example: "  Sherif@Gmail.com " -> "sherif@gmail.com"
 */
export function normalizeEmail(email: string): string {
  if (typeof email !== "string") return "";
  return email.trim().toLowerCase();
}

/**
 * Robust RFC-compliant Zod Email Validation Schema
 */
export const emailSchema = z
  .string({ required_error: "Email address is required" })
  .transform((val) => normalizeEmail(val))
  .pipe(
    z
      .string()
      .min(1, "Email address is required")
      .email("Please enter a valid email address (e.g. name@domain.com)")
  );

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  brand: z.string().min(1, "Brand is required"),
  categoryId: z.string().min(1, "Category is required"),
  price: z.coerce.number().positive("Price must be a positive number"),
  size: z.string().min(1, "Size is required"),
  color: z.string().min(1, "Color is required"),
  condition: z.enum(["NEW", "LIKE_NEW", "EXCELLENT", "GOOD", "FAIR"]),
  sku: z.string().min(2, "SKU is required"),
  stock: z.coerce.number().int().nonnegative("Stock cannot be negative"),
  images: z.array(z.string().url("Must be a valid image URL")).min(1, "At least one product image is required"),
  status: z.enum(["DRAFT", "PUBLISHED", "SOLD", "ARCHIVED"]).default("PUBLISHED"),
  measurements: z.record(z.string()).optional(),
});

export type ProductInput = z.infer<typeof productSchema>;

export const orderStatusSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED",
  ]),
  note: z.string().optional(),
});

export const discountSchema = z.object({
  code: z.string().min(2, "Discount code must be at least 2 characters").toUpperCase(),
  type: z.enum(["PERCENTAGE", "FIXED_AMOUNT", "FREE_SHIPPING"]),
  value: z.coerce.number().nonnegative(),
  minimumOrder: z.coerce.number().optional(),
  maximumDiscount: z.coerce.number().optional(),
  usageLimit: z.coerce.number().optional(),
  startsAt: z.string().optional(),
  expiresAt: z.string().optional(),
  active: z.boolean().default(true),
});

export const founderProfileSchema = z.object({
  name: z.string().min(2),
  bio: z.string().min(10),
  image: z.string().url(),
  quote: z.string().optional(),
  socialLinks: z.record(z.string()).optional(),
  published: z.boolean().default(true),
});
