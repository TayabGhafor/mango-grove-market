import { Link } from "react-router-dom";
import { ShoppingCart, Search, Menu, X, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[hsl(40,20%,95%)]/80 backdrop-blur-lg border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[hsl(85,30%,30%)] flex items-center justify-center">
            <span className="text-white text-sm font-bold">R</span>
          </div>
          <span className="font-display text-xl font-bold text-gray-900">RoyalOrchard.</span>
        </Link>

        {/* Desktop Nav - Center */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/products" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Mangoes ▾
          </Link>
          <Link to="/search" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Varieties ▾
          </Link>
          <Link to="/orders" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            About ▾
          </Link>
          <Link to="/search" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Reviews
          </Link>
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/search" className="p-2 rounded-full hover:bg-gray-200/50 transition-colors">
            <Search className="w-4 h-4 text-gray-500" />
          </Link>
          <Link to="/cart" className="relative p-2 rounded-full hover:bg-gray-200/50 transition-colors">
            <ShoppingCart className="w-4 h-4 text-gray-500" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </Link>
          {user ? (
            <button
              type="button"
              onClick={() => void logout()}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Sign out
            </button>
          ) : (
            <Link
              to="/login"
              className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center hover:bg-gray-800 transition-colors"
            >
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>
          )}
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <Link to="/cart" className="relative p-2">
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
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
            className="md:hidden border-t border-gray-200 overflow-hidden bg-[hsl(40,20%,95%)]"
          >
            <div className="flex flex-col p-4 gap-3">
              <Link to="/" onClick={() => setMobileOpen(false)} className="py-2 text-sm font-medium">Home</Link>
              <Link to="/products" onClick={() => setMobileOpen(false)} className="py-2 text-sm font-medium">Mangoes</Link>
              <Link to="/search" onClick={() => setMobileOpen(false)} className="py-2 text-sm font-medium">Search</Link>
              <Link to="/orders" onClick={() => setMobileOpen(false)} className="py-2 text-sm font-medium">My Orders</Link>
              {user && <Link to="/profile" onClick={() => setMobileOpen(false)} className="py-2 text-sm font-medium">Profile</Link>}
              {user ? (
                <button
                  type="button"
                  onClick={() => { setMobileOpen(false); void logout(); }}
                  className="py-2 text-sm font-medium text-left"
                >
                  Sign out
                </button>
              ) : (
                <Link to="/login" onClick={() => setMobileOpen(false)} className="py-2 text-sm font-medium">Sign in</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
