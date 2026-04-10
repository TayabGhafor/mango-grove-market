const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
  category: string;
  basePrice: number;
  active: boolean;
}

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

const request = async <T>(path: string, token?: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data as T;
};

export const loginAdmin = async (email: string, password: string) => {
  const session = await request<AdminSession>("/api/auth/login", undefined, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (session.user.role !== "admin") {
    throw new Error("Only admin users can access this panel.");
  }

  return session;
};

export const getProducts = (token: string) => request<{ products: Product[] }>("/api/products", token);

export const getOrders = (token: string) => request<{ orders: Order[] }>("/api/orders", token);

export const getUsers = (token: string) => request<{ users: User[] }>("/api/users", token);

export const updateOrderStatus = (token: string, orderId: string, status: string) => request<{ order: Order }>(`/api/orders/${orderId}/status`, token, {
  method: "PATCH",
  body: JSON.stringify({ status }),
});
