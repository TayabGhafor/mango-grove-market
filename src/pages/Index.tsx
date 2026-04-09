import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Truck, Shield, Leaf } from "lucide-react";
import { products, reviews } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

const HeroSection = () => (
  <section className="relative bg-gradient-hero overflow-hidden">
    <div className="container mx-auto px-4 py-20 md:py-28">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            🥭 Fresh Season 2026
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-tight">
            Premium <span className="text-gradient-mango">Pakistani Mangoes</span> at Your Doorstep
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-md">
            Hand-picked Sindhri, Chaunsa & Anwar Ratol — delivered fresh from orchards within 24 hours.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Button asChild size="lg" className="bg-gradient-mango hover:opacity-90 text-primary-foreground font-semibold shadow-mango">
              <Link to="/products">Shop Now <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/search">Browse Varieties</Link>
            </Button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative hidden md:block"
        >
          <div className="relative w-full aspect-square max-w-md mx-auto">
            <img
              src="https://images.unsplash.com/photo-1553279768-865429fa0078?w=600"
              alt="Fresh mangoes"
              className="w-full h-full object-cover rounded-3xl shadow-mango animate-float"
            />
            <div className="absolute -bottom-4 -left-4 bg-card rounded-xl p-3 shadow-card border border-border">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-primary text-primary" />
                <span className="font-bold">4.9</span>
                <span className="text-sm text-muted-foreground">• 1200+ reviews</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const DealsCarousel = () => {
  const dealProducts = products.filter((p) => p.deal);
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="font-display text-3xl font-bold mb-8">🔥 Hot Deals</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dealProducts.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
};

const TrendingSection = () => {
  const trending = products.filter((p) => p.trending);
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-3xl font-bold">Trending Mangoes</h2>
        <Link to="/products" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {trending.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
};

const FeaturesBar = () => (
  <section className="bg-foreground/5 py-12">
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        { icon: Truck, title: "Free Delivery", desc: "On orders above Rs. 2000" },
        { icon: Shield, title: "Quality Guaranteed", desc: "100% fresh or money back" },
        { icon: Leaf, title: "Farm Fresh", desc: "Directly from orchards" },
      ].map((f) => (
        <div key={f.title} className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-mango flex items-center justify-center shrink-0">
            <f.icon className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display font-semibold">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const ReviewsSection = () => (
  <section className="container mx-auto px-4 py-16">
    <h2 className="font-display text-3xl font-bold mb-8">What Customers Say</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {reviews.map((r, i) => (
        <motion.div
          key={r.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-card rounded-xl p-5 border border-border shadow-card"
        >
          <div className="flex gap-1 mb-2">
            {Array.from({ length: r.rating }).map((_, j) => (
              <Star key={j} className="w-4 h-4 fill-primary text-primary" />
            ))}
          </div>
          <p className="text-sm text-foreground/80 mb-3">"{r.text}"</p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{r.name}</span>
            <span>{r.date}</span>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

const Index = () => (
  <div>
    <HeroSection />
    <FeaturesBar />
    <DealsCarousel />
    <TrendingSection />
    <ReviewsSection />
  </div>
);

export default Index;
