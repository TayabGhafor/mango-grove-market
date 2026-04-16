import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-[#e2ded6] bg-[#eae7e1] px-4 py-10 md:px-6">
    <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-4">
      <div>
        <h3 className="font-display text-lg font-bold uppercase tracking-wider text-[#8b4513]">Mango Grove</h3>
        <p className="mt-2 text-xs text-[#777]">
          Crafting the world's finest tropical experience through sustainable farming and artisanal selection.
        </p>
      </div>
      <div className="md:col-span-2">
        <div className="flex flex-wrap gap-6 text-xs text-[#777]">
          <span>Privacy Policy</span>
          <span>Shipping Info</span>
          <span>Sustainability Report</span>
          <Link to="/products" className="hover:text-[#1a1a1a]">Contact Us</Link>
          <Link to="/products" className="hover:text-[#1a1a1a]">Wholesale</Link>
        </div>
      </div>
      <div className="text-right text-xs text-[#999]">
        <p>© 2024 Mango Grove Editorial.</p>
        <p className="italic">Sustainable. Organic. Artisanal.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
