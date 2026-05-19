import { useState, useEffect } from 'react';
import { Clock, Zap, Timer, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { DynamicProductCard } from '@/components/products/DynamicProductCard';
import { DbProduct } from '@/hooks/useProducts';

export function FlashDeals() {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    fetchDeals();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
          if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) {
              hours = 23;
            }
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchDeals = async () => {
    try {
      const { data } = await api.get('/flashdeals');
      const activeDeals = (data || []).filter((d: any) => d.isActive);
      
      const mappedDeals = activeDeals.map((d: any) => ({
        _id: d._id,
        name: d.title,
        description: d.subtitle || '',
        price: d.discountPrice || 0,
        originalPrice: d.originalPrice || 0,
        image: d.image,
        images: [d.image],
        slug: d.link ? d.link.replace('/product/', '').replace(/^\//, '') : d._id,
        category: 'Flash Deal',
        rating: 5,
        numReviews: 12,
        isFeatured: true,
        sizes: ['One Size'],
        colors: [],
      }));
      
      setProducts(mappedDeals);
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (num: number) => num.toString().padStart(2, '0');

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
        <div className="container">
          <div className="animate-pulse h-64 bg-muted rounded-xl" />
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-12 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjIiIGZpbGw9IiNmZjY2N2YiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9nPjwvc3ZnPg==')] opacity-50" />
        <div className="container relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center animate-pulse">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                  Flash Deals
                </h2>
                <p className="text-muted-foreground text-sm">Limited time offers</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-6 py-3 rounded-full border border-border">
              <Clock className="h-5 w-5 text-primary" />
              <span className="text-foreground font-semibold">Ends in:</span>
              <div className="flex gap-1">
                {[
                  { value: formatTime(timeLeft.hours), label: 'H' },
                  { value: formatTime(timeLeft.minutes), label: 'M' },
                  { value: formatTime(timeLeft.seconds), label: 'S' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center">
                    <span className="bg-primary text-primary-foreground px-2 py-1 rounded font-mono font-bold">
                      {item.value}
                    </span>
                    {i < 2 && <span className="text-primary mx-1 font-bold">:</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="text-center py-12 text-muted-foreground">
            <Zap className="h-16 w-16 mx-auto mb-4 text-primary/30" />
            <p className="text-lg">Flash deals coming soon!</p>
            <p className="text-sm">Add products with discounted prices to show deals here</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-20" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-[120px]" />
      
      <div className="container relative z-10 w-full">
        <div className="flex flex-col items-center justify-center text-center mb-16">
            <div className="inline-flex items-center gap-3 px-8 py-3 bg-white shadow-xl rounded-full mb-8 border border-border/50 backdrop-blur-md">
              <Zap className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-foreground">Flash Selection</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Limited Offerings
            </h2>
            
             <p className="text-muted-foreground max-w-lg mb-8 text-sm md:text-base leading-relaxed">
              Exclusive styles curated for a brief moment in time.
            </p>
 
            {/* Premium Timer - Minimalist Editorial Style */}
            <div className="flex items-center gap-6 md:gap-12 mb-8">
              <div className="flex flex-col items-center">
                <span className="text-4xl md:text-5xl font-bold text-primary tabular-nums">{timeLeft.hours.toString().padStart(2, '0')}</span>
                <span className="text-[10px] text-muted-foreground uppercase font-semibold mt-1">Hours</span>
              </div>
              <div className="text-3xl font-light text-muted-foreground pb-4">:</div>
              <div className="flex flex-col items-center">
                <span className="text-4xl md:text-5xl font-bold text-primary tabular-nums">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                <span className="text-[10px] text-muted-foreground uppercase font-semibold mt-1">Mins</span>
              </div>
              <div className="text-3xl font-light text-muted-foreground pb-4">:</div>
              <div className="flex flex-col items-center">
                <span className="text-4xl md:text-5xl font-bold text-secondary tabular-nums">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                <span className="text-[10px] text-muted-foreground uppercase font-semibold mt-1">Secs</span>
              </div>
            </div>
            
             <Link 
                to="/products?flash_deal=true"
                className="group flex items-center gap-3 text-sm font-semibold text-foreground hover:text-primary transition-all duration-300"
            >
                View Collection
                <div className="w-8 h-px bg-primary/40 group-hover:w-12 transition-all duration-300" />
            </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {products.map((product) => (
            <div key={product._id} className="animate-fade-in">
                <DynamicProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
