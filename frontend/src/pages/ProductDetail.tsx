import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Heart,
  Minus,
  Plus,
  Truck,
  RotateCcw,
  Shield,
  ChevronRight,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import { ReviewForm } from '@/components/products/ReviewForm';
import { ReviewList } from '@/components/products/ReviewList';
// WholesalePricingTable import removed
import { useShoppingMode } from '@/context/ShoppingModeContext';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  
  const { addItem, openCart } = useCart();
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  // const { isWholesaleActive } = useShoppingMode(); // Removed usage

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'reviews'>('description');
  const [activeImage, setActiveImage] = useState('');

  // Wholesale redirect removed

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${id}`);
        // Map _id to id if id is missing (common with Mongo)
        if (data && !data.id && data._id) {
            data.id = data._id;
        }
        setProduct(data);

        // Fetch recommendations (Customers Also Bought)
        try {
            const { data: recommendations } = await api.get(`/products/${id}/recommendations`);
            // Map _id to id for recommendations
            const mappedRecommendations = recommendations.map((p: any) => ({
                ...p,
                id: p.id || p._id
            }));
            setRelatedProducts(mappedRecommendations);
        } catch (recError) {
            console.error('Error fetching recommendations:', recError);
        }

        // Record View (History)
        if (user) {
            try {
                // Fire and forget
                api.post('/users/history', { productId: data.id || data._id });
            } catch (err) {
                 // Ignore history recording errors
            }
        }
        
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        } else {
          setSelectedSize('One Size');
        }
        
        // Set initial active image
        setActiveImage(data.image || '');

        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0].name);
        } else {
          setSelectedColor('Standard');
        }

        // Check if wishlisted
        if (user && user.wishlist) {
            setIsWishlisted(user.wishlist.includes(data.id || data._id));
        }

      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
            title: "Error",
            description: "Failed to load product details.",
            variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, toast, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container flex items-center justify-center">
            <div>Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-display mb-4">Product not found</h1>
          <Link to="/products" className="text-accent hover:underline">
            Back to products
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!user) {
        toast({
            title: "Authentication Required",
            description: "Please login to add items to your bag.",
            variant: "destructive",
        });
        navigate('/auth');
        return;
    }

    if (!selectedSize) {
      toast({
        title: "Please select a size",
        variant: "destructive",
      });
      return;
    }
    if (!selectedColor) {
      toast({
        title: "Please select a color",
        variant: "destructive",
      });
      return;
    }

    addItem(product, quantity, selectedSize, selectedColor);
    toast({
      title: "Added to bag",
      description: `${product.name} has been added to your shopping bag.`,
    });
    openCart();
  };

  const handleWishlistToggle = async () => {
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
            toast({ title: "Removed from Wishlist" });
        } else {
            await api.post(`/users/wishlist/${productId}`);
            setIsWishlisted(true);
            toast({ title: "Added to Wishlist" });
        }
        await refreshUser(); // Update global user state (wishlist)
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />

      <main className="pb-24">
        {/* Breadcrumb - Refined */}
        <div className="container py-8">
          <nav className="flex items-center gap-3 text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground/60">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="text-border">/</span>
            <Link to="/products" className="hover:text-primary transition-colors">Collection</Link>
            <span className="text-border">/</span>
            <span className="text-foreground/80">{product.name}</span>
          </nav>
        </div>

        {/* Product section */}
        <section className="container">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Images - Editorial Layout */}
            <div className="lg:col-span-7 space-y-6">
              <div className="aspect-[4/5] bg-secondary/5 relative overflow-hidden group">
                {discount > 0 && (
                  <div className="absolute top-6 right-6 bg-primary text-primary-foreground px-4 py-2 text-xs font-bold z-10 uppercase tracking-widest shadow-xl">
                    -{discount}% OFF
                  </div>
                )}
                <img
                  src={activeImage || product.image || product.images?.[0] || '/placeholder.svg'}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-[3000ms] ease-out group-hover:scale-110"
                />
              </div>
              
              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                 <div 
                    className={cn(
                        "aspect-[3/4] bg-secondary/10 cursor-pointer overflow-hidden transition-all duration-500",
                        (activeImage === product.image || (!activeImage && !product.images?.length)) ? "ring-1 ring-primary p-1" : "opacity-60 hover:opacity-100"
                    )}
                    onClick={() => setActiveImage(product.image || '')}
                 >
                    <img
                        src={product.image || '/placeholder.svg'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                 </div>
                {product.images && product.images.map((img, i) => (
                    <div 
                        key={i} 
                        className={cn(
                            "aspect-[3/4] bg-secondary/10 cursor-pointer overflow-hidden transition-all duration-500",
                            activeImage === img ? "ring-1 ring-primary p-1" : "opacity-60 hover:opacity-100"
                        )}
                        onClick={() => setActiveImage(img)}
                    >
                      <img
                        src={img}
                        alt={`${product.name} view ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                ))}
              </div>
            </div>

            {/* Product info - High End Sidebar */}
            <div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start space-y-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-secondary italic">
                        {product.season} Edition
                    </span>
                    <div className="h-px w-10 bg-border/40" />
                    <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-muted-foreground">
                        {product.category}
                    </span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-display font-medium tracking-tight leading-[1.1]">{product.name}</h1>
                
                <div className="flex items-center gap-6 pt-2">
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={cn(
                                    'h-3 w-3',
                                    i < Math.floor(product.rating)
                                        ? 'text-primary fill-primary'
                                        : 'text-border'
                                )}
                            />
                        ))}
                    </div>
                    <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                        {product.numReviews || 0} Verifed Reviews
                    </span>
                </div>
              </div>

              <div className="space-y-2">
                  <div className="flex items-baseline gap-4">
                      <span className="text-3xl font-display font-bold text-primary">{formatPrice(product.price)}</span>
                      {product.originalPrice && (
                        <span className="text-lg text-muted-foreground/60 line-through font-light">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                  </div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Inclusive of all taxes</p>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed font-medium">{product.description}</p>

              {/* Color selection - Luxury Swatches */}
              <div className="space-y-4 pt-4 border-t border-border/40">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase">
                  Select Shade: <span className="text-primary italic ml-2">{selectedColor}</span>
                </p>
                <div className="flex gap-4">
                  {(product.colors || []).map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={cn(
                        'w-8 h-8 rounded-full ring-offset-4 ring-offset-background transition-all duration-500',
                        selectedColor === color.name
                          ? 'ring-1 ring-primary scale-125'
                          : 'hover:scale-110'
                      )}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* Size selection - Minimalist Grid */}
              <div className="space-y-4 pt-4 border-t border-border/40">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase">
                    Select Size: <span className="text-primary italic ml-2">{selectedSize}</span>
                  </p>
                  <button className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors border-b border-border/60">
                    Size guide
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {(product.sizes || []).map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        'h-14 border text-[11px] font-bold tracking-widest transition-all duration-500 uppercase',
                        selectedSize === size
                          ? 'border-primary bg-primary text-white shadow-xl'
                          : 'border-border/60 hover:border-primary'
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions - Premium Buttons */}
              <div className="flex flex-col gap-4 pt-6">
                <div className="flex gap-4">
                    <div className="flex items-center border border-border/60 h-16 px-4 bg-secondary/5">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:text-primary transition-colors">
                            <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-6 text-sm font-bold w-12 text-center">{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:text-primary transition-colors">
                            <Plus className="h-3 w-3" />
                        </button>
                    </div>
                    
                    <Button size="xl" className="flex-1 h-16 bg-primary hover:bg-primary/90 text-white rounded-none text-xs font-bold tracking-[0.3em] uppercase transition-all shadow-2xl" onClick={handleAddToCart}>
                        Add to Bag
                    </Button>
                </div>
                
                <button
                  onClick={handleWishlistToggle}
                  className={cn(
                    'w-full h-14 border text-[10px] font-bold tracking-[0.3em] uppercase transition-all flex items-center justify-center gap-3',
                    isWishlisted ? 'border-primary bg-primary/5 text-primary' : 'border-border/60 hover:border-primary'
                  )}
                >
                  <Heart className={cn('h-4 w-4', isWishlisted && 'fill-current')} />
                  {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                </button>
              </div>

              {/* Trust & Features - Refined */}
              <div className="grid grid-cols-3 gap-8 py-10 border-y border-border/40">
                <div className="text-center space-y-3">
                  <Truck className="h-5 w-5 mx-auto text-secondary" />
                  <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-muted-foreground">Free Shipping</p>
                </div>
                <div className="text-center space-y-3">
                  <RotateCcw className="h-5 w-5 mx-auto text-secondary" />
                  <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-muted-foreground">15 Day Return</p>
                </div>
                <div className="text-center space-y-3">
                  <Shield className="h-5 w-5 mx-auto text-secondary" />
                  <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-muted-foreground">Authentic</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Details Tabs - Luxury Layout */}
        <section className="mt-24 border-t border-border/40 pt-24 bg-secondary/10">
          <div className="container max-w-5xl">
            <div className="flex flex-col md:flex-row gap-16">
                <div className="md:w-1/3 space-y-6">
                    <h3 className="text-xs font-bold tracking-[0.4em] uppercase text-secondary">The Craftsmanship</h3>
                    <h4 className="text-3xl font-display italic">Exquisite Details & Material</h4>
                    <div className="h-px w-20 bg-primary/40" />
                </div>
                
                <div className="md:w-2/3 space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Description</span>
                            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
                        </div>
                        <div className="space-y-4">
                            <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Material & Care</span>
                            <ul className="text-sm text-muted-foreground space-y-3 font-medium">
                                <li className="flex justify-between border-b border-border/40 pb-2">
                                    <span>Main Fabric</span>
                                    <span className="text-foreground">{product.material || 'Premium Quality'}</span>
                                </li>
                                <li className="flex justify-between border-b border-border/40 pb-2">
                                    <span>Season</span>
                                    <span className="text-foreground capitalize">{product.season}</span>
                                </li>
                                <li className="flex justify-between border-b border-border/40 pb-2">
                                    <span>Wash Care</span>
                                    <span className="text-foreground italic">Professional Dry Clean Recommended</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </section>

        {/* Related products - Editorial Grid */}
        {relatedProducts.length > 0 && (
          <section className="container mt-32">
            <div className="flex flex-col items-center mb-16 text-center">
                <h2 className="text-[10px] font-bold tracking-[0.5em] uppercase text-secondary mb-4 italic">You May Also Like</h2>
                <h3 className="text-3xl md:text-5xl font-display font-medium tracking-tight">SIMILAR PIECES</h3>
                <div className="h-px w-20 bg-primary/20 mt-8" />
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
              {relatedProducts.slice(0, 4).map((p) => (
                <div key={p.id || p._id} className="animate-fade-in">
                    <ProductCard key={p.id} product={p as any} />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
