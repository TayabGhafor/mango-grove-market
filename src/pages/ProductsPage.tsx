import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const ProductsPage = () => (
  <div className="container mx-auto px-4 py-10">
    <h1 className="font-display text-3xl font-bold mb-2">Our Mangoes</h1>
    <p className="text-muted-foreground mb-8">Fresh, premium mangoes from Pakistan's finest orchards.</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} index={i} />
      ))}
    </div>
  </div>
);

export default ProductsPage;
