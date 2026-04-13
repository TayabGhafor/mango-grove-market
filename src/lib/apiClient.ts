import type { Product } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";
import type { Json, Tables } from "@/integrations/supabase/types";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export type AuthRole = "user" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

export interface ApiProduct {
  _id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  basePrice: number;
  weights: { label: string; kg: 3 | 5 | 8; price: number }[];
  rating: number;
  reviews: number;
  trending: boolean;
  deal?: { discount: number; label: string };
  active: boolean;
}

export interface ApiOrder {
  _id: string;
  items: {
    product: string;
    title: string;
    image: string;
    weight: { label: string; kg: 3 | 5 | 8; price: number };
    quantity: number;
  }[];
  customer: { name: string; address: string; phone: string };
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: "pending" | "processed" | "dispatched" | "out-for-delivery" | "delivered" | "cancelled";
  payment: { method: "cod" | "easypaisa" | "jazzcash" | "card"; verified: boolean; reference?: string };
  createdAt: string;
}

export const toStorefrontProduct = (product: ApiProduct): Product => {
  return {
    id: product._id,
    title: product.title,
    description: product.description,
    images: product.images,
    price: product.basePrice,
    weights: product.weights,
    category: product.category,
    rating: product.rating,
    reviews: product.reviews,
    trending: product.trending,
    deal: product.deal,
  };
};

const parseStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is string => typeof entry === "string");
};

const parseWeights = (value: unknown): ApiProduct["weights"] => {
  if (!Array.isArray(value)) return [];
  const parsed = value
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;
      const record = entry as Record<string, unknown>;
      const kg = Number(record.kg);
      if (kg !== 3 && kg !== 5 && kg !== 8) return null;
      const label = typeof record.label === "string" ? record.label : `${kg} KG`;
      const price = Number(record.price);
      if (!Number.isFinite(price) || price <= 0) return null;
      return { kg, label, price } as { label: string; kg: 3 | 5 | 8; price: number };
    })
    .filter(Boolean) as ApiProduct["weights"];
  return parsed;
};

const parseDeal = (value: unknown): ApiProduct["deal"] => {
  if (!value || typeof value !== "object") return undefined;
  const record = value as Record<string, unknown>;
  const label = typeof record.label === "string" ? record.label : "";
  const discount = Number(record.discount);
  if (!label || !Number.isFinite(discount) || discount <= 0) return undefined;
  return { label, discount };
};

const toApiProduct = (row: Tables<"products">): ApiProduct => {
  return {
    _id: row.id,
    title: row.title,
    description: row.description,
    images: parseStringArray(row.images as unknown),
    category: row.category,
    basePrice: Number(row.base_price) || 0,
    weights: parseWeights(row.weights as unknown),
    rating: Number(row.rating) || 0,
    reviews: Number(row.reviews) || 0,
    trending: Boolean(row.trending),
    deal: parseDeal(row.deal as unknown),
    active: Boolean(row.active),
  };
};

type DbOrderWithItems = Tables<"orders"> & { order_items?: Tables<"order_items">[] };

const toApiOrder = (row: DbOrderWithItems): ApiOrder => {
  const customer = (row.customer ?? {}) as Record<string, unknown>;
  const payment = (row.payment ?? {}) as Record<string, unknown>;
  const items = (row.order_items ?? []).map((item) => ({
    product: item.product_id ?? "",
    title: item.title,
    image: item.image,
    weight: {
      label: item.weight_label,
      kg: item.weight_kg as 3 | 5 | 8,
      price: Number(item.unit_price) || 0,
    },
    quantity: Number(item.quantity) || 1,
  }));

  const subtotal = items.reduce((sum, item) => sum + item.weight.price * item.quantity, 0);
  const deliveryFee = Math.max(0, Number((payment.deliveryFee as unknown) ?? 0) || 0);
  const total = Math.max(0, Number(row.total) || subtotal + deliveryFee);

  return {
    _id: row.id,
    items,
    customer: {
      name: typeof customer.name === "string" ? customer.name : "",
      address: typeof customer.address === "string" ? customer.address : "",
      phone: typeof customer.phone === "string" ? customer.phone : "",
    },
    subtotal,
    deliveryFee,
    total,
    status: row.status as ApiOrder["status"],
    payment: {
      method: (payment.method as ApiOrder["payment"]["method"]) ?? "cod",
      verified: Boolean(payment.verified),
      ...(typeof payment.reference === "string" ? { reference: payment.reference } : {}),
    },
    createdAt: row.created_at,
  };
};

export const fetchProducts = (params?: { q?: string; trending?: boolean; category?: string }) => {
  const run = async () => {
    let query = supabase
      .from("products")
      .select("id,title,description,images,category,base_price,weights,rating,reviews,trending,deal,active,created_at,updated_at")
      .eq("active", true)
      .order("created_at", { ascending: false });

    if (typeof params?.trending === "boolean") {
      query = query.eq("trending", params.trending);
    }

    if (params?.category) {
      query = query.eq("category", params.category);
    }

    const q = params?.q?.trim();
    if (q) {
      query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return { products: (data ?? []).map(toApiProduct) };
  };

  return run();
};

export const fetchProduct = async (id: string) => {
  const { data, error } = await supabase
    .from("products")
    .select("id,title,description,images,category,base_price,weights,rating,reviews,trending,deal,active,created_at,updated_at")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Product not found.");
  return { product: toApiProduct(data) };
};

export const createOrder = async (payload: {
  items: { productId: string; title: string; image: string; weight: { label: string; kg: 3 | 5 | 8; price: number }; quantity: number }[];
  customer: { name: string; address: string; phone: string };
  payment: { method: "cod" | "easypaisa" | "jazzcash" | "card"; reference?: string; verified: boolean; deliveryFee: number };
  total: number;
}) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("Not signed in.");

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      customer: payload.customer as unknown as Json,
      total: payload.total,
      payment: payload.payment as unknown as Json,
      status: "pending",
    })
    .select("id,customer,payment,total,status,created_at")
    .single();
  if (orderError) throw orderError;

  const orderId = order.id;

  const { data: orderItems, error: itemError } = await supabase
    .from("order_items")
    .insert(
      payload.items.map((item) => ({
        order_id: orderId,
        product_id: item.productId,
        title: item.title,
        image: item.image,
        weight_label: item.weight.label,
        weight_kg: item.weight.kg,
        unit_price: item.weight.price,
        quantity: item.quantity,
        subtotal: item.weight.price * item.quantity,
      })),
    )
    .select("product_id,title,image,weight_label,weight_kg,unit_price,quantity,subtotal");

  if (itemError) {
    await supabase.from("orders").delete().eq("id", orderId);
    throw itemError;
  }
  const fullOrder = {
    ...(order as Tables<"orders">),
    order_items: (orderItems ?? []) as Tables<"order_items">[],
  } satisfies DbOrderWithItems;

  return { order: toApiOrder(fullOrder) };
};

export const fetchMyOrders = async () => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("Not signed in.");

  const { data, error } = await supabase
    .from("orders")
    .select(
      "id,customer,payment,total,status,created_at,order_items(product_id,title,image,weight_label,weight_kg,unit_price,quantity,subtotal)",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return { orders: (data ?? []).map((row) => toApiOrder(row as DbOrderWithItems)) };
};
