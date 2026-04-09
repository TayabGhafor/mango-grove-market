import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { Product } from "@/data/products";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.4 }}
  >
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative rounded-xl overflow-hidden bg-card shadow-card hover:shadow-mango transition-all duration-300 border border-border hover:border-primary/30">
        {product.deal && (
          <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-gradient-mango text-xs font-bold text-primary-foreground">
            {product.deal.label} — {product.deal.discount}% OFF
          </div>
        )}
        {product.trending && (
          <div className="absolute top-3 right-3 z-10 px-2 py-1 rounded-full bg-gradient-leaf text-xs font-bold text-secondary-foreground">
            🔥 Trending
          </div>
        )}
        <div className="aspect-square overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        </div>
        <div className="p-4">
          <h3 className="font-display font-semibold text-lg group-hover:text-gradient-mango transition-colors">
            {product.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between mt-3">
            <span className="font-bold text-lg">Rs. {product.price.toLocaleString()}</span>
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span className="font-medium">{product.rating}</span>
              <span className="text-muted-foreground">({product.reviews})</span>
            </div>
          </div>
          <div className="flex gap-1.5 mt-2">
            {product.weights.map((w) => (
              <span key={w.kg} className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                {w.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

export default ProductCard;
