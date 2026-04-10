import "dotenv/config";
import { app } from "./app.js";
import { connectDatabase } from "./config/db.js";
import { User } from "./models/User.js";
import { Product } from "./models/Product.js";

const port = process.env.PORT || 5000;

const seedAdminUser = async () => {
  const adminEmail = (process.env.ADMIN_EMAIL ?? "admin@mangogrove.com").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin@mangogrove";
  const adminName = process.env.ADMIN_NAME ?? "Admin";
  const allowReset = process.env.NODE_ENV !== "production";

  const existing = await User.findOne({ email: adminEmail }).select("+password");
  if (!existing) {
    await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    });
    console.log(`Seeded admin user: ${adminEmail}`);
    return;
  }

  let changed = false;
  if (existing.role !== "admin") {
    existing.role = "admin";
    changed = true;
  }

  if (allowReset) {
    existing.password = adminPassword;
    changed = true;
  }

  if (changed) {
    await existing.save();
    console.log(`Updated admin user: ${adminEmail}`);
  }
};

const seedSampleProducts = async () => {
  const allowSeed = process.env.SEED_SAMPLE_DATA !== "false" && process.env.NODE_ENV !== "production";
  if (!allowSeed) return;

  const count = await Product.countDocuments();
  if (count > 0) return;

  await Product.insertMany([
    {
      title: "Sindhri Mango",
      description:
        "The king of mangoes — sweet, aromatic, and irresistibly juicy. Grown in the fertile lands of Sindh, Pakistan. Known for its elongated shape and golden-yellow skin.",
      images: [
        "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600",
        "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600",
      ],
      category: "Premium",
      basePrice: 1200,
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
      basePrice: 1400,
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
      basePrice: 1600,
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
      basePrice: 1100,
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
      basePrice: 1300,
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
      basePrice: 3500,
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

  console.log("Seeded sample products.");
};

connectDatabase()
  .then(() => {
    return seedAdminUser();
  })
  .then(() => seedSampleProducts())
  .then(() => {
    app.listen(port, () => console.log(`Mango Grove API listening on port ${port}`));
  })
  .catch((error) => {
    console.error("Failed to start API", error);
    process.exit(1);
  });
