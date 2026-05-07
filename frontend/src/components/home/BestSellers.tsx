import { Link } from 'react-router-dom';
import { products } from '@/data/products';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Award } from 'lucide-react';

export function BestSellers() {
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <section className="py-20">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
              <Award className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm tracking-[0.3em] text-muted-foreground mb-3">
                CUSTOMER FAVORITES
              </p>
              <h2 className="text-4xl md:text-5xl font-display font-bold">
                Best Sellers
              </h2>
            </div>
          </div>
          <Button variant="ghost" className="mt-4 md:mt-0" asChild>
            <Link to="/products?bestseller=true">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {bestSellers.map((product, index) => (
            <div
              key={product.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard product={product} showRank={index + 1} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
