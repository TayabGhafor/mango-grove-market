import React, { createContext, useContext, useState, useCallback } from "react";
import { CartItem, Product } from "@/data/products";
import { toast } from "@/hooks/use-toast";

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

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: Product, weight: Product["weights"][0], quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.product.id === product.id && i.weight.kg === weight.kg
      );
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id && i.weight.kg === weight.kg
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { product, weight, quantity }];
    });
    toast({ title: "Added to cart!", description: `${product.title} (${weight.label})` });
  }, []);

  const removeFromCart = useCallback((productId: string, weightKg: number) => {
    setItems((prev) => prev.filter((i) => !(i.product.id === productId && i.weight.kg === weightKg)));
  }, []);

  const updateQuantity = useCallback((productId: string, weightKg: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, weightKg);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId && i.weight.kg === weightKg ? { ...i, quantity } : i
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
