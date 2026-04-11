import { createClient } from "@supabase/supabase-js";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type AdminDatabase = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: string;
          email: string;
          name: string;
          phone: string | null;
          address: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: string;
          email: string;
          name: string;
          phone?: string | null;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: string;
          email?: string;
          name?: string;
          phone?: string | null;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          title: string;
          description: string;
          images: Json;
          category: string;
          base_price: number;
          weights: Json;
          rating: number;
          reviews: number;
          trending: boolean;
          deal: Json | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          images?: Json;
          category: string;
          base_price?: number;
          weights?: Json;
          rating?: number;
          reviews?: number;
          trending?: boolean;
          deal?: Json | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          images?: Json;
          category?: string;
          base_price?: number;
          weights?: Json;
          rating?: number;
          reviews?: number;
          trending?: boolean;
          deal?: Json | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          customer: Json;
          payment: Json;
          total: number;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          customer?: Json;
          payment?: Json;
          total?: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          customer?: Json;
          payment?: Json;
          total?: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

const envProjectRef = import.meta.env.VITE_SUPABASE_PROJECT_REF ?? import.meta.env.VITE_SUPABASE_REF ?? "";
const envUrl = import.meta.env.VITE_SUPABASE_URL ?? "";
const envPublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "";
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";
const SUPABASE_KEY = envPublishableKey || envAnonKey;

const decodeBase64Url = (value: string) => {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  return atob(padded);
};

const deriveProjectRefFromJwt = (jwt: string) => {
  const parts = jwt.split(".");
  if (parts.length < 2) return "";
  try {
    const payload = JSON.parse(decodeBase64Url(parts[1])) as { ref?: string };
    return typeof payload.ref === "string" ? payload.ref : "";
  } catch {
    return "";
  }
};

type Supabase = ReturnType<typeof createClient<AdminDatabase>>;
let supabaseClient: Supabase | null = null;

export const getSupabase = (): Supabase => {
  if (supabaseClient) return supabaseClient;
  if (!SUPABASE_KEY) throw new Error("VITE_SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_ANON_KEY) is required.");
  const projectRef = envProjectRef || deriveProjectRefFromJwt(envAnonKey || SUPABASE_KEY);
  const supabaseUrl = envUrl || (projectRef ? `https://${projectRef}.supabase.co` : "");
  if (!supabaseUrl) throw new Error("VITE_SUPABASE_URL is required (or set VITE_SUPABASE_PROJECT_REF).");
  supabaseClient = createClient<AdminDatabase>(supabaseUrl, SUPABASE_KEY, {
    auth: {
      storage: sessionStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
  });
  return supabaseClient;
};

export interface AdminSession {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "admin" | "user";
  };
}

export interface Product {
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

export type ProductPayload = Omit<Product, "_id">;

export interface Order {
  _id: string;
  customer: { name: string; phone: string; address: string };
  total: number;
  status: string;
  payment: { method: string; verified: boolean };
  createdAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const parseStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is string => typeof entry === "string");
};

const parseWeights = (value: unknown): Product["weights"] => {
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
    .filter(Boolean) as Product["weights"];
  return parsed;
};

const parseDeal = (value: unknown): Product["deal"] => {
  if (!value || typeof value !== "object") return undefined;
  const record = value as Record<string, unknown>;
  const label = typeof record.label === "string" ? record.label : "";
  const discount = Number(record.discount);
  if (!label || !Number.isFinite(discount) || discount <= 0) return undefined;
  return { label, discount };
};

const toError = (error: unknown, fallback: string) => {
  if (error instanceof Error) return error;
  if (error && typeof error === "object") {
    const record = error as { message?: unknown; code?: unknown; details?: unknown; hint?: unknown };
    const message = typeof record.message === "string" ? record.message : fallback;
    const code = typeof record.code === "string" ? record.code : "";
    const details = typeof record.details === "string" ? record.details : "";
    const hint = typeof record.hint === "string" ? record.hint : "";
    const suffix = [code, details, hint].filter(Boolean).join(" · ");
    return new Error(suffix ? `${message} (${suffix})` : message);
  }
  return new Error(fallback);
};

const isMissingProfilesTable = (error: unknown) => {
  if (!error || typeof error !== "object") return false;
  const code = (error as { code?: unknown }).code;
  return code === "PGRST205";
};

const ensureAdmin = async (userId: string) => {
  const supabase = getSupabase();
  const { data, error } = await supabase.from("profiles").select("role, name, email").eq("id", userId).maybeSingle();
  if (error) {
    if (isMissingProfilesTable(error)) {
      throw new Error("Supabase database schema is not installed yet (missing profiles table).");
    }
    throw toError(error, "Unable to load admin profile.");
  }
  if (!data) throw new Error("Profile not found.");
  if (data.role !== "admin") throw new Error("Only admin users can access this panel.");
  return data;
};

export const loginAdmin = async (email: string, password: string) => {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw toError(error, "Login failed.");
  if (!data.session || !data.user) throw new Error("Login failed.");
  const profile = await ensureAdmin(data.user.id);
  return {
    token: data.session.access_token,
    user: {
      id: data.user.id,
      name: profile.name,
      email: profile.email,
      role: "admin",
    },
  } satisfies AdminSession;
};

export const getProducts = async (_token: string) => {
  const supabase = getSupabase();
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  if (error) throw toError(error, "Unable to load products.");
  const products = (data ?? []).map((row) => ({
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
  }));
  return { products };
};

export const getOrders = async (_token: string) => {
  const supabase = getSupabase();
  const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (error) throw toError(error, "Unable to load orders.");
  const orders = (data ?? []).map((row) => {
    const customer = (row.customer ?? {}) as Record<string, unknown>;
    const payment = (row.payment ?? {}) as Record<string, unknown>;
    return {
      _id: row.id,
      customer: {
        name: typeof customer.name === "string" ? customer.name : "",
        phone: typeof customer.phone === "string" ? customer.phone : "",
        address: typeof customer.address === "string" ? customer.address : "",
      },
      total: Number(row.total) || 0,
      status: row.status,
      payment: {
        method: typeof payment.method === "string" ? payment.method : "cod",
        verified: Boolean(payment.verified),
      },
      createdAt: row.created_at,
    } satisfies Order;
  });
  return { orders };
};

export const getUsers = async (_token: string) => {
  const supabase = getSupabase();
  const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
  if (error) throw toError(error, "Unable to load users.");
  const users = (data ?? []).map((row) => ({
    _id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    createdAt: row.created_at,
  }));
  return { users };
};

export const createProduct = async (_token: string, payload: ProductPayload) => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("products")
    .insert({
      title: payload.title,
      description: payload.description,
      images: payload.images,
      category: payload.category,
      base_price: payload.basePrice,
      weights: payload.weights,
      rating: payload.rating,
      reviews: payload.reviews,
      trending: payload.trending,
      deal: payload.deal ?? null,
      active: payload.active,
    })
    .select("*")
    .single();
  if (error) throw toError(error, "Unable to create product.");
  const product = {
    _id: data.id,
    title: data.title,
    description: data.description,
    images: parseStringArray(data.images as unknown),
    category: data.category,
    basePrice: Number(data.base_price) || 0,
    weights: parseWeights(data.weights as unknown),
    rating: Number(data.rating) || 0,
    reviews: Number(data.reviews) || 0,
    trending: Boolean(data.trending),
    deal: parseDeal(data.deal as unknown),
    active: Boolean(data.active),
  } satisfies Product;
  return { product };
};

export const updateProduct = async (_token: string, productId: string, payload: Partial<ProductPayload>) => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("products")
    .update({
      ...(payload.title !== undefined ? { title: payload.title } : {}),
      ...(payload.description !== undefined ? { description: payload.description } : {}),
      ...(payload.images !== undefined ? { images: payload.images } : {}),
      ...(payload.category !== undefined ? { category: payload.category } : {}),
      ...(payload.basePrice !== undefined ? { base_price: payload.basePrice } : {}),
      ...(payload.weights !== undefined ? { weights: payload.weights } : {}),
      ...(payload.rating !== undefined ? { rating: payload.rating } : {}),
      ...(payload.reviews !== undefined ? { reviews: payload.reviews } : {}),
      ...(payload.trending !== undefined ? { trending: payload.trending } : {}),
      ...(payload.deal !== undefined ? { deal: payload.deal ?? null } : {}),
      ...(payload.active !== undefined ? { active: payload.active } : {}),
    })
    .eq("id", productId)
    .select("*")
    .single();
  if (error) throw toError(error, "Unable to update product.");
  const product = {
    _id: data.id,
    title: data.title,
    description: data.description,
    images: parseStringArray(data.images as unknown),
    category: data.category,
    basePrice: Number(data.base_price) || 0,
    weights: parseWeights(data.weights as unknown),
    rating: Number(data.rating) || 0,
    reviews: Number(data.reviews) || 0,
    trending: Boolean(data.trending),
    deal: parseDeal(data.deal as unknown),
    active: Boolean(data.active),
  } satisfies Product;
  return { product };
};

export const deleteProduct = async (_token: string, productId: string) => {
  const supabase = getSupabase();
  const { error } = await supabase.from("products").update({ active: false }).eq("id", productId);
  if (error) throw toError(error, "Unable to delete product.");
};

export const updateOrderStatus = async (_token: string, orderId: string, status: string) => {
  const supabase = getSupabase();
  const { data, error } = await supabase.from("orders").update({ status }).eq("id", orderId).select("*").single();
  if (error) throw toError(error, "Unable to update order status.");
  const customer = (data.customer ?? {}) as Record<string, unknown>;
  const payment = (data.payment ?? {}) as Record<string, unknown>;
  return {
    order: {
      _id: data.id,
      customer: {
        name: typeof customer.name === "string" ? customer.name : "",
        phone: typeof customer.phone === "string" ? customer.phone : "",
        address: typeof customer.address === "string" ? customer.address : "",
      },
      total: Number(data.total) || 0,
      status: data.status,
      payment: {
        method: typeof payment.method === "string" ? payment.method : "cod",
        verified: Boolean(payment.verified),
      },
      createdAt: data.created_at,
    } satisfies Order,
  };
};
