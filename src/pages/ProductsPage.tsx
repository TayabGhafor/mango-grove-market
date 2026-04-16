import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { mockProducts } from "@/data/products";
import { fetchProducts, toStorefrontProduct } from "@/lib/apiClient";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const ProductsPage = () => {
  const queryClient = useQueryClient();
  const { addToCart } = useCart();
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
  const highlighted = list.slice(0, 2);
  const allVarieties = list.slice(2, 8);

  return (
    <div className="min-h-screen bg-[#f4f2ef] py-8">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-[220px_1fr] md:px-6">
        <aside className="space-y-6 md:pt-8">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-[#959595]">Variety</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Sindhri", "Chaunsa", "Anwar Ratol", "Langra"].map((item) => (
                <span key={item} className="rounded-full border border-[#ddd7cd] bg-white px-3 py-1 text-xs text-[#5a5a5a]">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-[#959595]">Weight</h2>
            <div className="mt-3 flex gap-2">
              {["3kg", "5kg", "8kg"].map((weight) => (
                <span key={weight} className={`rounded-full px-3 py-1 text-xs ${weight === "5kg" ? "bg-[#f1cb42] text-[#372b10]" : "border border-[#ddd7cd] bg-white text-[#5a5a5a]"}`}>
                  {weight}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-[#e5dfd6] bg-white p-4">
            <p className="text-xs uppercase tracking-[0.1em] text-[#a1a1a1]">Store Note</p>
            <p className="mt-2 text-sm text-[#656565]">Temperature controlled dispatch keeps flavor and texture peak fresh.</p>
          </div>
        </aside>

        <section>
          <h1 className="font-display text-4xl font-bold text-[#222] md:text-5xl">Seasonal Highlights</h1>
          <p className="mt-2 text-sm text-[#777]">Available for a limited time during this peak harvest run.</p>
          {isLoading ? <p className="mt-3 text-sm text-[#7a7a7a]">Loading products...</p> : null}

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {highlighted.map((item) => {
              const baseWeight = item.weights[0];
              return (
                <article key={item.id} className="overflow-hidden rounded-3xl border border-[#e5dfd6] bg-white shadow-sm">
                  <img src={item.images[0]} alt={item.title} className="h-52 w-full object-cover" />
                  <div className="space-y-3 p-5">
                    <h2 className="text-2xl font-semibold text-[#202020]">{item.title}</h2>
                    <p className="line-clamp-2 text-sm text-[#696969]">{item.description}</p>
                    <p className="text-xl font-bold text-[#2a2a2a]">${item.price.toFixed(2)}</p>
                    <Button
                      type="button"
                      className="w-full rounded-full bg-[#96e2ad] text-[#1e3d24] hover:bg-[#7dd698]"
                      onClick={() => addToCart(item, baseWeight, 1)}
                    >
                      Quick Add to Box
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-10">
            <h3 className="font-display text-4xl font-bold text-[#222]">All Varieties</h3>
            <p className="mt-1 text-sm text-[#777]">Full catalog of Mango Grove excellence.</p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {allVarieties.map((item) => {
                const baseWeight = item.weights[0];
                return (
                  <article key={item.id} className="overflow-hidden rounded-2xl border border-[#e5dfd6] bg-white shadow-sm">
                    <Link to={`/product/${item.id}`}>
                      <img src={item.images[0]} alt={item.title} className="h-48 w-full object-cover" />
                    </Link>
                    <div className="space-y-2 p-4">
                      <Link to={`/product/${item.id}`} className="block text-lg font-semibold text-[#1f1f1f] hover:underline">
                        {item.title}
                      </Link>
                      <p className="line-clamp-2 text-sm text-[#6f6f6f]">{item.description}</p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-lg font-bold text-[#2a2a2a]">${item.price.toFixed(2)}</span>
                        <button
                          type="button"
                          className="rounded-full bg-[#f2efe8] p-2 text-[#5f5f5f] transition-colors hover:bg-[#e7e2d8]"
                          onClick={() => addToCart(item, baseWeight, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductsPage;
