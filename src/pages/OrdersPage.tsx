import { Package, CheckCircle2, Truck, MapPin, Clock } from "lucide-react";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { fetchMyOrders } from "@/lib/apiClient";
import { supabase } from "@/integrations/supabase/client";

const statusConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  pending: { icon: Clock, color: "text-muted-foreground", label: "Pending" },
  processed: { icon: Package, color: "text-primary", label: "Processed" },
  dispatched: { icon: Truck, color: "text-secondary", label: "Dispatched" },
  "out-for-delivery": { icon: MapPin, color: "text-coral", label: "Out for Delivery" },
  delivered: { icon: CheckCircle2, color: "text-secondary", label: "Delivered" },
  cancelled: { icon: Clock, color: "text-destructive", label: "Cancelled" },
};

const statusSteps = ["pending", "processed", "dispatched", "out-for-delivery", "delivered", "cancelled"];

const OrdersPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders", "my"],
    queryFn: () => fetchMyOrders(),
    enabled: Boolean(user),
  });

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`orders:${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders", filter: `user_id=eq.${user.id}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ["orders"], exact: false });
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient, user]);

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
        {orders.map((order) => {
          const currentStep = statusSteps.indexOf(order.status);
          const config = statusConfig[order.status] ?? statusConfig.pending;
          return (
            <div key={order._id} className="bg-card rounded-xl border border-border p-6">
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
              {/* Progress bar */}
              <div className="flex items-center gap-1 mb-4">
                {statusSteps.map((_, i) => (
                  <div key={i} className={`flex-1 h-1.5 rounded-full ${i <= currentStep ? "bg-gradient-mango" : "bg-muted"}`} />
                ))}
              </div>
              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <img src={item.image} alt={item.title} className="w-10 h-10 rounded-lg object-cover" />
                    <span className="flex-1">{item.title} × {item.quantity} ({item.weight.label})</span>
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
        })}
      </div>
    </div>
  );
};

export default OrdersPage;
