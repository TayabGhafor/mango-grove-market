import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-foreground/5 border-t border-border mt-16">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🥭</span>
            <span className="font-display text-lg font-bold text-gradient-mango">MangoMart</span>
          </div>
          <p className="text-sm text-muted-foreground">Premium Pakistani mangoes delivered fresh to your doorstep.</p>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3">Shop</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/products" className="hover:text-foreground transition-colors">All Mangoes</Link>
            <Link to="/search" className="hover:text-foreground transition-colors">Search</Link>
            <Link to="/cart" className="hover:text-foreground transition-colors">Cart</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3">Support</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <span>help@mangomart.pk</span>
            <span>+92 300 1234567</span>
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3">Payment Methods</h4>
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <span className="px-2 py-1 rounded bg-muted">COD</span>
            <span className="px-2 py-1 rounded bg-muted">Easypaisa</span>
            <span className="px-2 py-1 rounded bg-muted">JazzCash</span>
            <span className="px-2 py-1 rounded bg-muted">Card</span>
          </div>
        </div>
      </div>
      <div className="border-t border-border mt-8 pt-6 text-center text-xs text-muted-foreground">
        © 2026 MangoMart. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
