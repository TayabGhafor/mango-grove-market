import React, { createContext, useContext, useState, useCallback } from "react";
import { CartItem, Product } from "@/data/products";
import { toast } from "@/hooks/use-toast";

const MAX_CART_QUANTITY = 99;

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, weight: Product["weights"][0], quantity?: number) => void;
  removeFromCart: (productId: string, weightKg: number) => void;
  updateQuantity: (productId: string, weightKg: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const normalizeQuantity = (quantity: number) => {
  if (!Number.isFinite(quantity)) return 1;
  return Math.min(MAX_CART_QUANTITY, Math.max(1, Math.floor(quantity)));
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: Product, weight: Product["weights"][0], quantity = 1) => {
    const selectedWeight = product.weights.find((w) => w.kg === weight.kg);
    if (!selectedWeight) {
      toast({ title: "Invalid weight selected", variant: "destructive" });
      return;
    }

    const safeQuantity = normalizeQuantity(quantity);

    setItems((prev) => {
      const existing = prev.find(
        (i) => i.product.id === product.id && i.weight.kg === selectedWeight.kg
      );
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id && i.weight.kg === selectedWeight.kg
            ? { ...i, quantity: normalizeQuantity(i.quantity + safeQuantity) }
            : i
        );
      }
      return [...prev, { product, weight: selectedWeight, quantity: safeQuantity }];
    });
    toast({ title: "Added to cart!", description: `${product.title} (${selectedWeight.label})` });
  }, []);

  const removeFromCart = useCallback((productId: string, weightKg: number) => {
    setItems((prev) => prev.filter((i) => !(i.product.id === productId && i.weight.kg === weightKg)));
  }, []);

  const updateQuantity = useCallback((productId: string, weightKg: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, weightKg);
      return;
    }
    const safeQuantity = normalizeQuantity(quantity);
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId && i.weight.kg === weightKg ? { ...i, quantity: safeQuantity } : i
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, i) => sum + i.weight.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
