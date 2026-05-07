import { useState, useEffect } from 'react';
import { Plus, X, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

interface Product {
    _id: string;
    name: string;
    price: number;
    images: string[];
    slug: string;
    category: string;
}

interface Hotspot {
    productId: Product;
    x: number;
    y: number;
}

interface Look {
    _id: string;
    title: string;
    description: string;
    image: string;
    hotspots: Hotspot[];
}

export function Lookbook() {
  const [looks, setLooks] = useState<Look[]>([]);
  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLooks();
  }, []);

  const fetchLooks = async () => {
    try {
        const { data } = await api.get('/lookbook');
        if (data && data.length > 0) {
             setLooks(data);
        }
    } catch (error) {
        console.error("Failed to fetch lookbooks", error);
    } finally {
        setLoading(false);
    }
  };

  if (loading) return null;
  if (looks.length === 0) return null;

  const currentLook = looks[activeLookIndex];

  return (
    <section className="py-32 relative overflow-hidden bg-background">
      {/* Editorial Decorative Background */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-secondary/5 skew-x-12 translate-x-20" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[120px]" />
      
      <div className="container relative z-10">
        {/* Header - Center Aligned Editorial */}
        <div className="flex flex-col items-center text-center mb-24 max-w-3xl mx-auto">
            <h2 className="text-[10px] font-bold tracking-[0.5em] uppercase text-secondary mb-6 italic">Visual Storytelling</h2>
            <h3 className="text-4xl md:text-7xl font-display font-medium tracking-tighter leading-none mb-8">SHOP THE <span className="text-primary not-italic font-bold">LOOK</span></h3>
            <div className="h-px w-20 bg-primary/20 mb-8" />
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground opacity-80 leading-relaxed">
                Hand-picked ensembles curated by our creative directors for the quintessential autumn wardrobe.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
          {/* Interactive Image Area - Larger & More Impactful */}
          <div className="lg:col-span-8 relative group">
            <div className="relative aspect-[4/5] bg-secondary/10 overflow-hidden shadow-2xl">
                <img 
                    src={currentLook.image} 
                    alt={currentLook.title} 
                    className="w-full h-full object-cover transition-transform duration-[4s] ease-out group-hover:scale-110"
                />
                
                {/* Cinema Overlay */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-700" />

                {/* Hotspots - Refined Minimalist dots */}
                {currentLook.hotspots.map((hotspot, idx) => {
                    const pId = hotspot.productId._id;
                    const isActive = activeHotspot === pId;
                    
                    return (
                        <div
                            key={idx}
                            className="absolute z-20"
                            style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                        >
                            <div className="relative group/hotspot">
                                <button
                                    onClick={() => setActiveHotspot(isActive ? null : pId)}
                                    className={cn(
                                        "relative flex items-center justify-center w-12 h-12 rounded-full shadow-2xl transition-all duration-700 backdrop-blur-md",
                                        isActive 
                                            ? "bg-primary text-white scale-110 shadow-primary/20" 
                                            : "bg-white/80 text-primary hover:bg-primary hover:text-white"
                                    )}
                                >
                                    <Plus className={cn("h-5 w-5 transition-transform duration-700", isActive && "rotate-45")} />
                                </button>

                                {/* Sophisticated Product Card Overlay */}
                                <div className={cn(
                                    "absolute top-1/2 left-full ml-8 w-80 bg-white/95 backdrop-blur-2xl shadow-[0_40px_100px_rgba(0,0,0,0.15)] p-6 z-50 transition-all duration-700 ease-out origin-left border border-white/40",
                                    isActive 
                                        ? "opacity-100 scale-100 translate-x-0 visible" 
                                        : "opacity-0 scale-90 -translate-x-8 invisible pointer-events-none"
                                )}>
                                    <div className="flex gap-6">
                                        <div className="w-24 h-32 bg-secondary/5 overflow-hidden flex-shrink-0">
                                            <img src={hotspot.productId.images?.[0]} alt={hotspot.productId.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <div className="text-[9px] font-black tracking-[0.3em] text-secondary uppercase mb-2">Essential</div>
                                                <h4 className="text-sm font-bold leading-tight text-foreground line-clamp-2 italic">{hotspot.productId.name}</h4>
                                                <p className="text-base font-bold text-primary mt-3 tracking-tighter">₹{hotspot.productId.price}</p>
                                            </div>
                                            
                                            <Link to={`/product/${hotspot.productId.slug || hotspot.productId._id}`} className="block mt-4">
                                                <span className="inline-block text-[10px] font-bold uppercase tracking-[0.3em] text-foreground hover:text-primary transition-all border-b border-border/60 pb-1">
                                                    Shop Piece
                                                </span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
          </div>

          {/* Details Sidebar - High Density Luxury */}
          <div className="lg:col-span-4 space-y-12">
             <div className="space-y-6">
                <h3 className="text-3xl md:text-5xl font-display font-medium text-foreground leading-[1.1] tracking-tight">{currentLook.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium opacity-80">{currentLook.description}</p>
             </div>

             <div className="space-y-6 pt-10 border-t border-border/40">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary">CURATED ELEMENTS</h4>
                <div className="space-y-4">
                    {currentLook.hotspots.map((hotspot, idx) => (
                         <div 
                            key={idx} 
                            className={cn(
                                "flex items-center gap-6 p-4 transition-all duration-500 cursor-pointer group border-b border-transparent",
                                activeHotspot === hotspot.productId._id ? "bg-primary/5 border-primary/20 shadow-sm" : "hover:bg-secondary/5"
                            )}
                            onClick={() => setActiveHotspot(activeHotspot === hotspot.productId._id ? null : hotspot.productId._id)}
                         >
                            <div className="w-16 h-20 bg-secondary/5 overflow-hidden flex-shrink-0 group-hover:shadow-xl transition-shadow duration-500">
                                <img src={hotspot.productId.images?.[0]} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={cn(
                                    "text-xs font-bold uppercase tracking-widest transition-colors mb-1",
                                    activeHotspot === hotspot.productId._id ? "text-primary" : "text-foreground group-hover:text-primary"
                                )}>
                                    {hotspot.productId.name}
                                </p>
                                <p className="text-sm font-bold text-muted-foreground/60 tracking-tighter">₹{hotspot.productId.price}</p>
                            </div>
                         </div>
                    ))}
                </div>
             </div>

             {/* Navigation Dots */}
             <div className="flex gap-4 pt-4">
                  {looks.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            setActiveLookIndex(idx);
                            setActiveHotspot(null);
                        }}
                        className={cn(
                            "w-2 h-2 rounded-full transition-all duration-700",
                            idx === activeLookIndex ? "bg-primary w-12" : "bg-border/60 hover:bg-primary/40"
                        )}
                    />
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
