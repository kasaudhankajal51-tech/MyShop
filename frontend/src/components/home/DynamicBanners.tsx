import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { Link } from 'react-router-dom';

interface Banner {
  _id: string;
  title: string;
  subtitle: string;
  image: string; // image_url -> image
  link: string; // link_url -> link
}

export default function DynamicBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const fetchBanners = async () => {
    try {
      const { data } = await api.get('/banners');
      
      // Filter active banners and exclude 'hero' if you only want promo banners here.
      // The original code did .neq('position', 'hero').
      // Let's keep that logic.
      const activeBanners = (data || []).filter((b: any) => b.isActive && b.position !== 'hero');

      if (activeBanners.length > 0) {
        setBanners(activeBanners);
      } else {
        // Fallback banners if no data from backend
        setBanners([
          {
            _id: '1',
            title: 'Summer Collection 2024',
            subtitle: 'Up to 50% off on selected items',
            image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&q=80',
            link: '/products?season=summer',
          },
          {
            _id: '2',
            title: 'Winter Arrivals',
            subtitle: 'Stay warm in style',
            image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=80',
            link: '/products?season=winter',
          },
        ]);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  if (loading) {
    return (
      <div className="relative h-[400px] md:h-[500px] bg-muted animate-pulse" />
    );
  }

  if (banners.length === 0) return null;

  const currentBanner = banners[currentIndex];

  return (
    <section className="relative h-[600px] md:h-[700px] overflow-hidden group bg-background">
      {/* Banner Image */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/30 z-10" /> {/* Slightly darker for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
        
        {banners.map((banner, index) => (
          <div
            key={banner._id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
             <img
              src={banner.image}
              alt={banner.title}
              className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-out ${
                 index === currentIndex ? 'scale-110' : 'scale-100'
              }`}
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 h-full container flex items-center justify-center text-center">
        <div className="max-w-4xl space-y-8 px-4">
          <div key={currentIndex} className="space-y-4">
              {currentBanner.subtitle && (
                <p className="animate-slide-up text-xs md:text-sm font-semibold tracking-wider uppercase text-white/90 mb-3 block">
                  {currentBanner.subtitle}
                </p>
              )}
              <h2 
                className="animate-slide-up text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-none"
                style={{ animationDelay: '0.1s' }}
              >
                {currentBanner.title}
              </h2>
              <div 
                className="mx-auto h-0.5 w-16 bg-white/80 mt-6 animate-scale-in"
                style={{ animationDelay: '0.3s' }}
              />
          </div>
          
          {currentBanner.link && (
            <div className="animate-slide-up pt-2" style={{ animationDelay: '0.4s' }}>
                <Link to={currentBanner.link}>
                <Button 
                    size="default" 
                    className="bg-transparent text-white border border-white hover:bg-white hover:text-primary transition-all duration-300 px-8 py-6 text-sm font-semibold uppercase tracking-wider"
                >
                    Discover Now
                </Button>
                </Link>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Arrows - Glassmorphic */}
      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full border border-white/10 text-white hover:bg-white/20 hover:border-white/40 transition-all backdrop-blur-md opacity-0 group-hover:opacity-100 duration-500"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full border border-white/10 text-white hover:bg-white/20 hover:border-white/40 transition-all backdrop-blur-md opacity-0 group-hover:opacity-100 duration-500"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Progress Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center gap-4">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === currentIndex
                  ? 'w-12 bg-accent' 
                  : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
