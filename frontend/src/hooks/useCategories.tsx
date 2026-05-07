import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface DbCategory {
  _id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
}

async function fetchCategories() {
  const { data } = await api.get('/categories');
  return data as DbCategory[];
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });
}

// Fetch store stats dynamically
async function fetchStoreStats() {
  // Parallel fetch using Promise.all
  const [productsRes, ordersRes, usersRes] = await Promise.all([
    api.get('/products'),
    api.get('/orders'),
    api.get('/users'),
  ]);

  const products = productsRes.data || [];
  const orders = ordersRes.data || [];
  
  // Calculate avg rating from products (if they have reviews/ratings)
  let totalRating = 0;
  let ratedProducts = 0;
  products.forEach((p: any) => {
    if (p.rating > 0) {
      totalRating += p.rating;
      ratedProducts++;
    }
  });
  
  const avgRating = ratedProducts > 0 
    ? (totalRating / ratedProducts).toFixed(1) 
    : '5.0'; // Default if no ratings

  // Count unique customers from orders or just use users count
  // Users count is more accurate for registered users.
  // Original logic used orders count * 0.8
  // Let's use actual user count if we have it, or fallback.
  const customerCount = usersRes.data ? usersRes.data.length : (orders.length > 0 ? Math.floor(orders.length * 0.8) : 0);

  return {
    products: products.length,
    customers: customerCount,
    rating: avgRating,
  };
}

export function useStoreStats() {
  return useQuery({
    queryKey: ['store-stats'],
    queryFn: fetchStoreStats,
    staleTime: 60000, // Cache for 1 minute
  });
}
