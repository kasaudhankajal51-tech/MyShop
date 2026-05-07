import { useEffect, useState } from 'react';
import { Product } from '@/data/products';
import { ProductCard } from '@/components/products/ProductCard';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export function RecentlyViewed() {
  const [products, setProducts] = useState<Product[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      try {
        const { data } = await api.get('/users/history');
        if (data) {
             // Map _id to id
            const mapped = data.map((p: any) => ({
                ...p,
                id: p.id || p._id
            }));
            setProducts(mapped);
        }
      } catch (error) {
        console.error('Error fetching recently viewed:', error);
      }
    };

    fetchHistory();
  }, [user]);

  if (!user || products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <h2 className="text-3xl font-display font-bold text-center mb-12">
          Recently Viewed
        </h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
