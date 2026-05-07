import { useEffect, useState } from "react";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { Product } from "@/data/products";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, refreshUser } = useAuth();
  const { addItem, openCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
        navigate('/auth');
        return;
    }

    const fetchWishlist = async () => {
      try {
        setLoading(true);
        // The backend returns an array of Product objects directly (populated)
        const { data } = await api.get('/users/wishlist'); 
        setWishlistItems(data);
      } catch (error: any) {
        console.error("Failed to fetch wishlist", error);
        toast({
            title: "Error",
            description: "Failed to load wishlist",
            variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user, navigate, toast]);

  const removeFromWishlist = async (productId: string) => {
    try {
        await api.delete(`/users/wishlist/${productId}`);
        setWishlistItems((prev) => prev.filter((item) => (item.id || item._id) !== productId));
        refreshUser();
        toast({ title: "Removed from wishlist" });
    } catch (error) {
        toast({ title: "Error removing item", variant: "destructive" });
    }
  };

  const handleAddToCart = (product: Product) => {
     // Default size/color if not specified (or show modal - keeping simple for now)
     // For a better UX, we should probably redirect to Product Detail or show a quick-add modal.
     // But user asked to restrict add-to-bag.
     
     // Let's redirect to product page for size selection to avoid errors
     navigate(`/product/${product.id || product._id}`);
  };

  if (loading) {
     return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <div className="flex-1 flex items-center justify-center">
                <p>Loading wishlist...</p>
            </div>
            <Footer />
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />
      <CartDrawer />
      
      <main className="container py-16 lg:py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-border/40 pb-12">
            <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-display font-medium tracking-tight italic">
                    My <span className="not-italic font-bold text-primary">Curations</span>
                </h1>
                <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-muted-foreground/60 flex items-center gap-3">
                    <span className="w-8 h-px bg-primary/20" /> YOUR PRIVATE COLLECTION
                </p>
            </div>
            <p className="text-[11px] font-black tracking-[0.2em] text-muted-foreground/40 uppercase">
                {wishlistItems.length} ARCHIVED OBJECTS
            </p>
        </div>

        {wishlistItems.length === 0 ? (
            <div className="text-center py-32 space-y-8 grayscale opacity-30">
              <Heart className="h-16 w-16 mx-auto stroke-1" />
              <div className="space-y-2">
                  <h2 className="text-xl font-display font-medium italic">Your collection is currently void</h2>
                  <p className="text-[10px] font-bold tracking-[0.3em] uppercase">No curations found</p>
              </div>
              <Button size="xl" className="rounded-none bg-primary text-white text-[11px] font-bold tracking-[0.4em] uppercase shadow-2xl px-12" asChild>
                <Link to="/products">START CURATING</Link>
              </Button>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                {wishlistItems.map((product) => (
                    <div key={product.id || product._id} className="group space-y-6">
                         <div className="aspect-[3/4] bg-secondary/10 relative overflow-hidden group-hover:shadow-2xl transition-all duration-700">
                            <img 
                                src={product.image || product.images?.[0] || '/placeholder.svg'} 
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                loading="lazy" 
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                                 <Button 
                                    className="h-14 rounded-none bg-white text-black hover:bg-white/90 text-[10px] font-bold tracking-[0.4em] uppercase translate-y-4 group-hover:translate-y-0 transition-all duration-700" 
                                    onClick={() => handleAddToCart(product)}
                                 >
                                     VIEW PIECE
                                 </Button>
                            </div>
                            <button 
                                onClick={() => removeFromWishlist(product.id || product._id)}
                                className="absolute top-6 right-6 w-10 h-10 bg-white/90 backdrop-blur text-destructive flex items-center justify-center hover:bg-destructive hover:text-white transition-all shadow-2xl"
                            >
                                <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                            </button>
                         </div>
                         
                         <div className="space-y-2">
                            <Link to={`/product/${product.id || product._id}`}>
                                <h3 className="text-[10px] font-black tracking-[0.2em] uppercase truncate">{product.name}</h3>
                            </Link>
                            <p className="text-[9px] font-bold tracking-[0.2em] text-muted-foreground/40 uppercase mb-2">{product.category}</p>
                            <p className="text-xl font-display font-bold text-primary tracking-tighter">
                                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(product.price)}
                            </p>
                         </div>
                    </div>
                ))}
            </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
