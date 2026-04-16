import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Search, Menu, X, User, LogOut } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const Navbar = () => {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Shop" },
    { to: "/search", label: "Orchards" },
    { to: "/orders", label: "Our Story" },
  ];

  const handleLogoClick = () => {
    window.location.assign("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-[#e9e5dd] bg-[#f4f2ef]/95 backdrop-blur">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 md:px-6">
        <button type="button" onClick={handleLogoClick} className="flex items-center gap-2 text-left">
          <span className="font-display text-[1.55rem] font-bold text-[#1f1f1f]">Mango Grove</span>
        </button>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-[15px] font-medium transition-colors ${
                location.pathname === link.to ? "text-[#191919] underline underline-offset-8" : "text-[#6c6c6c] hover:text-[#1f1f1f]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <div className="flex items-center gap-2 rounded-full bg-[#efeeea] px-4 py-2 text-[#8b8b8b]">
            <Search className="h-4 w-4" />
            <span className="text-sm">Search our harvest...</span>
          </div>
          <Link to="/cart" className="relative rounded-full p-2 text-[#6b5a40] transition-colors hover:bg-[#ebe8e2]">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#d39a17] text-[10px] font-bold text-white">
                {itemCount}
              </span>
            ) : null}
          </Link>
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/profile" className="rounded-full bg-[#e9e7e2] p-2 text-[#5f5f5f] transition-colors hover:bg-[#ddd8cf]">
                <User className="h-4 w-4" />
              </Link>
              <button type="button" onClick={() => void logout()} className="rounded-full bg-[#f7e2b1] p-2 text-[#6c4c0a] transition-colors hover:bg-[#f3d694]">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="rounded-full bg-[#201f1c] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-black">
              Sign In
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Link to="/cart" className="relative rounded-full p-2">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#d39a17] text-[10px] font-bold text-white">
                {itemCount}
              </span>
            ) : null}
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-full p-2">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-[#e9e5dd] bg-[#f4f2ef] md:hidden"
          >
            <div className="flex flex-col gap-3 p-4">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className="py-2 text-sm font-medium text-[#404040]">
                  {link.label}
                </Link>
              ))}
              {user ? <Link to="/profile" onClick={() => setMobileOpen(false)} className="py-2 text-sm font-medium text-[#404040]">Profile</Link> : null}
              {user ? (
                <button
                  type="button"
                  onClick={() => { setMobileOpen(false); void logout(); }}
                  className="py-2 text-left text-sm font-medium text-[#404040]"
                >
                  Sign out
                </button>
              ) : (
                <Link to="/login" onClick={() => setMobileOpen(false)} className="py-2 text-sm font-medium text-[#404040]">Sign in</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
