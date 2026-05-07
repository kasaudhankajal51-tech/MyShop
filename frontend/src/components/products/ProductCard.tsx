import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
// useShoppingMode import removed
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

interface ProductCardProps {
  product: Product;
  showRank?: number;
}

export function ProductCard({ product, showRank }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem, openCart } = useCart();
  // const { mode, getEffectivePrice } = useShoppingMode(); // Removed usage
  const { toast } = useToast();
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  // Initialize wishlist state from user data
  useEffect(() => {
    if (user && user.wishlist) {
      const productId = product.id || product._id;
      setIsWishlisted(user.wishlist.includes(productId));
    }
  }, [user, product]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
        toast({
            title: "Authentication Required",
            description: "Please login to add items to your bag.",
            variant: "destructive",
        });
        navigate('/auth');
        return;
    }

    const size = product.sizes?.[0] || 'One Size';
    const color = product.colors?.[0]?.name || 'Standard';
    addItem(product, 1, size, color);
    toast({
      title: "Added to bag",
      description: `${product.name} has been added to your shopping bag.`,
    });
    openCart();
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to manage your wishlist.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    try {
      const productId = product.id || product._id;
      
      if (isWishlisted) {
        await api.delete(`/users/wishlist/${productId}`);
        setIsWishlisted(false);
        toast({ 
          title: "Removed from wishlist",
          description: `${product.name} has been removed from your wishlist.`
        });
      } else {
        await api.post(`/users/wishlist/${productId}`);
        setIsWishlisted(true);
        toast({ 
          title: "Added to wishlist",
          description: `${product.name} has been added to your wishlist.`
        });
      }
      
      await refreshUser(); // Sync with user context
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive"
      });
    }
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  // Calculate effective price based on mode
  // const effectivePrice = getEffectivePrice(product); // Removed

  // const isWholesaleMode = mode === 'wholesale'; // Removed
  // const showWholesaleBadge = product.pricingTiers && product.pricingTiers.length > 0; // Removed

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container - More compact aspect ratio if needed, or just cleaner */}
      <div className="relative aspect-[4/5] bg-secondary/20 overflow-hidden mb-3 rounded-md">
        {/* Rank badge - Standard */}
        {showRank && (
          <div className="absolute top-2 left-2 w-7 h-7 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-display font-bold text-sm z-10 shadow-sm">
            {showRank}
          </div>
        )}

        {/* Discount badge - Legible */}
        {discount > 0 && (
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-foreground px-2 py-1 text-xs font-bold z-10 rounded-sm shadow-sm">
            -{discount}%
          </div>
        )}

        {/* Tags - Legible */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.isNewArrival && !showRank && (
            <span className="bg-foreground text-background px-2 py-1 text-xs font-bold uppercase tracking-wider">
              NEW
            </span>
          )}
        </div>

        {/* Image */}
        <div className="w-full h-full bg-secondary/10 transition-transform duration-700 ease-in-out group-hover:scale-110">
           <img
              src={product.image || product.images?.[0] || '/placeholder.svg'}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
           />
        </div>

        {/* Quick actions - Glassmorphism */}
        <div
          className={cn(
            "absolute bottom-2 left-2 right-2 flex gap-2 transition-all duration-300",
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          )}
        >
          <button
            onClick={handleQuickAdd}
            className="flex-1 bg-white/90 backdrop-blur-md text-foreground py-2.5 text-xs font-bold tracking-widest hover:bg-foreground hover:text-background transition-colors flex items-center justify-center gap-2 rounded-sm shadow-sm uppercase"
          >
            <ShoppingBag className="h-4 w-4" />
            Add
          </button>
          <button
            onClick={handleWishlist}
            className={cn(
              "w-10 flex items-center justify-center transition-colors rounded-sm shadow-sm",
              isWishlisted
                ? "bg-accent text-accent-foreground"
                : "bg-white/90 backdrop-blur-md text-foreground hover:bg-secondary"
            )}
          >
            <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
          </button>
        </div>
      </div>

      {/* Product info - Clean & Legible */}
      <div className="space-y-1.5">
        {/* Name */}
        <h3 className="font-medium text-base leading-tight group-hover:text-primary transition-colors line-clamp-1">
          {product.name}
        </h3>

        {/* Category - Subtle */}
        <p className="text-xs text-muted-foreground uppercase tracking-wider">
           {product.category}
        </p>

        {/* Price & Rating Row */}
        <div className="flex items-center justify-between pt-1">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-base">
                  {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through decoration-muted-foreground/50">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          
          {/* Colors Preview - Tiny dots */}
           <div className="flex -space-x-1">
            {(product.colors || []).slice(0, 3).map((color) => (
              <div
                key={color.name}
                className="w-2.5 h-2.5 rounded-full border border-white ring-1 ring-border"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
             {(product.colors || []).length > 3 && (
                <div className="w-2.5 h-2.5 rounded-full bg-secondary border border-white ring-1 ring-border flex items-center justify-center">
                    <span className="text-[6px] text-muted-foreground">+</span>
                </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
