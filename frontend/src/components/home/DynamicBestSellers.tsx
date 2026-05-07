import { Link } from 'react-router-dom';
import { useBestSellers } from '@/hooks/useProducts';
import { DynamicProductCard } from '@/components/products/DynamicProductCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Trophy, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function DynamicBestSellers() {
  const { data: products, isLoading, error } = useBestSellers(4);

  if (isLoading) {
    return (
      <section className="py-20 relative overflow-hidden">
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
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
        <div className="container relative">
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
              <Trophy className="h-10 w-10 text-accent/50" />
            </div>
            <h3 className="text-2xl font-display font-bold mb-3">Best Sellers Coming Soon</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Our top-rated products will appear here. Shop now and help us find the favorites!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
      <div className="absolute top-20 right-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl" />
      
      <div className="container relative">
        <div className="flex flex-col items-center justify-center text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                Best Sellers
            </h2>
            <Button 
                variant="outline" 
                className="group border-accent/30 hover:border-accent hover:bg-accent hover:text-white rounded-full px-6 py-2 text-xs font-medium uppercase transition-all" 
                asChild
            >
                <Link to="/products?bestseller=true">
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
              <DynamicProductCard product={product} showRank={index + 1} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
