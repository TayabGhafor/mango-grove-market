import { Star, Truck, ShieldCheck, Leaf, SmilePlus, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const offers = [
  {
    id: "offer-1",
    title: "Family Orchard Box",
    subtitle: "10kg Mixed Varieties",
    price: "$45.00",
    oldPrice: "$60.00",
    badge: "25% OFF",
    badgeColor: "bg-[#c0392b] text-white",
    image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "offer-2",
    title: "The Anwar Ratol Dozen",
    subtitle: "12 Hand-picked Premium",
    price: "$32.00",
    badge: "BEST SELLER",
    badgeColor: "bg-[#c0392b] text-white",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "offer-3",
    title: "Monthly Harvest Club",
    subtitle: "Fresh delivery every 2 weeks",
    price: "$75.00",
    oldPrice: "/mo",
    badge: "SUBSCRIPTION",
    badgeColor: "bg-[#d4a017] text-white",
    image: "https://images.unsplash.com/photo-1623934199716-dc28818a6ec7?auto=format&fit=crop&w=800&q=80",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.5, ease: [0, 0, 0.2, 1] as const } }),
};

const Index = () => (
  <div className="min-h-screen bg-[#f4f2ef]">
    {/* ─── HERO ─── */}
    <section className="mx-auto max-w-7xl px-4 pb-6 pt-8 md:px-6">
      <div className="grid items-start gap-8 md:grid-cols-2">
        {/* Left */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e6f4d3] px-4 py-1.5 text-xs font-semibold text-[#3e7b36]">
            <span className="h-2 w-2 rounded-full bg-[#3e7b36]" />
            2024 Harvest Now Live
          </span>
          <h1 className="mt-6 font-display text-[3.2rem] font-bold leading-[1.05] text-[#1a1a1a] md:text-[3.8rem]">
            Fresh Organic{" "}
            <span className="text-[#c0392b]">Mangoes</span> from
            the Farm to Your Doorstep.
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#6f6f6f]">
            Experience the gold standard of tropical fruit. Hand-picked at peak ripeness and delivered within 48 hours.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Link
              to="/products"
              className="rounded-full bg-[#2d6e2a] px-7 py-3 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.03]"
            >
              Shop the Harvest
            </Link>
            <Link
              to="/products"
              className="rounded-full border border-[#2a2a2a] px-7 py-3 text-sm font-semibold text-[#2a2a2a] transition-colors hover:bg-[#2a2a2a] hover:text-white"
            >
              Our Orchard
            </Link>
          </div>

          {/* Review callout */}
          <div className="mt-8 flex items-start gap-3">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="mb-1 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-[#d4a01f] text-[#d4a01f]" />
                ))}
              </div>
              <p className="text-xs italic text-[#555]">
                "The sweetest Sindhri I've ever tasted. Pure sunshine in every bite!"
              </p>
              <p className="mt-1 text-[11px] font-semibold text-[#888]">— Sarah M., Karachi</p>
            </div>
          </div>
        </motion.div>

        {/* Right — hero mango */}
        <motion.div
          className="relative mx-auto w-full max-w-[520px]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <img
            src="https://images.unsplash.com/photo-1605027990121-cbae9f938639?auto=format&fit=crop&w=1100&q=80"
            alt="Fresh mango close up"
            className="h-[420px] w-full rounded-[28px] object-cover shadow-xl"
          />
        </motion.div>
      </div>

      {/* Floating cart icon */}
      <div className="mt-4 flex justify-end">
        <Link
          to="/cart"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d4a017] text-white shadow-lg transition-transform hover:scale-110"
        >
          🛒
        </Link>
      </div>
    </section>

    {/* ─── SEASONAL OFFERS ─── */}
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold text-[#1a1a1a]">Seasonal Offers</h2>
          <p className="text-sm text-[#888]">Limited-time bundles straight from the tree.</p>
        </div>
        <div className="hidden gap-2 md:flex">
          <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ddd] text-[#888] transition-colors hover:bg-[#eee]">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ddd] text-[#888] transition-colors hover:bg-[#eee]">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {offers.map((offer, i) => (
          <motion.article
            key={offer.id}
            className="group overflow-hidden rounded-2xl border border-[#ece8df] bg-white shadow-sm transition-shadow hover:shadow-md"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={i}
          >
            <div className="relative h-44 overflow-hidden">
              <img src={offer.image} alt={offer.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <span className={`absolute left-3 top-3 rounded-md px-2.5 py-1 text-[10px] font-bold uppercase ${offer.badgeColor}`}>
                {offer.badge}
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-base font-semibold text-[#202020]">{offer.title}</h3>
              <p className="text-xs text-[#888]">{offer.subtitle}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold text-[#1a1a1a]">{offer.price}</span>
                  {offer.oldPrice && <span className="text-xs text-[#aaa] line-through">{offer.oldPrice}</span>}
                </div>
                <button className="rounded-full border border-[#c0392b] px-3 py-1 text-[11px] font-semibold text-[#c0392b] transition-colors hover:bg-[#c0392b] hover:text-white">
                  Claim Offer
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>

    {/* ─── TRENDING VARIETIES ─── */}
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="mb-6 text-center">
        <h2 className="font-display text-3xl font-bold italic text-[#1a1a1a]">Trending Varieties</h2>
        <p className="mt-1 text-sm text-[#888]">
          Discover the unique flavor profiles of our most celebrated mangoes. From the aromatic Sindhri to the honey-sweet Chaunsa.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-[1fr_1fr]">
        {/* Sindhri — tall left card */}
        <motion.div
          className="group relative overflow-hidden rounded-3xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
        >
          <img
            src="https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=900&q=80"
            alt="Sindhri mango"
            className="h-[420px] w-full object-cover brightness-[0.85] transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 text-white">
            <div className="mb-2 flex gap-2">
              <span className="rounded-full bg-[#d4a017]/90 px-3 py-0.5 text-[10px] font-semibold">Honey Sweet</span>
              <span className="rounded-full bg-[#3e7b36]/90 px-3 py-0.5 text-[10px] font-semibold">Aromatic</span>
            </div>
            <h3 className="font-display text-3xl font-bold">Sindhri</h3>
            <p className="mt-1 max-w-xs text-xs text-white/85">
              Known as the "Queen of Mangoes", Sindhri is characterized by its oval shape, smooth yellow skin, and incredibly sweet, fiberless flesh.
            </p>
            <Link to="/products" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-white">
              View Details <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </motion.div>

        {/* Right column — stacked */}
        <div className="grid gap-5">
          {/* Chaunsa */}
          <motion.div
            className="group relative overflow-hidden rounded-3xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
          >
            <img
              src="https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&w=900&q=80"
              alt="Chaunsa mango"
              className="h-[200px] w-full object-cover brightness-[0.85] transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-black/60 to-transparent" />
            <div className="absolute right-5 top-5 text-right text-white">
              <h3 className="font-display text-2xl font-bold">Chaunsa</h3>
              <p className="mt-1 max-w-[200px] text-xs text-white/85">
                A favorite for its heavy fragrance and exceptionally rich, honey-like juice.
              </p>
              <Link to="/products" className="mt-2 inline-block rounded-full bg-[#2d6e2a] px-4 py-1.5 text-[11px] font-semibold text-white">
                Shop Chaunsa
              </Link>
            </div>
          </motion.div>

          {/* Anwar Ratol */}
          <motion.div
            className="group relative overflow-hidden rounded-3xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={2}
          >
            <img
              src="https://images.unsplash.com/photo-1563114773-84221bd62daa?auto=format&fit=crop&w=900&q=80"
              alt="Anwar Ratol mango"
              className="h-[200px] w-full object-cover brightness-[0.85] transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-black/60 to-transparent" />
            <div className="absolute right-5 top-5 text-right text-white">
              <h3 className="font-display text-2xl font-bold">Anwar Ratol</h3>
              <p className="mt-1 max-w-[220px] text-xs text-white/85">
                Small in size but massive in flavor. The connoisseur's choice for peak intensity.
              </p>
              <Link to="/products" className="mt-2 inline-block rounded-full bg-[#2d6e2a] px-4 py-1.5 text-[11px] font-semibold text-white">
                Shop Ratol
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* ─── JOIN THE ORCHARD CIRCLE ─── */}
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <div className="grid items-start gap-10 md:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl font-bold text-[#1a1a1a]">Join the Orchard Circle</h2>
          <p className="mt-2 max-w-md text-sm text-[#777]">
            Receive updates on limited harvest windows, exclusive first-batch varieties, and ripening tips from our master growers.
          </p>
          <div className="mt-6 flex max-w-sm gap-2">
            <input
              type="email"
              placeholder="Email address"
              className="h-11 flex-1 rounded-full border border-[#ddd] bg-white px-5 text-sm outline-none focus:border-[#2d6e2a]"
            />
            <button className="h-11 rounded-full bg-[#c0392b] px-6 text-sm font-semibold text-white transition-transform hover:scale-[1.03]">
              Join
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Truck, label: "Express Delivery", desc: "Freshly picked to your door in 48h" },
            { icon: ShieldCheck, label: "Certified Organic", desc: "Zero synthetic pesticides or wax" },
            { icon: Leaf, label: "Eco-Packaging", desc: "100% biodegradable materials" },
            { icon: SmilePlus, label: "Taste Guarantee", desc: "Love it or your money back" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              className="rounded-2xl border border-[#e5e0d8] bg-white p-5 text-center transition-shadow hover:shadow-md"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
            >
              <item.icon className="mx-auto h-6 w-6 text-[#a77312]" />
              <p className="mt-2 text-sm font-semibold text-[#242424]">{item.label}</p>
              <p className="mt-0.5 text-[11px] text-[#888]">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ─── FOOTER ─── */}
    <footer className="border-t border-[#e2ded6] bg-[#eae7e1] px-4 py-10 md:px-6">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-4">
        <div>
          <h3 className="font-display text-lg font-bold italic text-[#1a1a1a]">Royal Orchard</h3>
          <p className="mt-2 text-xs text-[#777]">
            Nurturing the world's finest mangoes through sustainable farming and heritage techniques since 1984.
          </p>
        </div>
        <div>
          <h4 className="mb-2 text-sm font-semibold text-[#444]">Explore</h4>
          <div className="flex flex-col gap-1.5 text-xs text-[#777]">
            <Link to="/products" className="hover:text-[#1a1a1a]">Wholesale</Link>
            <Link to="/products" className="hover:text-[#1a1a1a]">Shipping Info</Link>
            <Link to="/products" className="hover:text-[#1a1a1a]">Contact Us</Link>
          </div>
        </div>
        <div>
          <h4 className="mb-2 text-sm font-semibold text-[#444]">Legal</h4>
          <div className="flex flex-col gap-1.5 text-xs text-[#777]">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span className="underline">Accessibility</span>
          </div>
        </div>
        <div>
          <h4 className="mb-2 text-sm font-semibold text-[#444]">Social</h4>
          <div className="flex gap-3 text-[#777]">
            <span className="text-lg">𝕏</span>
            <span className="text-lg">📷</span>
            <span className="text-lg">📰</span>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-7xl border-t border-[#d5d1ca] pt-4 text-xs text-[#999]">
        © 2024 Royal Orchard Editorial. Grown with intention.
      </div>
    </footer>
  </div>
);

export default Index;
