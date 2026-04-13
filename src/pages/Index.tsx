import { Link } from "react-router-dom";
import { useState } from "react";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Star, Users, Heart, Leaf, CheckCircle, Sparkles } from "lucide-react";
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
    whileHover={{ y: -4, boxShadow: "0 12px 30px -8px rgba(0,0,0,0.12)" }}
    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer"
  >
    <div className="flex-1">
      <h3 className="font-display text-lg font-bold text-gray-900 leading-tight">
        Fresh<br />Chaunsa
      </h3>
      <p className="text-amber-600 font-bold text-base mt-1">Rs. 1,200</p>
      <p className="text-gray-400 text-xs">For 5 kg box</p>
    </div>
    <motion.img
      src={mangoProduct}
      alt="Fresh Chaunsa Mangoes"
      className="w-28 h-28 object-contain"
      width={512}
      height={512}
      whileHover={{ scale: 1.08, rotate: 3 }}
      transition={{ type: "spring", stiffness: 300 }}
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

/* ── Interactive Hero Mango ── */
const InteractiveMangoImage = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-150, 150], [8, -8]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-150, 150], [-8, 8]), { stiffness: 150, damping: 20 });
  const glowOpacity = useSpring(0, { stiffness: 200, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 800);
  };

  return (
    <motion.div
      className="absolute right-4 bottom-4 top-4 w-[50%] max-w-[420px] flex items-center justify-center cursor-grab active:cursor-grabbing"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        setIsHovered(true);
        glowOpacity.set(1);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.set(0);
        mouseY.set(0);
        glowOpacity.set(0);
      }}
      onClick={handleClick}
      style={{ perspective: 600 }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-amber-400/20 blur-3xl"
        style={{ opacity: glowOpacity }}
      />

      {/* Ripple effects on click */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute rounded-full border-2 border-amber-400/50 pointer-events-none"
            style={{ left: ripple.x, top: ripple.y, x: "-50%", y: "-50%" }}
            initial={{ width: 0, height: 0, opacity: 0.8 }}
            animate={{ width: 120, height: 120, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      {/* Sparkle particles on hover */}
      <AnimatePresence>
        {isHovered &&
          [0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute pointer-events-none"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: [0, (i % 2 === 0 ? 1 : -1) * (20 + i * 15)],
                y: [0, -30 - i * 12],
              }}
              transition={{ duration: 1.2, delay: i * 0.15, repeat: Infinity, repeatDelay: 0.5 }}
              style={{
                right: `${30 + i * 10}%`,
                top: `${20 + i * 8}%`,
              }}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
            </motion.div>
          ))}
      </AnimatePresence>

      {/* The mango image */}
      <motion.img
        src={heroMango}
        alt="Premium Pakistani Mango — click or hover to interact"
        className="w-full h-full object-contain pointer-events-none select-none drop-shadow-2xl"
        width={800}
        height={800}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
        style={{
          rotateX,
          rotateY,
        }}
        whileHover={{ scale: 1.04 }}
      />

      {/* Tooltip on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute -top-2 left-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-full whitespace-nowrap pointer-events-none"
            initial={{ opacity: 0, y: 8, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
          >
            🥭 Click me!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

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
          className="group inline-flex items-center gap-2 bg-[hsl(85,30%,30%)] hover:bg-[hsl(85,30%,25%)] text-white px-7 py-3.5 rounded-lg font-semibold text-base transition-all duration-300 hover:shadow-lg hover:shadow-green-900/20"
        >
          Shop Now
          <motion.span
            className="inline-block"
            whileHover={{ x: 3, y: -3 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </motion.span>
        </Link>
      </motion.div>
    </div>

    {/* Interactive Hero Mango Image */}
    <InteractiveMangoImage />

    {/* 100% Original Badge */}
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.7, duration: 0.4 }}
      whileHover={{ scale: 1.1, rotate: 10 }}
      className="absolute top-8 right-8 md:top-12 md:right-16 z-20 cursor-pointer"
    >
      <div className="bg-[hsl(85,30%,30%)] text-white rounded-full w-16 h-16 flex flex-col items-center justify-center text-[10px] font-bold leading-tight shadow-lg">
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
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

    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        whileHover={{ y: -3, boxShadow: "0 8px 25px -6px rgba(0,0,0,0.1)" }}
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
          <div className="flex flex-col gap-4">
            <ProductCard />
            <AboutCard />
            <ReviewsCard />
          </div>
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
