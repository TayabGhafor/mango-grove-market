import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

const CartPage = () => {
  const { items, updateQuantity, removeFromCart, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
        <h2 className="font-display text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Add some delicious mangoes!</p>
        <Button asChild className="bg-gradient-mango text-primary-foreground">
          <Link to="/products">Browse Mangoes</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, i) => (
            <motion.div
              key={`${item.product.id}-${item.weight.kg}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-4 bg-card rounded-xl p-4 border border-border"
            >
              <img src={item.product.images[0]} alt={item.product.title} className="w-20 h-20 rounded-lg object-cover" />
              <div className="flex-1">
                <h3 className="font-display font-semibold">{item.product.title}</h3>
                <p className="text-sm text-muted-foreground">{item.weight.label}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center border border-border rounded-lg">
                    <button onClick={() => updateQuantity(item.product.id, item.weight.kg, item.quantity - 1)} className="p-1.5 hover:bg-muted rounded-l-lg">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.weight.kg, item.quantity + 1)} className="p-1.5 hover:bg-muted rounded-r-lg">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="font-bold">Rs. {(item.weight.price * item.quantity).toLocaleString()}</span>
                </div>
              </div>
              <button onClick={() => removeFromCart(item.product.id, item.weight.kg)} className="text-destructive hover:bg-destructive/10 p-2 rounded-lg self-start">
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
        <div className="bg-card rounded-xl p-6 border border-border h-fit sticky top-20">
          <h3 className="font-display font-semibold text-lg mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>Rs. {total.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span className="text-secondary font-medium">{total >= 2000 ? "Free" : "Rs. 200"}</span></div>
            <div className="border-t border-border my-3" />
            <div className="flex justify-between font-bold text-lg"><span>Total</span><span>Rs. {(total + (total >= 2000 ? 0 : 200)).toLocaleString()}</span></div>
          </div>
          <Button asChild className="w-full mt-6 bg-gradient-mango text-primary-foreground font-semibold shadow-mango" size="lg">
            <Link to="/checkout">Proceed to Checkout</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
