import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Banknote, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { PaymentDetails, PaymentMethod, validateCheckout } from "@/lib/checkoutValidation";
import { createOrder, type ApiOrder } from "@/lib/apiClient";
import { useQueryClient } from "@tanstack/react-query";

const paymentMethods = [
  { id: "cod", label: "Cash on Delivery", icon: Banknote },
  { id: "easypaisa", label: "Easypaisa", icon: Smartphone },
  { id: "jazzcash", label: "JazzCash", icon: Smartphone },
  { id: "card", label: "Card Payment", icon: CreditCard },
] satisfies { id: PaymentMethod; label: string; icon: typeof Banknote }[];

const initialPaymentDetails: PaymentDetails = {
  mobileNumber: "",
  transactionId: "",
  cardNumber: "",
  cardCvc: "",
  cardExpiry: "",
};

const fieldClassName = "space-y-2";
const inputLabelClassName = "text-sm font-medium";

const getNextMonthValue = () => {
  const now = new Date();
  const year = now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();
  const month = now.getMonth() === 11 ? 1 : now.getMonth() + 2;
  return `${year}-${String(month).padStart(2, "0")}`;
};

const getPaymentLabel = (payment: PaymentMethod) => paymentMethods.find((method) => method.id === payment)?.label ?? payment;

const PaymentDetailFields = ({
  payment,
  details,
  onChange,
}: {
  payment: PaymentMethod;
  details: PaymentDetails;
  onChange: (details: PaymentDetails) => void;
}) => {
  if (payment === "cod") {
    return (
      <p className="text-sm text-muted-foreground">
        Pay when your mangoes arrive. The backend still verifies and stores the order before confirmation.
      </p>
    );
  }

  if (payment === "card") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <div className={`${fieldClassName} sm:col-span-2`}>
          <label className={inputLabelClassName} htmlFor="cardNumber">Test card number</label>
          <Input
            id="cardNumber"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="4242 4242 4242 4242"
            value={details.cardNumber}
            onChange={(event) => onChange({ ...details, cardNumber: event.target.value })}
          />
        </div>
        <div className={fieldClassName}>
          <label className={inputLabelClassName} htmlFor="cardCvc">CVC</label>
          <Input
            id="cardCvc"
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder="123"
            value={details.cardCvc}
            onChange={(event) => onChange({ ...details, cardCvc: event.target.value })}
          />
        </div>
        <div className={fieldClassName}>
          <label className={inputLabelClassName} htmlFor="cardExpiry">Expiry</label>
          <Input
            id="cardExpiry"
            type="month"
            min={getNextMonthValue()}
            autoComplete="cc-exp"
            value={details.cardExpiry}
            onChange={(event) => onChange({ ...details, cardExpiry: event.target.value })}
          />
        </div>
        <p className="text-xs text-muted-foreground sm:col-span-2">
          Test mode only: use card 4242 4242 4242 4242, CVC 123, and an expiry later than the current month.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className={fieldClassName}>
        <label className={inputLabelClassName} htmlFor="walletNumber">{getPaymentLabel(payment)} number</label>
        <Input
          id="walletNumber"
          inputMode="tel"
          autoComplete="tel"
          placeholder="03001234567"
          value={details.mobileNumber}
          onChange={(event) => onChange({ ...details, mobileNumber: event.target.value })}
        />
      </div>
      <div className={fieldClassName}>
        <label className={inputLabelClassName} htmlFor="transactionId">Transaction ID</label>
        <Input
          id="transactionId"
          placeholder="TEST-123456"
          value={details.transactionId}
          onChange={(event) => onChange({ ...details, transactionId: event.target.value })}
        />
      </div>
      <p className="text-xs text-muted-foreground sm:col-span-2">
        Test mode accepts a valid wallet number and a 6 to 40 character transaction id.
      </p>
    </div>
  );
};

const CheckoutPage = () => {
  const { items, total, clearCart } = useCart();
  const { user, profile, updateProfile } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: "", address: "", phone: "" });
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>(initialPaymentDetails);
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const hasItems = items.length > 0;
  useEffect(() => {
    if (hasItems) return;
    navigate("/cart");
  }, [hasItems, navigate]);

  useEffect(() => {
    if (!profile || hydrated) return;
    setForm({
      name: profile.name ?? "",
      address: profile.address ?? "",
      phone: profile.phone ?? "",
    });
    setHydrated(true);
  }, [hydrated, profile]);

  if (!hasItems) return null;

  const delivery = total >= 2000 ? 0 : 200;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/login?next=%2Fcheckout");
      return;
    }

    const result = validateCheckout({ form, payment, paymentDetails });
    if (!result.success) {
      toast({
        title: "Check your details",
        description: result.errors[0],
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        title: item.product.title,
        image: item.product.images[0] ?? "",
        weight: {
          label: item.weight.label,
          kg: item.weight.kg as 3 | 5 | 8,
          price: item.weight.price,
        },
        quantity: item.quantity,
      }));

      const paymentPayload = payment === "card"
        ? {
            method: "card" as const,
            verified: true,
            reference: "test-card",
            deliveryFee: delivery,
          }
        : payment === "easypaisa" || payment === "jazzcash"
          ? {
              method: payment,
              verified: true,
              reference: (paymentDetails.transactionId ?? "").trim(),
              deliveryFee: delivery,
            }
          : { method: "cod" as const, verified: true, deliveryFee: delivery };

      const payload = {
        items: orderItems,
        customer: {
          name: form.name.trim(),
          address: form.address.trim(),
          phone: form.phone.trim(),
        },
        payment: paymentPayload,
        total: total + delivery,
      };

      const { order } = await createOrder(payload);

      queryClient.setQueryData<{ orders: ApiOrder[] }>(["orders", "my", user.id], (prev) => {
        const existing = prev?.orders ?? [];
        return { orders: [order, ...existing] };
      });

      try {
        const raw = sessionStorage.getItem(`orders:my:${user.id}`);
        const existing = raw ? (JSON.parse(raw) as { orders?: unknown }).orders : null;
        const nextOrders = Array.isArray(existing) ? [order, ...existing] : [order];
        sessionStorage.setItem(`orders:my:${user.id}`, JSON.stringify({ orders: nextOrders, cachedAt: Date.now() }));
      } catch {
        sessionStorage.removeItem(`orders:my:${user.id}`);
      }

      void updateProfile({
        name: payload.customer.name,
        address: payload.customer.address,
        phone: payload.customer.phone,
      }).catch(() => undefined);

      clearCart();
      toast({ title: "Order placed! 🎉", description: "Your mangoes are on the way." });
      navigate("/orders");
    } catch (error) {
      toast({
        title: "Order failed",
        description: error instanceof Error ? error.message : "Unable to place order.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <h1 className="font-display text-3xl font-bold mb-8">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card rounded-xl p-6 border border-border space-y-4">
          <h3 className="font-display font-semibold">Delivery Details</h3>
          <div className={fieldClassName}>
            <label className={inputLabelClassName} htmlFor="fullName">Full name</label>
            <Input id="fullName" autoComplete="name" placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className={fieldClassName}>
            <label className={inputLabelClassName} htmlFor="address">Complete address</label>
            <Input id="address" autoComplete="street-address" placeholder="House, street, city" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div className={fieldClassName}>
            <label className={inputLabelClassName} htmlFor="phone">Phone number</label>
            <Input id="phone" inputMode="tel" autoComplete="tel" placeholder="03001234567" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border space-y-4">
          <h3 className="font-display font-semibold">Payment Method</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {paymentMethods.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setPayment(m.id)}
                className={`flex items-center gap-3 p-3 rounded-lg border text-sm font-medium transition-all ${
                  payment === m.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                }`}
                aria-pressed={payment === m.id}
              >
                <m.icon className="w-5 h-5 text-muted-foreground" />
                {m.label}
              </button>
            ))}
          </div>
          <PaymentDetailFields payment={payment} details={paymentDetails} onChange={setPaymentDetails} />
          {!user && (
            <p className="text-sm text-muted-foreground">
              You&apos;ll be asked to sign in before placing the order.
            </p>
          )}
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="font-display font-semibold mb-3">Order Summary</h3>
          {items.map((item) => (
            <div key={`${item.product.id}-${item.weight.kg}`} className="flex justify-between gap-3 text-sm py-1">
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
