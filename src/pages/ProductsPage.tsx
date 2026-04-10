import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { mockProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { fetchProducts, toStorefrontProduct } from "@/lib/apiClient";
import { supabase } from "@/integrations/supabase/client";

const ProductsPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(),
  });

  useEffect(() => {
    const channel = supabase
      .channel("products:list")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => {
        queryClient.invalidateQueries({ queryKey: ["products"], exact: false });
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const products = (data?.products ?? []).map(toStorefrontProduct);
  const list = isError || products.length === 0 ? mockProducts : products;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold mb-2">Our Mangoes</h1>
      <p className="text-muted-foreground mb-8">Fresh, premium mangoes from Pakistan&apos;s finest orchards.</p>
      {isLoading && <p className="text-sm text-muted-foreground mb-4">Loading products...</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
