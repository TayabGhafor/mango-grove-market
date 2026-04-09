import { mockOrders } from "@/data/products";
import { Package, CheckCircle2, Truck, MapPin, Clock } from "lucide-react";

const statusConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  pending: { icon: Clock, color: "text-muted-foreground", label: "Pending" },
  processed: { icon: Package, color: "text-primary", label: "Processed" },
  dispatched: { icon: Truck, color: "text-secondary", label: "Dispatched" },
  "out-for-delivery": { icon: MapPin, color: "text-coral", label: "Out for Delivery" },
  delivered: { icon: CheckCircle2, color: "text-secondary", label: "Delivered" },
};

const statusSteps = ["pending", "processed", "dispatched", "out-for-delivery", "delivered"];

const OrdersPage = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold mb-8">My Orders</h1>
      <div className="space-y-6">
        {mockOrders.map((order) => {
          const currentStep = statusSteps.indexOf(order.status);
          const config = statusConfig[order.status];
          return (
            <div key={order.id} className="bg-card rounded-xl border border-border p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-display font-semibold">{order.id}</h3>
                  <p className="text-sm text-muted-foreground">{order.date} • {order.paymentMethod}</p>
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
                    <img src={item.product.images[0]} alt={item.product.title} className="w-10 h-10 rounded-lg object-cover" />
                    <span className="flex-1">{item.product.title} × {item.quantity} ({item.weight.label})</span>
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
