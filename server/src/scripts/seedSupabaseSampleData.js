import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL ?? "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

const run = async () => {
  if (!supabaseUrl) throw new Error("SUPABASE_URL is required.");
  if (!serviceRoleKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is required.");

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { count, error: countError } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true });
  if (countError) throw countError;
  if ((count ?? 0) > 0) {
    console.log("Supabase products already exist. Skipping seed.");
    return;
  }

  const { error } = await supabase.from("products").insert([
    {
      title: "Sindhri Mango",
      description:
        "The king of mangoes — sweet, aromatic, and irresistibly juicy. Grown in the fertile lands of Sindh, Pakistan. Known for its elongated shape and golden-yellow skin.",
      images: [
        "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600",
        "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600",
      ],
      category: "Premium",
      base_price: 1200,
      weights: [
        { label: "3 KG", kg: 3, price: 1200 },
        { label: "5 KG", kg: 5, price: 1900 },
        { label: "8 KG", kg: 8, price: 2800 },
      ],
      rating: 4.9,
      reviews: 234,
      trending: true,
      deal: { discount: 15, label: "Summer Sale" },
      active: true,
    },
    {
      title: "Chaunsa Mango",
      description:
        "Sweetest mango variety with a rich, creamy texture and intoxicating fragrance. A true Pakistani delicacy loved worldwide.",
      images: [
        "https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=600",
        "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=600",
      ],
      category: "Premium",
      base_price: 1400,
      weights: [
        { label: "3 KG", kg: 3, price: 1400 },
        { label: "5 KG", kg: 5, price: 2200 },
        { label: "8 KG", kg: 8, price: 3200 },
      ],
      rating: 4.8,
      reviews: 189,
      trending: true,
      active: true,
    },
    {
      title: "Anwar Ratol",
      description:
        "Small but mighty — the Anwar Ratol is a flavor bomb. Compact size, intense sweetness, and a velvety smooth pulp.",
      images: [
        "https://images.unsplash.com/photo-1563114773-84221bd62daa?w=600",
        "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600",
      ],
      category: "Exotic",
      base_price: 1600,
      weights: [
        { label: "3 KG", kg: 3, price: 1600 },
        { label: "5 KG", kg: 5, price: 2500 },
        { label: "8 KG", kg: 8, price: 3800 },
      ],
      rating: 4.7,
      reviews: 156,
      trending: false,
      deal: { discount: 10, label: "New Arrival" },
      active: true,
    },
    {
      title: "Langra Mango",
      description:
        "A heritage variety with a distinct tangy-sweet flavor. Green-skinned even when ripe, with fiber-free golden pulp.",
      images: [
        "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600",
        "https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=600",
      ],
      category: "Classic",
      base_price: 1100,
      weights: [
        { label: "3 KG", kg: 3, price: 1100 },
        { label: "5 KG", kg: 5, price: 1700 },
        { label: "8 KG", kg: 8, price: 2500 },
      ],
      rating: 4.6,
      reviews: 98,
      trending: false,
      active: true,
    },
    {
      title: "Dusehri Mango",
      description:
        "Elegant and aromatic with a thin skin and fiber-free, sweet flesh. A connoisseur's choice for refined palates.",
      images: [
        "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=600",
        "https://images.unsplash.com/photo-1563114773-84221bd62daa?w=600",
      ],
      category: "Premium",
      base_price: 1300,
      weights: [
        { label: "3 KG", kg: 3, price: 1300 },
        { label: "5 KG", kg: 5, price: 2000 },
        { label: "8 KG", kg: 8, price: 3000 },
      ],
      rating: 4.5,
      reviews: 67,
      trending: true,
      active: true,
    },
    {
      title: "Mango Gift Box",
      description:
        "A curated selection of our finest mangoes — perfect for gifting. Includes Sindhri, Chaunsa, and Anwar Ratol.",
      images: [
        "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600",
        "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600",
      ],
      category: "Gift",
      base_price: 3500,
      weights: [
        { label: "3 KG", kg: 3, price: 3500 },
        { label: "5 KG", kg: 5, price: 5500 },
        { label: "8 KG", kg: 8, price: 8000 },
      ],
      rating: 4.9,
      reviews: 312,
      trending: true,
      deal: { discount: 20, label: "Best Seller" },
      active: true,
    },
  ]);

  if (error) throw error;
  console.log("Seeded Supabase sample products.");
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

