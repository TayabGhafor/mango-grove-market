import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { mockProducts } from "@/data/products";
import { fetchProducts, toStorefrontProduct } from "@/lib/apiClient";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/context/CartContext";
import { Plus, ShoppingCart, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const varieties = ["Sindhri", "Chaunsa", "Anwar Ratol", "Langra"];
const collections = ["Premium Reserve", "Seasonal Specials", "Bulk Harvest"];
const weights = ["3kg", "5kg", "8kg"];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.45 } }),
};

const ProductsPage = () => {
  const queryClient = useQueryClient();
  const { addToCart } = useCart();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(),
  });

  const [selectedVariety, setSelectedVariety] = useState("Sindhri");
  const [selectedCollection, setSelectedCollection] = useState("Premium Reserve");
  const [selectedWeight, setSelectedWeight] = useState("5kg");

  useEffect(() => {
    const channel = supabase
      .channel("products:list")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => {
        queryClient.invalidateQueries({ queryKey: ["products"], exact: false });
      })
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [queryClient]);

  const products = (data?.products ?? []).map(toStorefrontProduct);
  const list = isError || products.length === 0 ? mockProducts : products;
  const highlighted = list.slice(0, 2);
  const allVarieties = list.slice(2, 8);

  return (
    <div className="min-h-screen bg-[#f4f2ef]">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="grid items-start gap-8 md:grid-cols-2">
          <div>
            <span className="inline-block rounded-full bg-[#c0392b] px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white">
              Harvest Season 2024
            </span>
            <h1 className="mt-5 font-display text-[3.2rem] font-bold italic leading-[1.02] text-[#1a1a1a] md:text-[3.6rem]">
              Pure Golden Indulgence.
            </h1>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-[#6f6f6f]">
              Hand-picked at the peak of ripeness from the sun-drenched groves of Sindh. Experience the artisanal heritage of Royal Orchard.
            </p>
            <Link
              to="/products"
              className="mt-7 inline-block rounded-full bg-[#2d6e2a] px-7 py-3 text-sm font-semibold text-white shadow-sm"
            >
              Browse Collection
            </Link>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=1000&q=80"
              alt="Golden mangoes"
              className="h-[300px] w-full rounded-[24px] object-cover shadow-lg"
            />
            <img
              src="https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=500&q=80"
              alt="Sliced mango"
              className="absolute -bottom-8 left-8 h-[160px] w-[180px] rounded-[20px] border-4 border-[#f4f2ef] object-cover shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-14 md:px-6">
        <div className="grid gap-10 md:grid-cols-[220px_1fr]">
          {/* Filter sidebar */}
          <aside className="space-y-7">
            <h2 className="font-display text-xl font-bold italic text-[#1a1a1a]">Refine Selection</h2>

            <div>
              <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#999]">Variety</h3>
              <div className="flex flex-wrap gap-2">
                {varieties.map((v) => (
                  <button
                    key={v}
                    onClick={() => setSelectedVariety(v)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      v === selectedVariety
                        ? "bg-[#2d6e2a] text-white"
                        : "border border-[#ddd] bg-white text-[#555] hover:border-[#aaa]"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#999]">Collection</h3>
              <div className="space-y-1.5">
                {collections.map((c) => (
                  <label key={c} className="flex cursor-pointer items-center gap-2 text-sm text-[#444]">
                    <input
                      type="radio"
                      name="collection"
                      checked={c === selectedCollection}
                      onChange={() => setSelectedCollection(c)}
                      className="accent-[#c0392b]"
                    />
                    {c}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#999]">Weight</h3>
              <div className="flex gap-2">
                {weights.map((w) => (
                  <button
                    key={w}
                    onClick={() => setSelectedWeight(w)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      w === selectedWeight
                        ? "bg-[#f1cb42] text-[#372b10]"
                        : "border border-[#ddd] bg-white text-[#555] hover:border-[#aaa]"
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#e5dfd6] bg-[#fdf8f0] p-4">
              <Sparkles className="h-5 w-5 text-[#d4a017]" />
              <p className="mt-2 text-sm font-semibold text-[#333]">Temperature Controlled</p>
              <p className="mt-1 text-xs text-[#777]">Shipped in specialized organic packaging to maintain farm freshness.</p>
            </div>
          </aside>

          {/* Products */}
          <div>
            <div className="mb-5 flex items-end justify-between">
              <div>
                <h2 className="font-display text-3xl font-bold text-[#1a1a1a]">Seasonal Highlights</h2>
                <p className="text-sm text-[#888]">Available for a limited time during the peak harvest moon.</p>
              </div>
              <Link to="/products" className="text-sm font-medium text-[#555] underline underline-offset-4 hover:text-[#1a1a1a]">
                View All Highlights
              </Link>
            </div>

            {isLoading && <p className="text-sm text-[#888]">Loading products...</p>}

            <div className="grid gap-5 lg:grid-cols-2">
              {highlighted.map((item, i) => {
                const baseWeight = item.weights[0];
                const badges = ["JUST PICKED", "LIMITED HARVEST"];
                return (
                  <motion.article
                    key={item.id}
                    className="group overflow-hidden rounded-2xl border border-[#e5dfd6] bg-white shadow-sm"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    custom={i}
                  >
                    <div className="relative h-56 overflow-hidden">
                      <Link to={`/product/${item.id}`}>
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </Link>
                      <span className="absolute left-3 top-3 rounded-md bg-[#c0392b] px-2.5 py-1 text-[10px] font-bold uppercase text-white">
                        {badges[i]}
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between">
                        <Link to={`/product/${item.id}`}>
                          <h3 className="font-display text-xl font-bold text-[#1a1a1a] hover:underline">{item.title}</h3>
                        </Link>
                        <span className="font-display text-xl font-bold text-[#1a1a1a]">${item.price.toFixed(2)}</span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-[#777]">{item.description}</p>
                      <p className="mt-2 text-xs text-[#aaa]">+3 Pack sizes available</p>
                      <button
                        type="button"
                        onClick={() => addToCart(item, baseWeight, 1)}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#96e2ad] py-3 text-sm font-semibold text-[#1e3d24] transition-colors hover:bg-[#7dd698]"
                      >
                        <ShoppingCart className="h-4 w-4" /> Quick Add to Box
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </div>

            {/* All Varieties */}
            <div className="mt-14">
              <h3 className="font-display text-3xl font-bold text-[#1a1a1a]">All Varieties</h3>
              <p className="mt-1 text-sm text-[#888]">The full catalog of Royal Orchard excellence.</p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {allVarieties.map((item, i) => {
                  const baseWeight = item.weights[0];
                  return (
                    <motion.article
                      key={item.id}
                      className="group overflow-hidden rounded-2xl border border-[#e5dfd6] bg-white shadow-sm"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={fadeUp}
                      custom={i}
                    >
                      <Link to={`/product/${item.id}`}>
                        <div className="h-48 overflow-hidden">
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      </Link>
                      <div className="p-4">
                        <Link to={`/product/${item.id}`} className="block font-display text-lg font-semibold text-[#1a1a1a] hover:underline">
                          {item.title}
                        </Link>
                        <p className="mt-1 line-clamp-2 text-xs text-[#777]">{item.description}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-lg font-bold text-[#1a1a1a]">${item.price.toFixed(2)}</span>
                          <button
                            type="button"
                            onClick={() => addToCart(item, baseWeight, 1)}
                            className="rounded-full bg-[#f2efe8] p-2 text-[#5f5f5f] transition-colors hover:bg-[#e7e2d8]"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
