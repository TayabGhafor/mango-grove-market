import type { Product } from "@/data/products";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { mockProducts } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Star, Minus, Plus, ShoppingCart, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { fetchProduct, toStorefrontProduct } from "@/lib/apiClient";
import { supabase } from "@/integrations/supabase/client";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id as string),
    enabled: Boolean(id),
    staleTime: 60_000,
  });

  useEffect(() => {
    if (!id) return;
    const channel = supabase
      .channel(`product:${id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "products", filter: `id=eq.${id}` }, () => {
        queryClient.invalidateQueries({ queryKey: ["product", id] });
        queryClient.invalidateQueries({ queryKey: ["products"], exact: false });
      })
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [id, queryClient]);

  const cached = (location.state as { product?: Product } | null)?.product;
  const product = data ? toStorefrontProduct(data.product) : cached ?? mockProducts.find((p) => p.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (isLoading && !product) {
    return (
      <div className="container mx-auto px-4 py-20">
        <p className="text-muted-foreground">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Product not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/products")}>Back to Shop</Button>
      </div>
    );
  }

  const weight = product.weights[selectedWeight];

  return (
    <div className="container mx-auto px-4 py-10">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <div className="grid gap-10 md:grid-cols-2">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="mb-3 aspect-square overflow-hidden rounded-2xl bg-muted">
            <img
              src={product.images[selectedImage]}
              alt={product.title}
              className="h-full w-full object-cover"
              decoding="async"
              loading="eager"
              fetchPriority="high"
            />
          </div>
          <div className="flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`h-16 w-16 overflow-hidden rounded-lg border-2 transition-colors ${i === selectedImage ? "border-primary" : "border-border"}`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          {product.deal && (
            <span className="mb-3 inline-block rounded-full bg-gradient-mango px-3 py-1 text-xs font-bold text-primary-foreground">
              {product.deal.label} — {product.deal.discount}% OFF
            </span>
          )}
          <h1 className="font-display text-3xl font-bold">{product.title}</h1>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-primary text-primary" : "text-muted"}`} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
          </div>
          <p className="mt-4 text-muted-foreground">{product.description}</p>

          <div className="mt-6">
            <h3 className="mb-2 text-sm font-medium">Select Weight</h3>
            <div className="flex gap-2">
              {product.weights.map((w, i) => (
                <button
                  key={w.kg}
                  onClick={() => setSelectedWeight(i)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                    i === selectedWeight
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {w.label} — Rs. {w.price.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-lg border border-border">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="rounded-l-lg p-2 hover:bg-muted">
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-4 font-medium">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="rounded-r-lg p-2 hover:bg-muted">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <span className="text-2xl font-bold">Rs. {(weight.price * quantity).toLocaleString()}</span>
          </div>

          <Button
            size="lg"
            className="mt-6 w-full bg-gradient-mango font-semibold text-primary-foreground shadow-mango hover:opacity-90 md:w-auto"
            onClick={() => addToCart(product, weight, quantity)}
          >
            <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;
