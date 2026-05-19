import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Heart, ShoppingBag, Sparkles, Star } from 'lucide-react';
import { DbProduct } from '@/hooks/useProducts';
import { useCart } from '@/context/CartContext';
// useShoppingMode import removed
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

interface DynamicProductCardProps {
  product: DbProduct;
  showRank?: number;
  variant?: 'default' | 'compact' | 'featured';
}

export function DynamicProductCard({ product, showRank, variant = 'default' }: DynamicProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const { addItem, openCart } = useCart();
  const { toast } = useToast();
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  // const { isWholesaleActive } = useShoppingMode(); // Removed usage

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
    
    // Simplification for Mongoose structure
    const cartProduct = {
        id: product._id,
        name: product.name,
        price: product.price,
        images: product.images || [product.image],
    };

    addItem(
       product as any, 
       1, 
       product.sizes?.[0] || 'Free',
       (product.colors?.[0] as any)?.name || product.colors?.[0] || 'Default'
    );
    
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
      const productId = product._id;
      
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


  // Handle Mongoose structure where image is a string and images is array of strings
  const getImageUrl = () => {
      if (product.image) return product.image;
      if (product.images && product.images.length > 0) {
          return product.images[0];
      }
      return null;
  };

  const imageUrl = getImageUrl();
  
  // Use _id for consistency with MongoDB/DbProduct
  const productId = product._id; // _id is definitely in DbProduct now

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
        {/* Image container - Editorial Look */}
        <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-secondary/5 group-hover:shadow-2xl transition-all duration-700 ease-out">
          
          {discount > 0 && (
            <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1.5 text-[10px] font-bold z-10 uppercase tracking-[0.1em] shadow-lg">
              -{discount}%
            </div>
          )}

          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {product.isNewArrival && (
               <span className="bg-white/95 backdrop-blur-md text-foreground px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] shadow-sm border border-border/50">
                NEW
              </span>
            )}
            {product.isFeatured && !product.isNewArrival && (
               <span className="bg-secondary text-secondary-foreground px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] shadow-sm">
                EXCLUSIVE
              </span>
            )}
          </div>

          {/* Image */}
          {imageUrl && !imageError ? (
            <img 
              src={imageUrl} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-[3000ms] ease-out group-hover:scale-110"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-secondary/10 flex items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-muted-foreground/20" />
            </div>
          )}

          {/* Luxury Overlay on Hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />

          {/* Quick Actions - Sophisticated Slide Up */}
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 p-4 transition-all duration-500 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100",
            )}
          >
            <div className="flex gap-2">
                <button
                onClick={handleQuickAdd}
                className="flex-1 bg-white text-primary py-4 text-[10px] font-bold tracking-[0.3em] hover:bg-primary hover:text-white transition-all duration-500 shadow-xl uppercase border-none"
                >
                Quick Add
                </button>
                <button
                onClick={handleWishlist}
                className={cn(
                    "w-14 flex items-center justify-center transition-all duration-500 shadow-xl",
                    isWishlisted
                    ? "bg-primary text-white"
                    : "bg-white text-primary hover:bg-primary hover:text-white"
                )}
                >
                <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
                </button>
            </div>
          </div>
        </div>

      {/* Product info - Editorial Detail */}
      <div className="space-y-2 px-1">
        <div className="flex justify-between items-start gap-4">
            <div className="space-y-1 flex-1">
                <p className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase font-bold">
                    {product.category || 'Collection'}
                </p>
                <h3 className="font-medium text-sm md:text-base leading-tight group-hover:text-primary transition-colors line-clamp-1">
                    {product.name}
                </h3>
            </div>
            
            <div className="text-right">
                <div className="flex flex-col items-end">
                    <span className="font-bold text-sm md:text-base text-foreground">
                        {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                        <span className="text-[10px] text-muted-foreground line-through decoration-muted-foreground/50">
                            {formatPrice(product.originalPrice)}
                        </span>
                    )}
                </div>
            </div>
        </div>
        
        {/* Colors - Minimalist dots */}
        {(product.colors || []).length > 0 && (
            <div className="flex gap-2 pt-2">
                {(product.colors || []).slice(0, 4).map((color) => (
                    <div
                        key={color.name}
                        className="w-3 h-3 rounded-full border border-border group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                    />
                ))}
            </div>
        )}
      </div>
    </Link>
  );
}