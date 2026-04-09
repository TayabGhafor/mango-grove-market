import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { CreditCard, Banknote, Smartphone } from "lucide-react";

const paymentMethods = [
  { id: "cod", label: "Cash on Delivery", icon: Banknote },
  { id: "easypaisa", label: "Easypaisa", icon: Smartphone },
  { id: "jazzcash", label: "JazzCash", icon: Smartphone },
  { id: "card", label: "Card Payment", icon: CreditCard },
];

const CheckoutPage = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", address: "", phone: "" });
  const [payment, setPayment] = useState("cod");
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const delivery = total >= 2000 ? 0 : 200;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.address || !form.phone) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      clearCart();
      toast({ title: "Order placed! 🎉", description: "Your mangoes are on the way." });
      navigate("/orders");
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <h1 className="font-display text-3xl font-bold mb-8">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card rounded-xl p-6 border border-border space-y-4">
          <h3 className="font-display font-semibold">Delivery Details</h3>
          <Input placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="Complete Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <Input placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>

        <div className="bg-card rounded-xl p-6 border border-border space-y-4">
          <h3 className="font-display font-semibold">Payment Method</h3>
          <div className="grid grid-cols-2 gap-3">
            {paymentMethods.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setPayment(m.id)}
                className={`flex items-center gap-3 p-3 rounded-lg border text-sm font-medium transition-all ${
                  payment === m.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                }`}
              >
                <m.icon className="w-5 h-5 text-muted-foreground" />
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="font-display font-semibold mb-3">Order Summary</h3>
          {items.map((item) => (
            <div key={`${item.product.id}-${item.weight.kg}`} className="flex justify-between text-sm py-1">
              <span>{item.product.title} × {item.quantity} ({item.weight.label})</span>
              <span>Rs. {(item.weight.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="border-t border-border mt-3 pt-3 flex justify-between text-sm">
            <span className="text-muted-foreground">Delivery</span>
            <span>{delivery === 0 ? "Free" : `Rs. ${delivery}`}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-2">
            <span>Total</span>
            <span>Rs. {(total + delivery).toLocaleString()}</span>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full bg-gradient-mango text-primary-foreground font-semibold shadow-mango"
          disabled={loading}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </Button>
      </form>
    </div>
  );
};

export default CheckoutPage;
