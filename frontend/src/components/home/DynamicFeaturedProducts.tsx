import { Link } from 'react-router-dom';
import { useFeaturedProducts } from '@/hooks/useProducts';
import { DynamicProductCard } from '@/components/products/DynamicProductCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function DynamicFeaturedProducts() {
  const { data: products, isLoading, error } = useFeaturedProducts(4);

  if (isLoading) {
    return (
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="container relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <Skeleton className="h-4 w-32 mb-3" />
              <Skeleton className="h-12 w-64" />
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[3/4] rounded-xl" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !products?.length) {
    return (
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="container relative">
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Sparkles className="h-10 w-10 text-primary/50" />
            </div>
            <h3 className="text-2xl font-display font-bold mb-3">Featured Products Coming Soon</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We're curating the best products for you. Check back soon for our featured collection!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="container relative">
        <div className="flex flex-col items-center justify-center text-center mb-16">
            <h2 className="text-xs font-bold tracking-[0.5em] uppercase text-secondary mb-4 italic">The Selection</h2>
            <h3 className="text-3xl md:text-5xl font-display font-medium tracking-tight">FEATURED COLLECTION</h3>
            <div className="h-px w-20 bg-primary/20 mt-8 mb-10" />
            
            <Link 
                to="/products?featured=true"
                className="text-xs font-bold uppercase tracking-[0.3em] text-foreground hover:text-primary transition-colors border-b border-primary/40 pb-1"
            >
                Explore Everything
            </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {products.map((product, index) => (
            <div
              key={product._id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <DynamicProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
