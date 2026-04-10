import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getOrders, getProducts, getUsers, loginAdmin, Order, Product, updateOrderStatus, User } from "./api";

const orderStatuses = ["pending", "processed", "dispatched", "out-for-delivery", "delivered"];
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

  const logout = () => {
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

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <main className="admin-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Admin portal</p>
          <h1>Mango Grove Market</h1>
        </div>
        <button className="secondary-button" type="button" onClick={logout}>Sign out</button>
      </header>

      <nav className="tabs" aria-label="Admin sections">
        {(["dashboard", "products", "orders", "users"] as const).map((tab) => (
          <button key={tab} type="button" className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </nav>

      {error && <p className="error">{error}</p>}
      {loading && <p className="muted">Loading latest store data...</p>}

      {activeTab === "dashboard" && (
        <section className="panel-grid">
          <article className="metric">
            <span>Total orders</span>
            <strong>{orders.length}</strong>
          </article>
          <article className="metric">
            <span>Total revenue</span>
            <strong>Rs. {totalRevenue.toLocaleString()}</strong>
          </article>
          <article className="metric">
            <span>Active users</span>
            <strong>{users.length}</strong>
          </article>
          <article className="metric">
            <span>Products</span>
            <strong>{products.length}</strong>
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
          <h2>Products</h2>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Base price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.title}</td>
                  <td>{product.category}</td>
                  <td>Rs. {product.basePrice.toLocaleString()}</td>
                  <td>{product.active ? "Active" : "Hidden"}</td>
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
