import { useEffect, useMemo, useState } from "react";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { mockProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { fetchProducts, toStorefrontProduct } from "@/lib/apiClient";
import { supabase } from "@/integrations/supabase/client";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const queryClient = useQueryClient();

  const trimmed = query.trim();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", "search", trimmed],
    queryFn: () => fetchProducts(trimmed ? { q: trimmed } : undefined),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    const channel = supabase
      .channel("products:search")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => {
        queryClient.invalidateQueries({ queryKey: ["products"], exact: false });
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const apiResults = (data?.products ?? []).map(toStorefrontProduct);

  const results = useMemo(() => {
    if (!isError && apiResults.length > 0) return apiResults;
    if (!trimmed) return mockProducts;
    const q = trimmed.toLowerCase();
    return mockProducts.filter(
      (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q),
    );
  }, [apiResults, isError, trimmed]);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold mb-6">Search Mangoes</h1>
      <div className="relative max-w-md mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search by name, category..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      {isLoading && <p className="text-sm text-muted-foreground mb-4">Searching...</p>}
      {results.length === 0 ? (
        <p className="text-muted-foreground">No mangoes found for "{query}"</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
