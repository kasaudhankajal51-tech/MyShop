import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import api from '@/lib/api';
import { Link } from 'react-router-dom';

interface Banner {
  _id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
}

export function PromoCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const { data } = await api.get('/carousel');
      const activeItems = (data || []).filter((item: any) => item.isActive);
      setBanners(activeItems);
    } catch (error) {
      console.error('Error fetching carousel items:', error);
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350;
      const newScrollPosition = scrollContainerRef.current.scrollLeft + 
        (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="relative h-[200px] bg-card animate-pulse mx-4 md:mx-8 my-4" />
    );
  }

  if (banners.length === 0) return null;

  return (
    <section className="py-4 relative bg-background border-y border-border">
      <div className="container px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-foreground font-display">
            Today's Deals
          </h2>
          <Link to="/products" className="text-sm text-accent hover:text-accent/80 hover:underline font-medium">
            See all deals
          </Link>
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background shadow-md border border-border rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 backdrop-blur-sm"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6 text-foreground" strokeWidth={2} />
          </button>

          {/* Scrollable Items */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {banners.map((banner) => (
              <Link
                key={banner._id}
                to={banner.link || '/products'}
                className="flex-shrink-0 w-[260px] group/item"
              >
                <div className="relative overflow-hidden bg-card border border-border rounded-xl hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                  {/* Image */}
                  <div className="relative h-[180px] overflow-hidden bg-secondary">
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-105"
                    />
                    {banner.subtitle && (
                      <div className="absolute top-2 left-2 bg-accent text-accent-foreground px-2 py-1 text-xs font-bold rounded-sm shadow-sm">
                        {banner.subtitle}
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 bg-card">
                    <h3 className="text-sm font-medium text-card-foreground line-clamp-2 min-h-[40px] group-hover/item:text-primary transition-colors">
                      {banner.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background shadow-md border border-border rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 backdrop-blur-sm"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6 text-foreground" strokeWidth={2} />
          </button>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
