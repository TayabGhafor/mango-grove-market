import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { products, mockOrders } from "@/data/products";
import { Package, DollarSign, Users, ShoppingCart, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const chartData = [
  { name: "Mon", orders: 12, revenue: 18000 },
  { name: "Tue", orders: 19, revenue: 28000 },
  { name: "Wed", orders: 8, revenue: 12000 },
  { name: "Thu", orders: 22, revenue: 35000 },
  { name: "Fri", orders: 30, revenue: 48000 },
  { name: "Sat", orders: 25, revenue: 40000 },
  { name: "Sun", orders: 15, revenue: 22000 },
];

const mockUsers = [
  { id: "1", name: "Ahmed Khan", email: "ahmed@email.com", orders: 5, joined: "2026-03-15" },
  { id: "2", name: "Sara Malik", email: "sara@email.com", orders: 3, joined: "2026-03-20" },
  { id: "3", name: "Usman Raza", email: "usman@email.com", orders: 8, joined: "2026-02-10" },
];

type Tab = "dashboard" | "products" | "orders" | "users";

const AdminPage = () => {
  const [tab, setTab] = useState<Tab>("dashboard");

  const stats = [
    { label: "Total Orders", value: "156", icon: ShoppingCart, color: "bg-primary/10 text-primary" },
    { label: "Revenue", value: "Rs. 248K", icon: DollarSign, color: "bg-secondary/10 text-secondary" },
    { label: "Products", value: products.length.toString(), icon: Package, color: "bg-coral/10 text-coral" },
    { label: "Users", value: "89", icon: Users, color: "bg-mango-deep/10 text-mango-deep" },
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </Link>
          <h1 className="font-display text-3xl font-bold">Admin Panel</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted rounded-lg p-1 mb-8 overflow-x-auto">
        {(["dashboard", "products", "orders", "users"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-all whitespace-nowrap ${
              tab === t ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "dashboard" && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-card rounded-xl p-5 border border-border">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="font-display font-semibold mb-4">Weekly Orders</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="font-display font-semibold mb-4">Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(var(--secondary))" strokeWidth={2} dot={{ fill: "hsl(var(--secondary))" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {tab === "products" && (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <h3 className="font-display font-semibold">All Products</h3>
            <Button size="sm" className="bg-gradient-mango text-primary-foreground">+ Add Product</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium">Product</th>
                  <th className="text-left p-3 font-medium">Category</th>
                  <th className="text-left p-3 font-medium">Price</th>
                  <th className="text-left p-3 font-medium">Rating</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="p-3 flex items-center gap-3">
                      <img src={p.images[0]} alt={p.title} className="w-10 h-10 rounded-lg object-cover" />
                      {p.title}
                    </td>
                    <td className="p-3">{p.category}</td>
                    <td className="p-3">Rs. {p.price.toLocaleString()}</td>
                    <td className="p-3">⭐ {p.rating}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button className="text-xs px-2 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20">Edit</button>
                        <button className="text-xs px-2 py-1 rounded bg-destructive/10 text-destructive hover:bg-destructive/20">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-display font-semibold">All Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium">Order ID</th>
                  <th className="text-left p-3 font-medium">Customer</th>
                  <th className="text-left p-3 font-medium">Total</th>
                  <th className="text-left p-3 font-medium">Payment</th>
                  <th className="text-left p-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockOrders.map((o) => (
                  <tr key={o.id} className="border-t border-border">
                    <td className="p-3 font-medium">{o.id}</td>
                    <td className="p-3">{o.customer.name}</td>
                    <td className="p-3">Rs. {o.total.toLocaleString()}</td>
                    <td className="p-3">{o.paymentMethod}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        o.status === "delivered" ? "bg-secondary/10 text-secondary" :
                        o.status === "pending" ? "bg-muted text-muted-foreground" :
                        "bg-primary/10 text-primary"
                      }`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "users" && (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-display font-semibold">Registered Users</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium">Name</th>
                  <th className="text-left p-3 font-medium">Email</th>
                  <th className="text-left p-3 font-medium">Orders</th>
                  <th className="text-left p-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map((u) => (
                  <tr key={u.id} className="border-t border-border">
                    <td className="p-3 font-medium">{u.name}</td>
                    <td className="p-3 text-muted-foreground">{u.email}</td>
                    <td className="p-3">{u.orders}</td>
                    <td className="p-3 text-muted-foreground">{u.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
