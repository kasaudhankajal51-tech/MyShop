import { useState, useEffect } from 'react';
import { TrendingUp, ArrowRight } from 'lucide-react';
import api from '@/lib/api';
import { DynamicProductCard } from '@/components/products/DynamicProductCard';
import { DbProduct } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function TrendingProducts() {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    try {
      const { data } = await api.get('/products');
      // Handle paginated response or array
      const productsData = data.products || data || [];
      
      // Just take the first 6 products for now, assuming they are sorted by recency on backend or somewhat random
      // Or filter by isFeatured/isBestSeller if you want
      const trending = productsData.slice(0, 6);
      
      setProducts(trending);
    } catch (error) {
      console.error('Error fetching trending:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container">
          <div className="animate-pulse space-y-8">
            <div className="h-10 bg-muted rounded w-64" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-muted rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-16 bg-background">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                  Trending Now
                </h2>
                <p className="text-muted-foreground text-sm">What everyone's loving</p>
              </div>
            </div>
          </div>
          <div className="text-center py-12 text-muted-foreground">
            <TrendingUp className="h-16 w-16 mx-auto mb-4 text-primary/30" />
            <p className="text-lg">No trending products yet</p>
            <p className="text-sm">Add products to see trending items here</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container">
          <div className="flex flex-col items-center justify-center text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
              Trending Now
            </h2>
             <Button 
                variant="outline" 
                className="group border-indigo-500/30 hover:border-indigo-500 hover:bg-indigo-500 hover:text-white rounded-full px-6 py-2 text-xs font-medium uppercase transition-all" 
                asChild
            >
                <Link to="/products?trending=true">
                View All
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </Button>
          </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {products.map((product) => (
            <DynamicProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
