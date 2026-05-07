import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, Menu, X, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
// import { ModeToggle } from '@/components/layout/ModeToggle'; // Removed

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { totalItems, toggleCart } = useCart();
  const { user } = useAuth();


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-sm transition-all duration-500">
      {/* Top announcement bar - Refined Maroon */}
      <div className="bg-primary text-primary-foreground py-2 text-center overflow-hidden">
        <div className="flex items-center justify-center gap-4 text-[10px] tracking-[0.2em] font-semibold uppercase">
          <span>Free shipping over ₹5,000</span>
          <span className="hidden md:inline text-secondary">•</span>
          <span className="hidden md:inline">Traditional Excellence Since 1995</span>
          <span className="hidden md:inline text-secondary">•</span>
          <span>Use Code: WELCOME10</span>
        </div>
      </div>

      <div className="w-full px-4 md:px-12">
        {/* Desktop Header */}
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Left: Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-10">
            {[
              { label: 'WOMEN', href: '/products?category=women' },
              { label: 'MEN', href: '/products?category=men' },
              { label: 'NEW ARRIVALS', href: '/products?new=true' },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-xs font-bold tracking-[0.15em] text-foreground hover:text-primary transition-all hover:translate-y-[-1px]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button (Left) */}
          <button
            className="lg:hidden p-2 hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Center: Logo */}
          <Link to="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:static lg:translate-x-0 lg:translate-y-0 text-center group">
            <h1 className="text-2xl md:text-3xl font-display font-black tracking-tighter text-primary group-hover:scale-105 transition-transform">
              BALAJI <span className="text-secondary font-light">TEXTILES</span>
            </h1>
            <p className="text-[8px] tracking-[0.5em] text-muted-foreground uppercase -mt-1 font-semibold">Premium Readymade</p>
          </Link>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 md:gap-6">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:text-primary transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5 stroke-[2]" />
            </button>
            
            <Link to="/wishlist" className="hidden md:block p-2 hover:text-primary transition-colors relative group">
              <Heart className="h-5 w-5 stroke-[2]" />
            </Link>

            <Link to="/account" className="p-2 hover:text-primary transition-colors">
              <User className="h-5 w-5 stroke-[2]" />
            </Link>
            
            <button
              onClick={toggleCart}
              className="p-2 hover:text-primary transition-colors relative group"
            >
              <ShoppingBag className="h-5 w-5 stroke-[2]" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-primary text-primary-foreground text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

        {/* Search overlay */}
        <div
          className={cn(
            "absolute left-0 right-0 top-full bg-background/95 backdrop-blur-md border-b border-border transition-all duration-300 overflow-hidden shadow-sm",
            isSearchOpen ? "h-20 opacity-100" : "h-0 opacity-0"
          )}
        >
          <form onSubmit={handleSearch} className="container h-full flex items-center gap-4">
            <Search className="h-5 w-5 text-muted-foreground stroke-[1.5]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="flex-1 bg-transparent outline-none text-lg font-body placeholder:text-muted-foreground/50 tracking-wide"
              autoFocus={isSearchOpen}
            />
            <Button type="submit" size="sm" variant="outline" className="text-xs uppercase tracking-widest font-bold">
              Search
            </Button>
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              className="p-2 hover:text-primary transition-colors"
            >
              <X className="h-5 w-5 stroke-[1.5]" />
            </button>
          </form>
        </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "md:hidden absolute left-0 right-0 top-full bg-background/98 backdrop-blur-lg border-b border-border transition-all duration-300 overflow-hidden shadow-lg",
          isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="container py-8 flex flex-col gap-4">
          {[
            { label: 'SUMMER COLLECTION', href: '/products?season=summer' },
            { label: 'WINTER COLLECTION', href: '/products?season=winter' },
            { label: 'WOMEN', href: '/products?category=women' },
            { label: 'MEN', href: '/products?category=men' },
            { label: 'VIEW ALL', href: '/products' },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="flex items-center justify-between py-3 border-b border-border/50 text-base font-medium tracking-widest hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
              <ArrowRight className="h-5 w-5 stroke-[1.5] -rotate-45" />
            </Link>
          ))}
          
          <div className="mt-8 flex gap-4 justify-center">
            <Link
              to="/wishlist"
              className="flex items-center gap-2 text-base font-medium py-3 px-6 border border-border rounded-full hover:bg-secondary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Heart className="h-5 w-5 stroke-[1.5]" /> Wishlist
            </Link>
            <Link
              to="/account"
              className="flex items-center gap-2 text-base font-medium py-3 px-6 border border-border rounded-full hover:bg-secondary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <User className="h-5 w-5 stroke-[1.5]" /> Account
            </Link>

            {/* Wholesale link removed */}
          </div>
        </nav>
      </div>
    </header>
  );
}