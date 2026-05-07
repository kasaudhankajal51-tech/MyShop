import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Link } from 'react-router-dom';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFilters } from '@/components/products/ProductFilters';
import { Product } from '@/data/products';
import { SlidersHorizontal, Grid3X3, LayoutGrid, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type SortOption = 'newest' | 'popular' | 'price-low' | 'price-high' | 'rating';

// useShoppingMode import removed
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(true);
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(3);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  // Wholesale redirect removed

  const [filters, setFilters] = useState({
    season: searchParams.get('season') ? [searchParams.get('season')!] : [],
    category: searchParams.get('category') ? [searchParams.get('category')!] : [],
    subcategory: [] as string[],
    priceRange: [] as string[],
    size: [] as string[],
    color: [] as string[],
  });

  // Sync filters with search params when they change
  useEffect(() => {
    const category = searchParams.get('category');
    const season = searchParams.get('season');
    
    if (category || season) {
        setFilters(prev => ({
            ...prev,
            category: category ? [category] : prev.category,
            season: season ? [season] : prev.season
        }));
    }
  }, [searchParams]);

  // Debounce filter changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params: any = {
           pageNumber: page,
           sort: sortBy,
        };

        if (searchParams.get('search')) {
           params.keyword = searchParams.get('search');
        }

        if (searchParams.get('new') === 'true') {
            params.isNewArrival = 'true';
        }

        // Use searchParams as fallback for filters to ensure header links work
        const activeCategory = filters.category.length > 0 ? filters.category[0] : searchParams.get('category');
        const activeSeason = filters.season.length > 0 ? filters.season[0] : searchParams.get('season');

        if (activeCategory) {
            params.category = activeCategory;
        }
        
        if (activeSeason) {
            params.season = activeSeason;
        }

        if (filters.priceRange.length > 0) {
            const [min, max] = filters.priceRange[0].split('-').map(Number);
            params.minPrice = min;
            if (max) params.maxPrice = max;
        }

        const endpoint = '/products';
        const { data } = await api.get(endpoint, { params });
        
        let fetchedProducts = data.products || data;
        
        if (filters.size.length > 0) {
            fetchedProducts = fetchedProducts.filter((p: Product) => 
                p.sizes?.some((s) => filters.size.includes(s))
            );
        }
         if (filters.subcategory.length > 0) {
            fetchedProducts = fetchedProducts.filter((p: Product) => 
                filters.subcategory.includes(p.subcategory)
            );
        }
        
        setProducts(fetchedProducts);
        setPages(data.pages || 1);

      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, sortBy, filters, searchParams]);

  const handleFilterChange = (filterType: string, value: string) => {
    setPage(1); // Reset to page 1 on filter change
    setFilters((prev) => {
      const current = prev[filterType as keyof typeof prev] as string[];
      // Toggle logic
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]; // For simplicity allowed multiple in state, but API uses first
      
      // Update URL params for shareability (optional, basic impl)
      if (filterType === 'category') {
        if (updated.length > 0) searchParams.set('category', updated[0]);
        else searchParams.delete('category');
        setSearchParams(searchParams);
      }

      return { ...prev, [filterType]: updated };
    });
  };

  const clearFilters = () => {
    setFilters({
      season: [],
      category: [],
      subcategory: [],
      priceRange: [],
      size: [],
      color: [],
    });
    setSearchParams({});
    setPage(1);
  };
  
  const getCategoryDetails = () => {
    const category = filters.category[0] || searchParams.get('category');
    const season = filters.season[0] || searchParams.get('season');
    const search = searchParams.get('search');

    if (search) {
      return {
        title: `Search: "${search}"`,
        subtitle: "CURATED RESULTS",
        description: `Explore our collection of pieces matching your search for "${search}".`,
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000"
      };
    }

    if (category === 'women') {
      return {
        title: "Women's Collection",
        subtitle: "THE ELEGANCE REDEFINED",
        description: "Discover our meticulously curated selection of premium ethnic and contemporary pieces for women. From timeless sarees to modern silhouettes.",
        image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&q=80&w=2000"
      };
    }

    if (category === 'men') {
      return {
        title: "Men's Collection",
        subtitle: "SOPHISTICATION IN EVERY STITCH",
        description: "Explore our range of premium menswear. Traditional heritage meets contemporary craftsmanship for the modern gentleman.",
        image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&q=80&w=2000"
      };
    }

    if (season === 'summer') {
      return {
        title: "Summer '24",
        subtitle: "LIGHTWEIGHT & BREATHABLE",
        description: "Embrace the warmth with our summer-ready fabrics and breezy silhouettes designed for effortless style.",
        image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=2000"
      };
    }

    return {
      title: "All Products",
      subtitle: "PREMIUM READYMADE",
      description: "Discover our full range of meticulously curated ethnic and contemporary pieces.",
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2000"
    };
  };

  const categoryDetails = getCategoryDetails();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />

      <main className="pb-24">
        {/* Editorial Banner Section */}
        <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden mb-12">
            <img 
                src={categoryDetails.image} 
                alt={categoryDetails.title}
                className="absolute inset-0 w-full h-full object-cover scale-105 animate-slow-zoom"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background" />
            
            <div className="container relative h-full flex flex-col justify-center items-center text-center text-white pt-20">
                <nav className="flex items-center gap-3 text-[10px] font-bold tracking-[0.4em] uppercase text-white/70 mb-8 animate-fade-in-up">
                    <Link to="/" className="hover:text-white transition-colors">Home</Link>
                    <span className="opacity-40">/</span>
                    <span>Collection</span>
                </nav>
                
                <span className="text-[10px] md:text-xs font-bold tracking-[0.6em] uppercase mb-4 animate-fade-in-up [animation-delay:200ms]">
                    {categoryDetails.subtitle}
                </span>
                
                <h1 className="text-5xl md:text-8xl font-display font-medium mb-8 tracking-tight italic animate-fade-in-up [animation-delay:400ms]">
                    {categoryDetails.title.split(' ')[0]} <span className="not-italic font-bold">{categoryDetails.title.split(' ').slice(1).join(' ')}</span>
                </h1>
                
                <div className="h-px w-24 bg-white/40 mb-8 animate-fade-in-up [animation-delay:600ms]" />
                
                <p className="text-xs md:text-sm font-medium tracking-widest text-white/80 max-w-xl leading-relaxed animate-fade-in-up [animation-delay:800ms]">
                    {categoryDetails.description}
                </p>
            </div>
        </section>

        <div className="container">

        {/* Sophisticated Controls */}
        <div className="sticky top-[80px] z-30 bg-background/80 backdrop-blur-xl border-y border-border/40 py-4 mb-12">
            <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-8">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors"
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                        {showFilters ? 'Hide Filters' : 'Filter Selection'}
                    </button>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                        {products.length} Masterpieces
                    </span>
                </div>

                <div className="flex items-center gap-8">
                    <div className="hidden md:flex items-center gap-4">
                        <button onClick={() => setGridCols(2)} className={cn('transition-all duration-300', gridCols === 2 ? 'text-primary scale-110' : 'text-muted-foreground/40 hover:text-muted-foreground')}>
                            <LayoutGrid className="h-4 w-4" />
                        </button>
                        <button onClick={() => setGridCols(3)} className={cn('transition-all duration-300', gridCols === 3 ? 'text-primary scale-110' : 'text-muted-foreground/40 hover:text-muted-foreground')}>
                            <Grid3X3 className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="relative group">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                            className="appearance-none bg-transparent pr-8 text-[10px] font-bold uppercase tracking-[0.2em] cursor-pointer outline-none text-foreground"
                        >
                            <option value="newest">Sort: Newest</option>
                            <option value="popular">Sort: Popular</option>
                            <option value="rating">Sort: Top Rated</option>
                            <option value="price-low">Sort: Price Low</option>
                            <option value="price-high">Sort: Price High</option>
                        </select>
                        <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none text-muted-foreground" />
                    </div>
                </div>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filters Sidebar - Elegant Slide */}
          <aside className={cn('transition-all duration-700 ease-in-out', showFilters ? 'opacity-100 lg:w-72' : 'opacity-0 lg:w-0 overflow-hidden')}>
            <div className="sticky top-40">
                <ProductFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={clearFilters}
                    totalProducts={products.length}
                />
            </div>
          </aside>

          {/* Product Grid - Editorial Style */}
          <div className="flex-1">
            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground animate-pulse">Refining Results</span>
                </div>
            ) : products.length === 0 ? (
              <div className="text-center py-32 bg-secondary/5 border border-dashed border-border/60">
                <p className="text-xl font-display font-medium mb-6 italic">No pieces found matching your criteria</p>
                <button 
                    onClick={clearFilters} 
                    className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary border-b border-primary/40 pb-1 hover:border-primary transition-all"
                >
                    Reset All Filters
                </button>
              </div>
            ) : (
                <>
                  <div className={cn('grid gap-8 md:gap-12', gridCols === 2 ? 'grid-cols-2' : gridCols === 3 ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 lg:grid-cols-4')}>
                    {products.map((product, index) => (
                      <div key={product.id || product._id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                  
                  {/* Pagination - Minimalist Luxury */}
                  {pages > 1 && (
                      <div className="flex items-center justify-center mt-32 gap-12 border-t border-border/40 pt-16">
                          <button 
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className="text-[10px] font-bold uppercase tracking-[0.3em] disabled:opacity-20 hover:text-primary transition-colors flex items-center gap-2"
                          >
                            <ChevronLeft className="w-4 h-4" /> Previous
                          </button>
                          
                          <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{page}</span>
                            <div className="w-8 h-px bg-border/60" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">{pages}</span>
                          </div>

                          <button 
                            disabled={page === pages}
                            onClick={() => setPage(page + 1)}
                            className="text-[10px] font-bold uppercase tracking-[0.3em] disabled:opacity-20 hover:text-primary transition-colors flex items-center gap-2"
                          >
                            Next <ChevronRight className="w-4 h-4" />
                          </button>
                      </div>
                  )}
                </>
            )}
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);
}
