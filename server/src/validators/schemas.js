import { z } from "zod";
import { ORDER_STATUSES } from "../models/Order.js";

const pakistanPhoneRegex = /^03\d{9}$/;
const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid id.");

export const signupSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160).toLowerCase(),
  password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(160).toLowerCase(),
  password: z.string().min(8).max(128),
});

const weightSchema = z.object({
  label: z.enum(["3 KG", "5 KG", "8 KG"]),
  kg: z.union([z.literal(3), z.literal(5), z.literal(8)]),
  price: z.number().positive(),
});

export const productSchema = z.object({
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().min(20).max(1200),
  images: z.array(z.string().url()).min(2).max(5),
  category: z.string().trim().min(2).max(80),
  basePrice: z.number().positive(),
  weights: z.array(weightSchema).length(3).refine((weights) => {
    const keys = weights.map((item) => item.kg).sort().join(",");
    return keys === "3,5,8";
  }, "Weights must include 3 KG, 5 KG, and 8 KG."),
  rating: z.number().min(0).max(5).optional(),
  reviews: z.number().int().min(0).optional(),
  trending: z.boolean().optional(),
  deal: z.object({
    discount: z.number().min(0).max(90),
    label: z.string().trim().min(2).max(80),
  }).optional(),
  active: z.boolean().optional(),
});

export const updateProductSchema = productSchema.partial().refine((value) => Object.keys(value).length > 0, "Provide at least one field.");

export const productQuerySchema = z.object({
  q: z.string().trim().max(120).optional(),
  trending: z.enum(["true", "false"]).optional(),
  category: z.string().trim().max(80).optional(),
});

export const paymentSchema = z.object({
  method: z.enum(["cod", "easypaisa", "jazzcash", "card"]),
  card: z.object({
    number: z.string().max(32),
    cvc: z.string().max(4),
    expiry: z.string().max(10),
  }).optional(),
  wallet: z.object({
    mobileNumber: z.string().regex(pakistanPhoneRegex),
    transactionId: z.string().regex(/^[a-zA-Z0-9-]{6,40}$/),
  }).optional(),
});

export const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: objectIdSchema,
    weightKg: z.union([z.literal(3), z.literal(5), z.literal(8)]),
    quantity: z.number().int().min(1).max(99),
  })).min(1).max(30),
  customer: z.object({
    name: z.string().trim().min(2).max(80),
    address: z.string().trim().min(10).max(220),
    phone: z.string().trim().regex(pakistanPhoneRegex),
  }),
  payment: paymentSchema,
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
});
