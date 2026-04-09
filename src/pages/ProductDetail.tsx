import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Star, Minus, Plus, ShoppingCart, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = products.find((p) => p.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState(0);
  const [quantity, setQuantity] = useState(1);

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
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <div className="grid md:grid-cols-2 gap-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="aspect-square rounded-2xl overflow-hidden bg-muted mb-3">
            <img src={product.images[selectedImage]} alt={product.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${i === selectedImage ? "border-primary" : "border-border"}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          {product.deal && (
            <span className="inline-block px-3 py-1 rounded-full bg-gradient-mango text-xs font-bold text-primary-foreground mb-3">
              {product.deal.label} — {product.deal.discount}% OFF
            </span>
          )}
          <h1 className="font-display text-3xl font-bold">{product.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? "fill-primary text-primary" : "text-muted"}`} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
          </div>
          <p className="text-muted-foreground mt-4">{product.description}</p>

          <div className="mt-6">
            <h3 className="font-medium text-sm mb-2">Select Weight</h3>
            <div className="flex gap-2">
              {product.weights.map((w, i) => (
                <button
                  key={w.kg}
                  onClick={() => setSelectedWeight(i)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
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
            <div className="flex items-center border border-border rounded-lg">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-muted rounded-l-lg">
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 font-medium">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-muted rounded-r-lg">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <span className="text-2xl font-bold">Rs. {(weight.price * quantity).toLocaleString()}</span>
          </div>

          <Button
            size="lg"
            className="mt-6 bg-gradient-mango hover:opacity-90 text-primary-foreground font-semibold shadow-mango w-full md:w-auto"
            onClick={() => addToCart(product, weight, quantity)}
          >
            <ShoppingCart className="mr-2 w-5 h-5" /> Add to Cart
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;
