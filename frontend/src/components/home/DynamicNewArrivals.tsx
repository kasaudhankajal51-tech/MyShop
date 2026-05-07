import { Link } from 'react-router-dom';
import { useNewArrivals } from '@/hooks/useProducts';
import { DynamicProductCard } from '@/components/products/DynamicProductCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function DynamicNewArrivals() {
  const { data: products, isLoading, error } = useNewArrivals(4);

  if (isLoading) {
    return (
      <section className="py-20 relative overflow-hidden bg-gradient-to-br from-secondary/30 via-background to-accent/10">
        <div className="container">
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
      <section className="py-20 relative overflow-hidden bg-gradient-to-br from-secondary/30 via-background to-accent/10">
        <div className="container">
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
              <Zap className="h-10 w-10 text-emerald-500/50" />
            </div>
            <h3 className="text-2xl font-display font-bold mb-3">New Arrivals Coming Soon</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Fresh styles are on their way. Stay tuned for our latest collection drops!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-br from-secondary/30 via-background to-accent/10">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/5 to-transparent" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
      
      <div className="container relative">
        <div className="flex flex-col items-center justify-center text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                New Arrivals
            </h2>
            <Button 
                variant="outline" 
                className="group border-emerald-500/30 hover:border-emerald-500 hover:bg-emerald-500 hover:text-white rounded-full px-6 py-2 text-xs font-medium uppercase transition-all" 
                asChild
            >
                <Link to="/products?new=true">
                View All
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
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
