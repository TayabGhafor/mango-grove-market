import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Star, Users, Heart, Leaf, CheckCircle } from "lucide-react";
import heroMango from "@/assets/hero-mango.png";
import mangoProduct from "@/assets/mango-product.png";
import mangoBasket from "@/assets/mango-basket.png";
import mangoBox from "@/assets/mango-box.png";

/* ── Left Panel: Product Card ── */
const ProductCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1, duration: 0.5 }}
    whileHover={{ y: -4 }}
    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4"
  >
    <div className="flex-1">
      <h3 className="font-display text-lg font-bold text-gray-900 leading-tight">
        Fresh<br />Chaunsa
      </h3>
      <p className="text-amber-600 font-bold text-base mt-1">Rs. 1,200</p>
      <p className="text-gray-400 text-xs">For 5 kg box</p>
    </div>
    <img
      src={mangoProduct}
      alt="Fresh Chaunsa Mangoes"
      className="w-28 h-28 object-contain"
      width={512}
      height={512}
    />
  </motion.div>
);

/* ── Left Panel: About Card ── */
const AboutCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2, duration: 0.5 }}
    whileHover={{ y: -4 }}
    className="bg-[hsl(85,30%,30%)] rounded-2xl p-6 text-white flex flex-col items-center text-center"
  >
    <span className="text-xs uppercase tracking-widest text-white/60 mb-3">About Us</span>
    <h3 className="font-display text-lg font-bold leading-snug">
      From Farm to Table: All About Your Favourite Mangoes
    </h3>
    <div className="flex items-center gap-6 mt-5 text-sm text-white/70">
      <span className="flex items-center gap-1.5">
        <Users className="w-4 h-4" /> 13k Followers
      </span>
      <span className="flex items-center gap-1.5">
        <Heart className="w-4 h-4" /> 30k Likes
      </span>
    </div>
  </motion.div>
);

/* ── Left Panel: Reviews ── */
const ReviewsCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3, duration: 0.5 }}
    className="space-y-4"
  >
    <div className="flex items-start gap-4">
      <div>
        <div className="flex gap-0.5 mb-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
          ))}
        </div>
        <p className="text-sm text-gray-600">
          <span className="font-bold text-gray-900">5000+</span> clients reviews (4.8 of 5)
        </p>
        <button className="text-xs font-bold text-amber-700 uppercase tracking-wider mt-1 hover:underline">
          Read More
        </button>
      </div>
      <div className="ml-auto bg-gray-900 text-white rounded-xl px-4 py-3 text-center shrink-0">
        <span className="text-2xl font-black leading-none">1CR</span>
        <p className="text-[10px] mt-0.5 text-white/80">Subscriber</p>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 border-2 border-white"
          />
        ))}
      </div>
      <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide leading-tight">
        Satisfied clients<br />with positive feedback
      </p>
    </div>
  </motion.div>
);

/* ── Hero Section (Right) ── */
const HeroSection = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
    className="relative bg-[hsl(85,20%,85%)] rounded-3xl overflow-hidden flex flex-col justify-between p-8 md:p-12 min-h-[500px] lg:min-h-[600px]"
  >
    {/* Badge */}
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="flex items-center gap-2 mb-4"
    >
      <span className="bg-white/80 backdrop-blur rounded-full px-4 py-1.5 text-sm text-gray-700 flex items-center gap-2">
        Organic <span className="bg-[hsl(85,30%,30%)] text-white rounded-full px-2 py-0.5 text-xs font-medium">&</span> Premium
      </span>
    </motion.div>

    {/* Heading */}
    <div className="relative z-10 max-w-md">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="font-display text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 leading-[0.9] tracking-tight"
      >
        Garden<br />Fresh
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-6"
      >
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-[hsl(85,30%,30%)] hover:bg-[hsl(85,30%,25%)] text-white px-7 py-3.5 rounded-lg font-semibold text-base transition-all duration-300 hover:shadow-lg hover:shadow-green-900/20"
        >
          Shop Now <ArrowUpRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </div>

    {/* Hero Mango Image */}
    <motion.img
      src={heroMango}
      alt="Premium Pakistani Mango"
      className="absolute right-0 top-1/2 -translate-y-1/2 w-[55%] max-w-[450px] object-contain pointer-events-none"
      width={800}
      height={800}
      initial={{ opacity: 0, scale: 0.9, x: 40 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 0.8 }}
      style={{ animation: "float 6s ease-in-out infinite" }}
    />

    {/* 100% Original Badge */}
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.7, duration: 0.4 }}
      className="absolute top-8 right-8 md:top-12 md:right-16"
    >
      <div className="bg-[hsl(85,30%,30%)] text-white rounded-full w-16 h-16 flex flex-col items-center justify-center text-[10px] font-bold leading-tight">
        <span className="text-xs">100%</span>
        <CheckCircle className="w-4 h-4 mt-0.5" />
        <span>Original</span>
      </div>
    </motion.div>
  </motion.div>
);

/* ── Bottom Stats Section ── */
const StatsSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
    {/* Left stats */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="bg-[hsl(85,20%,40%)] rounded-2xl p-6 text-white relative overflow-hidden"
    >
      <p className="text-4xl font-black text-amber-300">2390+</p>
      <p className="text-sm text-white/70 mt-1">Orders daily</p>
      <img
        src={mangoBasket}
        alt="Mango basket"
        className="absolute right-2 bottom-0 w-32 h-28 object-contain opacity-80"
        loading="lazy"
        width={640}
        height={512}
      />
      <div className="mt-8 flex items-center gap-2">
        <Leaf className="w-5 h-5 text-green-300" />
        <span className="text-2xl font-black text-amber-200">100%</span>
        <span className="text-sm text-white/70">Natural</span>
      </div>
    </motion.div>

    {/* Right cards */}
    <div className="space-y-4">
      {/* Trusted User */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        whileHover={{ y: -3 }}
        className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-300 to-amber-500" />
        <div className="flex-1">
          <p className="text-2xl font-black text-gray-900">34k</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">#Trusted User</p>
        </div>
        <button className="text-xs font-semibold border border-gray-300 rounded-full px-4 py-1.5 text-gray-600 hover:bg-gray-50 transition-colors">
          Follow Us
        </button>
      </motion.div>

      {/* Mango Magic card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        whileHover={{ y: -3 }}
        className="bg-[hsl(85,15%,50%)] rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden"
      >
        <img
          src={mangoBox}
          alt="Mango delivery box"
          className="w-20 h-20 object-contain"
          loading="lazy"
          width={512}
          height={512}
        />
        <div className="text-white">
          <h4 className="font-display font-bold text-sm leading-snug">
            Mango Magic:<br />Where Health Meets<br />Flavor
          </h4>
          <p className="text-xs text-white/60 mt-1.5 flex items-center gap-1">
            📍 Pakistan
          </p>
        </div>
      </motion.div>
    </div>
  </div>
);

/* ── Main Page ── */
const Index = () => {
  return (
    <div className="bg-[hsl(40,20%,95%)] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
          {/* Left Column */}
          <div className="flex flex-col gap-4">
            <ProductCard />
            <AboutCard />
            <ReviewsCard />
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4">
            <HeroSection />
            <StatsSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
