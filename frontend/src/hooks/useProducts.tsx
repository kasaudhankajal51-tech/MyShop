import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
// useShoppingMode import removed

export interface DbProduct { // Keep name DbProduct to minimize refactor, or rename to Product
  _id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number; // legacy?
  originalPrice?: number;
  description: string;
  category?: string;
  season?: string;
  gender?: string;
  brand?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  createdAt?: string;
  updatedAt?: string;
  image: string;
  images?: string[];
  countInStock: number;
  numReviews: number;
  rating: number;
  sizes?: string[]; // Array of strings
  colors?: { name: string; hex: string }[]; // Array of color objects
  wholesalePrice?: number;
  wholesaleEnabled?: boolean;
  minWholesaleQuantity?: number;
  pricingTiers?: { minQuantity: number; maxQuantity?: number; pricePerUnit: number }[];
}

async function fetchProducts(options?: {
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  limit?: number;
  mode?: 'retail' | 'wholesale';
}) {
  const params = new URLSearchParams();
  if (options?.featured) params.append('isFeatured', 'true');
  if (options?.bestSeller) params.append('isBestSeller', 'true');
  if (options?.newArrival) params.append('isNewArrival', 'true');
  if (options?.limit) params.append('pageSize', options.limit.toString()); // Use backend pagination to limit
  if (options?.mode) params.append('mode', options.mode);

  const { data } = await api.get(`/products?${params.toString()}`);
  
  // Handle paginated response or array (legacy support)
  let products = (data.products || data || []) as DbProduct[];

  // Client-side fallback filter (optional, but backend should handle it now)
  // We keep the limit logic if the backend pagination wasn't strict enough or for safety
  if (options?.limit && products.length > options.limit) {
    products = products.slice(0, options.limit);
  }

  return products;
}

export function useProducts(options?: {
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  limit?: number;
}) {
  // const { mode } = useShoppingMode();

  return useQuery({
    queryKey: ['products', { ...options, mode: 'retail' }],
    queryFn: () => fetchProducts({ ...options, mode: 'retail' }),
  });
}

export function useFeaturedProducts(limit = 4) {
  return useProducts({ featured: true, limit });
}

export function useBestSellers(limit = 4) {
  return useProducts({ bestSeller: true, limit });
}

export function useNewArrivals(limit = 4) {
  return useProducts({ newArrival: true, limit });
}

export function useAllProducts() {
  return useProducts();
}
