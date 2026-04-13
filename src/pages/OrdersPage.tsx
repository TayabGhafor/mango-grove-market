import { Package, CheckCircle2, Truck, MapPin, Clock } from "lucide-react";
import { memo, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { fetchMyOrders, type ApiOrder } from "@/lib/apiClient";
import { supabase } from "@/integrations/supabase/client";

const getOrdersCacheKey = (userId: string) => `orders:my:${userId}`;

type OrdersQueryData = { orders: ApiOrder[] };

const readCachedOrders = (userId: string) => {
  try {
    const raw = sessionStorage.getItem(getOrdersCacheKey(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { orders?: unknown; cachedAt?: unknown };
    if (!parsed || typeof parsed !== "object") return null;
    if (!Array.isArray(parsed.orders)) return null;
    const cachedAt = typeof parsed.cachedAt === "number" ? parsed.cachedAt : 0;
    return { orders: parsed.orders as ApiOrder[], cachedAt };
  } catch {
    return null;
  }
};

const writeCachedOrders = (userId: string, orders: ApiOrder[]) => {
  try {
    sessionStorage.setItem(getOrdersCacheKey(userId), JSON.stringify({ orders, cachedAt: Date.now() }));
  } catch {
    return;
  }
};

const statusConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  pending: { icon: Clock, color: "text-muted-foreground", label: "Pending" },
  processed: { icon: Package, color: "text-primary", label: "Processed" },
  dispatched: { icon: Truck, color: "text-secondary", label: "Dispatched" },
  "out-for-delivery": { icon: MapPin, color: "text-coral", label: "Out for Delivery" },
  delivered: { icon: CheckCircle2, color: "text-secondary", label: "Delivered" },
  cancelled: { icon: Clock, color: "text-destructive", label: "Cancelled" },
};

const fulfillmentSteps = ["pending", "processed", "dispatched", "out-for-delivery", "delivered"] as const;

type OrderRowProps = { order: ApiOrder };

const OrderRow = memo(function OrderRow({ order }: OrderRowProps) {
  const isCancelled = order.status === "cancelled";
  const currentStep = isCancelled ? -1 : Math.max(0, fulfillmentSteps.indexOf(order.status as (typeof fulfillmentSteps)[number]));
  const config = statusConfig[order.status] ?? statusConfig.pending;
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-display font-semibold">{order._id}</h3>
          <p className="text-sm text-muted-foreground">
            {new Date(order.createdAt).toLocaleDateString()} • {order.payment.method.toUpperCase()}
          </p>
        </div>
        <div className={`flex items-center gap-2 text-sm font-medium ${config.color}`}>
          <config.icon className="w-4 h-4" />
          {config.label}
        </div>
      </div>
      {isCancelled ? (
        <p className="text-sm text-destructive mb-4">This order was cancelled.</p>
      ) : (
        <div className="flex items-center gap-1 mb-4">
          {fulfillmentSteps.map((_, i) => (
            <div key={i} className={`flex-1 h-1.5 rounded-full ${i <= currentStep ? "bg-gradient-mango" : "bg-muted"}`} />
          ))}
        </div>
      )}
      <div className="space-y-2">
        {order.items.map((item, i) => (
          <div key={i} className="flex items-center gap-3 text-sm">
            <img
              src={item.image}
              alt={item.title}
              className="w-10 h-10 rounded-lg object-cover"
              loading="lazy"
              decoding="async"
              width={40}
              height={40}
            />
            <span className="flex-1">
              {item.title} × {item.quantity} ({item.weight.label})
            </span>
            <span className="font-medium">Rs. {(item.weight.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-border mt-3 pt-3 flex justify-between font-bold">
        <span>Total</span>
        <span>Rs. {order.total.toLocaleString()}</span>
      </div>
    </div>
  );
});

const OrdersPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id ?? "";
  const queryKey = useMemo(() => ["orders", "my", userId] as const, [userId]);
  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: () => fetchMyOrders(),
    enabled: Boolean(userId),
    staleTime: 60_000,
    initialData: () => {
      if (!userId) return undefined;
      const cached = readCachedOrders(userId);
      if (!cached) return undefined;
      return { orders: cached.orders } satisfies OrdersQueryData;
    },
    initialDataUpdatedAt: () => {
      if (!userId) return 0;
      const cached = readCachedOrders(userId);
      return cached?.cachedAt ?? 0;
    },
  });

  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel(`orders:${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders", filter: `user_id=eq.${userId}` },
        (payload) => {
          const eventType = (payload as { eventType?: string }).eventType ?? "";
          const next = (payload as { new?: { id?: string; status?: string } }).new;
          if (eventType === "UPDATE" && next?.id && next.status) {
            queryClient.setQueryData(queryKey, (prev?: OrdersQueryData) => {
              const orders = prev?.orders ?? [];
              const updated = orders.map((order) => (order._id === next.id ? { ...order, status: next.status } : order));
              return { orders: updated };
            });
            return;
          }
          queryClient.invalidateQueries({ queryKey });
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient, queryKey, userId]);

  useEffect(() => {
    if (!userId) return;
    const orders = data?.orders;
    if (!orders) return;
    writeCachedOrders(userId, orders);
  }, [data?.orders, userId]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold mb-3">My Orders</h1>
        <p className="text-muted-foreground mb-6">Sign in to view your order history.</p>
        <Link className="text-primary underline underline-offset-4" to="/login?next=%2Forders">
          Sign in
        </Link>
      </div>
    );
  }

  const orders = data?.orders ?? [];

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold mb-8">My Orders</h1>
      {isLoading && <p className="text-sm text-muted-foreground mb-4">Loading orders...</p>}
      {isError && <p className="text-sm text-destructive mb-4">Unable to load orders. Please try again.</p>}
      {!isLoading && !isError && orders.length === 0 && (
        <p className="text-muted-foreground">No orders yet.</p>
      )}
      <div className="space-y-6">
        {orders.map((order) => (
          <OrderRow key={order._id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
