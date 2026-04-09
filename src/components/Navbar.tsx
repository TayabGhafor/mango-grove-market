import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Search, Menu, X, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🥭</span>
          <span className="font-display text-xl font-bold text-gradient-mango">MangoMart</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">Home</Link>
          <Link to="/products" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">Shop</Link>
          <Link to="/orders" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">My Orders</Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/search" className="p-2 rounded-full hover:bg-muted transition-colors">
            <Search className="w-5 h-5 text-muted-foreground" />
          </Link>
          <Link to="/cart" className="relative p-2 rounded-full hover:bg-muted transition-colors">
            <ShoppingCart className="w-5 h-5 text-muted-foreground" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </Link>
          <Link to="/admin" className="p-2 rounded-full hover:bg-muted transition-colors">
            <User className="w-5 h-5 text-muted-foreground" />
          </Link>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <Link to="/cart" className="relative p-2">
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border overflow-hidden bg-background"
          >
            <div className="flex flex-col p-4 gap-3">
              <Link to="/" onClick={() => setMobileOpen(false)} className="py-2 text-sm font-medium">Home</Link>
              <Link to="/products" onClick={() => setMobileOpen(false)} className="py-2 text-sm font-medium">Shop</Link>
              <Link to="/search" onClick={() => setMobileOpen(false)} className="py-2 text-sm font-medium">Search</Link>
              <Link to="/orders" onClick={() => setMobileOpen(false)} className="py-2 text-sm font-medium">My Orders</Link>
              <Link to="/admin" onClick={() => setMobileOpen(false)} className="py-2 text-sm font-medium">Admin Panel</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
