import { Star, Truck, ShieldCheck, Gift } from "lucide-react";
import { Link } from "react-router-dom";

const offers = [
  {
    id: "offer-1",
    title: "Sindhri Orchard Box",
    subtitle: "5kg hand-picked premium lot",
    price: "$45.00",
    badge: "Best Deal",
    image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "offer-2",
    title: "The Golden Ratol Dozen",
    subtitle: "Curated for peak sweetness",
    price: "$32.00",
    badge: "Hot Harvest",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "offer-3",
    title: "Monthly Harvest Club",
    subtitle: "New batch every week",
    price: "$75.00",
    badge: "Member Pick",
    image: "https://images.unsplash.com/photo-1623934199716-dc28818a6ec7?auto=format&fit=crop&w=800&q=80",
  },
];

const Index = () => (
  <div className="min-h-screen bg-[#f4f2ef] pb-14">
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <section className="grid items-center gap-8 md:grid-cols-2">
        <div>
          <span className="rounded-full bg-[#e6f4d3] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#3e7b36]">
            Peak Harvest Season
          </span>
          <h1 className="mt-5 font-display text-5xl font-bold leading-[1.02] text-[#1d1d1d] md:text-6xl">
            Fresh Organic Mangoes from the Farm to Your Doorstep.
          </h1>
          <p className="mt-5 max-w-xl text-base text-[#6f6f6f]">
            Experience the golden nectar of tropical fruit with naturally ripened picks from trusted orchards.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Link to="/products" className="rounded-full bg-gradient-to-r from-[#8c5b0f] to-[#efc61b] px-7 py-3 text-sm font-semibold text-white">
              Shop the Harvest
            </Link>
            <Link to="/products" className="text-sm font-semibold text-[#2f2f2f] underline underline-offset-4">
              Our Orchard
            </Link>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[520px]">
          <img
            src="https://images.unsplash.com/photo-1605027990121-cbae9f938639?auto=format&fit=crop&w=1100&q=80"
            alt="Fresh mango close up"
            className="h-[410px] w-full rounded-[34px] object-cover shadow-xl"
          />
          <div className="absolute -bottom-5 left-5 rounded-2xl border border-[#ece7de] bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
            <div className="mb-1 flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star key={idx} className="h-3.5 w-3.5 fill-[#d4a01f] text-[#d4a01f]" />
              ))}
            </div>
            <p className="text-xs text-[#5f5f5f]">4.9/5 from orchard families</p>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold text-[#222]">Seasonal Offers</h2>
            <p className="text-sm text-[#777]">Limited-time drops from this week&apos;s harvest.</p>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {offers.map((offer) => (
            <article key={offer.id} className="overflow-hidden rounded-3xl border border-[#ece8df] bg-white shadow-sm">
              <img src={offer.image} alt={offer.title} className="h-40 w-full object-cover" />
              <div className="space-y-2 p-4">
                <span className="rounded-full bg-[#e7f4cf] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.09em] text-[#4f8a2f]">
                  {offer.badge}
                </span>
                <h3 className="text-xl font-semibold text-[#202020]">{offer.title}</h3>
                <p className="text-sm text-[#666]">{offer.subtitle}</p>
                <p className="pt-1 text-xl font-bold text-[#1f1f1f]">{offer.price}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-[30px] bg-[#e9f5ea] px-6 py-8 md:px-9">
        <h3 className="font-display text-3xl font-bold text-[#1e1e1e]">Join the Orchard Circle</h3>
        <p className="mt-2 max-w-2xl text-sm text-[#666]">Receive updates on limited harvest releases, orchard stories, and member-only savings.</p>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-4">
            <Truck className="h-5 w-5 text-[#a77312]" />
            <p className="mt-2 text-sm font-semibold text-[#242424]">Express Delivery</p>
          </div>
          <div className="rounded-2xl bg-white p-4">
            <ShieldCheck className="h-5 w-5 text-[#a77312]" />
            <p className="mt-2 text-sm font-semibold text-[#242424]">Certified Organic</p>
          </div>
          <div className="rounded-2xl bg-white p-4">
            <Gift className="h-5 w-5 text-[#a77312]" />
            <p className="mt-2 text-sm font-semibold text-[#242424]">Member Gift Boxes</p>
          </div>
        </div>
      </section>
    </div>
  </div>
);

export default Index;
