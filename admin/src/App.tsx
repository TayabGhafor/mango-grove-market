import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { createProduct, deleteProduct, getOrders, getProducts, getUsers, getSupabase, loginAdmin, Order, Product, ProductPayload, updateOrderStatus, updateProduct, User } from "./api";

const orderStatuses = ["pending", "processed", "dispatched", "out-for-delivery", "delivered", "cancelled"];
const sessionKey = "mango-grove-admin-session";

export function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(() => {
    const cached = sessionStorage.getItem(sessionKey);
    if (!cached) return "";
    try {
      return JSON.parse(cached).token as string;
    } catch {
      return "";
    }
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "orders" | "users">("dashboard");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [productDraft, setProductDraft] = useState<ProductPayload | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const createEmptyProduct = (): ProductPayload => ({
    title: "",
    description: "",
    images: ["", ""],
    category: "",
    basePrice: 0,
    weights: [
      { label: "3 KG", kg: 3, price: 0 },
      { label: "5 KG", kg: 5, price: 0 },
      { label: "8 KG", kg: 8, price: 0 },
    ],
    rating: 0,
    reviews: 0,
    trending: false,
    active: true,
  });

  const isValidUrl = (value: string) => {
    try {
      const parsed = new URL(value);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  const dashboardData = useMemo(() => {
    const byDay = new Map<string, { name: string; orders: number; revenue: number }>();
    orders.forEach((order) => {
      const date = new Date(order.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" });
      const current = byDay.get(date) ?? { name: date, orders: 0, revenue: 0 };
      current.orders += 1;
      current.revenue += order.total;
      byDay.set(date, current);
    });
    return [...byDay.values()].slice(-7);
  }, [orders]);

  const refresh = useCallback(async (authToken: string) => {
    if (!authToken) return;
    setLoading(true);
    setError("");
    try {
      const [productResult, orderResult, userResult] = await Promise.all([
        getProducts(authToken),
        getOrders(authToken),
        getUsers(authToken),
      ]);
      setProducts(productResult.products);
      setOrders(orderResult.orders);
      setUsers(userResult.users);
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : "Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh(token);
  }, [refresh, token]);

  useEffect(() => {
    if (!token) return;
    let productsChannel: RealtimeChannel | null = null;
    let ordersChannel: RealtimeChannel | null = null;
    let profilesChannel: RealtimeChannel | null = null;
    try {
      const supabase = getSupabase();
      productsChannel = supabase
        .channel("admin:products")
        .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => {
          void refresh(token);
        })
        .subscribe();

      ordersChannel = supabase
        .channel("admin:orders")
        .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
          void refresh(token);
        })
        .subscribe();

      profilesChannel = supabase
        .channel("admin:profiles")
        .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => {
          void refresh(token);
        })
        .subscribe();
    } catch (subscribeError) {
      setError(subscribeError instanceof Error ? subscribeError.message : "Supabase configuration is missing.");
      return;
    }

    return () => {
      try {
        const supabase = getSupabase();
        if (productsChannel) void supabase.removeChannel(productsChannel);
        if (ordersChannel) void supabase.removeChannel(ordersChannel);
        if (profilesChannel) void supabase.removeChannel(profilesChannel);
      } catch {
        return;
      }
    };
  }, [refresh, token]);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const session = await loginAdmin(email, password);
      sessionStorage.setItem(sessionKey, JSON.stringify(session));
      setToken(session.token);
      await refresh(session.token);
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, status: string) => {
    setError("");
    try {
      const result = await updateOrderStatus(token, orderId, status);
      setOrders((current) => current.map((order) => order._id === orderId ? result.order : order));
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : "Failed to update order.");
    }
  };

  const startCreateProduct = () => {
    setEditingProductId(null);
    setProductDraft(createEmptyProduct());
  };

  const startEditProduct = (product: Product) => {
    setEditingProductId(product._id);
    setProductDraft({
      title: product.title,
      description: product.description,
      images: product.images.length >= 2 ? product.images : ["", ""],
      category: product.category,
      basePrice: product.basePrice,
      weights: product.weights,
      rating: product.rating,
      reviews: product.reviews,
      trending: product.trending,
      deal: product.deal,
      active: product.active,
    });
  };

  const cancelProductEdit = () => {
    setEditingProductId(null);
    setProductDraft(null);
  };

  const saveProduct = async () => {
    if (!productDraft) return;
    setLoading(true);
    setError("");
    try {
      const cleanedImages = productDraft.images.map((value) => value.trim()).filter(Boolean);
      if (productDraft.title.trim().length < 2) throw new Error("Product title must be at least 2 characters.");
      if (productDraft.description.trim().length < 20) throw new Error("Product description must be at least 20 characters.");
      if (productDraft.category.trim().length < 2) throw new Error("Product category must be at least 2 characters.");
      if (cleanedImages.length < 2) throw new Error("Provide at least 2 image URLs.");
      if (cleanedImages.some((url) => !isValidUrl(url))) throw new Error("All image URLs must be valid http(s) links.");
      if (productDraft.weights.some((w) => Number.isNaN(w.price) || w.price <= 0)) throw new Error("Weight prices must be greater than 0.");

      const payload: ProductPayload = {
        ...productDraft,
        title: productDraft.title.trim(),
        description: productDraft.description.trim(),
        category: productDraft.category.trim(),
        images: cleanedImages.slice(0, 5),
        basePrice: Number(productDraft.basePrice) || 0,
        weights: productDraft.weights.map((w) => ({ ...w, price: Number(w.price) || 0 })),
        rating: Number(productDraft.rating) || 0,
        reviews: Number(productDraft.reviews) || 0,
      };

      const dealLabel = payload.deal?.label?.trim() ?? "";
      const dealDiscount = payload.deal?.discount ?? 0;
      if (dealLabel && (dealDiscount <= 0 || dealDiscount > 90)) {
        throw new Error("Deal discount must be between 1 and 90.");
      }
      payload.deal = dealLabel ? { label: dealLabel, discount: dealDiscount } : undefined;

      const result = editingProductId
        ? await updateProduct(token, editingProductId, payload)
        : await createProduct(token, payload);

      setProducts((current) => {
        const existingIndex = current.findIndex((p) => p._id === result.product._id);
        if (existingIndex === -1) return [result.product, ...current];
        const next = [...current];
        next[existingIndex] = result.product;
        return next;
      });

      cancelProductEdit();
    } catch (productError) {
      setError(productError instanceof Error ? productError.message : "Unable to save product.");
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (productId: string) => {
    if (!window.confirm("Hide this product?")) return;
    setLoading(true);
    setError("");
    try {
      await deleteProduct(token, productId);
      setProducts((current) => current.filter((p) => p._id !== productId));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete product.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      void getSupabase().auth.signOut();
    } catch {
      return;
    }
    sessionStorage.removeItem(sessionKey);
    setToken("");
    setProducts([]);
    setOrders([]);
    setUsers([]);
  };

  if (!token) {
    return (
      <main className="auth-screen">
        <form className="auth-panel" onSubmit={handleLogin}>
          <p className="eyebrow">Admin portal</p>
          <h1>Mango Grove Market</h1>
          <label>
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} />
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
        </form>
      </main>
    );
  }

  const orderRevenue = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + order.total, 0);
  const cancelledCount = orders.filter((order) => order.status === "cancelled").length;
  const customerCount = users.filter((user) => user.role === "customer").length;
  const schemaHint = error.includes("Could not find the table")
    ? "Database tables are missing in Supabase. Run the migration SQL in supabase/migrations/20260410193000_reconcile_store_schema.sql using the Supabase SQL Editor, then refresh."
    : error.includes("schema is not installed")
      ? "Database tables are missing in Supabase. Run the migration SQL in supabase/migrations/20260410193000_reconcile_store_schema.sql using the Supabase SQL Editor, then refresh."
      : "";

  return (
    <main className="admin-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Admin portal</p>
          <h1>Mango Grove Market</h1>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button className="secondary-button" type="button" onClick={() => void refresh(token)} disabled={loading}>
            Refresh
          </button>
          <button className="secondary-button" type="button" onClick={logout}>Sign out</button>
        </div>
      </header>

      <nav className="tabs" aria-label="Admin sections">
        {(["dashboard", "products", "orders", "users"] as const).map((tab) => (
          <button key={tab} type="button" className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      {error && (
        <div className="error">
          <p style={{ margin: 0, fontWeight: 800 }}>{error}</p>
          {schemaHint && <p style={{ margin: "6px 0 0", color: "#7a2a20" }}>{schemaHint}</p>}
        </div>
      )}
      {loading && <p className="muted">Loading latest store data...</p>}

      {activeTab === "dashboard" && (
        <section className="panel-grid">
          <article className="metric">
            <span>Total orders</span>
            <strong>{orders.length}</strong>
          </article>
          <article className="metric">
            <span>Revenue (excl cancelled)</span>
            <strong>Rs. {orderRevenue.toLocaleString()}</strong>
          </article>
          <article className="metric">
            <span>Customers</span>
            <strong>{customerCount}</strong>
          </article>
          <article className="metric">
            <span>Products</span>
            <strong>{products.length}</strong>
          </article>
          <article className="metric">
            <span>Cancelled</span>
            <strong>{cancelledCount}</strong>
          </article>
          <article className="chart-panel">
            <h2>Recent orders</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={dashboardData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#f5a400" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </article>
        </section>
      )}

      {activeTab === "products" && (
        <section className="table-panel">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <h2>Products</h2>
            <button type="button" className="secondary-button" onClick={startCreateProduct}>Add product</button>
          </div>

          {productDraft && (
            <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
              <p className="muted" style={{ margin: 0, maxWidth: "none" }}>
                {editingProductId ? "Edit product" : "Create product"}
              </p>

              <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
                <label>
                  Title
                  <input
                    value={productDraft.title}
                    onChange={(event) => setProductDraft({ ...productDraft, title: event.target.value })}
                    required
                    minLength={2}
                  />
                </label>
                <label>
                  Category
                  <input
                    value={productDraft.category}
                    onChange={(event) => setProductDraft({ ...productDraft, category: event.target.value })}
                    required
                    minLength={2}
                  />
                </label>
                <label>
                  Base price
                  <input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    value={productDraft.basePrice || ""}
                    onChange={(event) => setProductDraft({ ...productDraft, basePrice: Number(event.target.value) })}
                    required
                  />
                </label>
                <label>
                  Reviews
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={productDraft.reviews || 0}
                    onChange={(event) => setProductDraft({ ...productDraft, reviews: Number(event.target.value) })}
                  />
                </label>
                <label>
                  Rating
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={5}
                    step={0.1}
                    value={productDraft.rating || 0}
                    onChange={(event) => setProductDraft({ ...productDraft, rating: Number(event.target.value) })}
                  />
                </label>
              </div>

              <label>
                Description
                <textarea
                  value={productDraft.description}
                  onChange={(event) => setProductDraft({ ...productDraft, description: event.target.value })}
                  required
                  minLength={20}
                />
              </label>

              <div style={{ display: "grid", gap: 12 }}>
                <p className="muted" style={{ margin: 0, maxWidth: "none" }}>Images (2 to 5 URLs)</p>
                {productDraft.images.map((value, index) => (
                  <label key={index}>
                    Image URL {index + 1}
                    <input
                      value={value}
                      onChange={(event) => {
                        const next = [...productDraft.images];
                        next[index] = event.target.value;
                        setProductDraft({ ...productDraft, images: next });
                      }}
                      required={index < 2}
                    />
                  </label>
                ))}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => productDraft.images.length < 5 && setProductDraft({ ...productDraft, images: [...productDraft.images, ""] })}
                    disabled={productDraft.images.length >= 5}
                  >
                    Add image
                  </button>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => productDraft.images.length > 2 && setProductDraft({ ...productDraft, images: productDraft.images.slice(0, -1) })}
                    disabled={productDraft.images.length <= 2}
                  >
                    Remove last
                  </button>
                </div>
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                <p className="muted" style={{ margin: 0, maxWidth: "none" }}>Weights (required)</p>
                <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
                  {productDraft.weights.map((weight) => (
                    <label key={weight.kg}>
                      {weight.label} price
                      <input
                        type="number"
                        inputMode="numeric"
                        min={1}
                        value={weight.price || ""}
                        onChange={(event) => {
                          const nextWeights = productDraft.weights.map((entry) =>
                            entry.kg === weight.kg ? { ...entry, price: Number(event.target.value) } : entry,
                          );
                          setProductDraft({ ...productDraft, weights: nextWeights });
                        }}
                        required
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
                <label>
                  Deal label (optional)
                  <input
                    value={productDraft.deal?.label ?? ""}
                    onChange={(event) => setProductDraft({
                      ...productDraft,
                      deal: { label: event.target.value, discount: productDraft.deal?.discount ?? 0 },
                    })}
                  />
                </label>
                <label>
                  Deal discount %
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={90}
                    value={productDraft.deal?.discount ?? 0}
                    onChange={(event) => setProductDraft({
                      ...productDraft,
                      deal: { label: productDraft.deal?.label ?? "", discount: Number(event.target.value) },
                    })}
                  />
                </label>
              </div>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700 }}>
                  <input
                    type="checkbox"
                    checked={productDraft.trending}
                    onChange={(event) => setProductDraft({ ...productDraft, trending: event.target.checked })}
                    style={{ width: "auto" }}
                  />
                  Trending
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700 }}>
                  <input
                    type="checkbox"
                    checked={productDraft.active}
                    onChange={(event) => setProductDraft({ ...productDraft, active: event.target.checked })}
                    style={{ width: "auto" }}
                  />
                  Active
                </label>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button type="button" onClick={saveProduct} disabled={loading}>
                  {loading ? "Saving..." : "Save product"}
                </button>
                <button type="button" className="secondary-button" onClick={cancelProductEdit} disabled={loading}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Base price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.title}</td>
                  <td>{product.category}</td>
                  <td>Rs. {product.basePrice.toLocaleString()}</td>
                  <td>{product.active ? "Active" : "Hidden"}</td>
                  <td>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button type="button" className="secondary-button" onClick={() => startEditProduct(product)}>Edit</button>
                      <button type="button" className="secondary-button" onClick={() => removeProduct(product._id)} disabled={loading}>Hide</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {activeTab === "orders" && (
        <section className="table-panel">
          <h2>Orders</h2>
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.customer.name}</td>
                  <td>Rs. {order.total.toLocaleString()}</td>
                  <td>{order.payment.method}</td>
                  <td>
                    <select value={order.status} onChange={(event) => handleStatusChange(order._id, event.target.value)}>
                      {orderStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {activeTab === "users" && (
        <section className="table-panel">
          <h2>Users</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}
