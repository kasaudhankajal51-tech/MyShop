import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatCard } from '@/components/admin/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';
import { Package, ShoppingCart, Users, IndianRupee, TrendingUp, TrendingDown, Award, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
}

interface AnalyticsStats {
  totalRevenue: string;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: string;
  paidOrders: number;
  deliveredOrders: number;
  periodComparison?: {
    previousRevenue: number;
    previousOrders: number;
    revenueGrowth: string;
    ordersGrowth: string;
  };
}

interface BestProduct {
  productId: string;
  name: string;
  image: string;
  price: number;
  totalQuantitySold: number;
  totalRevenue: string;
  currentStock: number;
  rating: number;
  numReviews: number;
}

interface RecentOrder {
  _id: string;
  id?: string;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
  user: {
      name: string;
  }
}

interface WholesaleUser {
    _id: string;
    name: string;
    email: string;
    wholesaleProfile: {
        businessName: string;
        approvalStatus: 'pending' | 'approved' | 'rejected';
        phone: string;
    };
    createdAt: string;
}

interface WholesaleStats {
    totalCount: number;
    pendingCount: number;
    recentRegistrations: WholesaleUser[];
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  });
  const [analyticsStats, setAnalyticsStats] = useState<AnalyticsStats | null>(null);
  const [bestProducts, setBestProducts] = useState<BestProduct[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [wholesaleStats, setWholesaleStats] = useState<WholesaleStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<{name: string, sales: number}[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Strict Retail Mode
      const queryParams = { orderType: 'retail' };

      // Fetch analytics data
      const { data: analytics } = await api.get('/analytics/admin', { params: queryParams });
      setAnalyticsStats(analytics);

      // Fetch best performing products
      const { data: products } = await api.get('/analytics/admin/products', { 
          params: { ...queryParams, limit: 5 }
      });
      setBestProducts(products);

      // Fetch products count (Total products in catalog)
      // Displaying global product count is fine, or arguably we should show only retail-enabled products?
      // Let's show total catalog size for now as products are shared inventory.
      const { data: productData } = await api.get('/products');
      
      let totalProducts = 0;
      if (productData.products) {
          totalProducts = productData.total || productData.products.length; 
      } else {
          totalProducts = productData.length || 0;
      }
      
      // Fetch orders (Strictly Retail)
      const { data: orders } = await api.get('/orders', { params: queryParams });

      // Removed Wholesale Stats from Retail Dashboard to ensure strict separation


      // Process Chart Data (Last 6 Months)
      const months = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        months.push(d.toLocaleString('default', { month: 'short' }));
      }

      const currentYear = new Date().getFullYear();
      
      const realChartData = months.map(month => {
        const monthlySales = orders.reduce((acc: number, order: any) => {
          const d = new Date(order.createdAt);
          const orderMonth = d.toLocaleString('default', { month: 'short' });
          const orderYear = d.getFullYear();
          
          if (order.isPaid && orderMonth === month && (orderYear === currentYear || orderYear === currentYear - 1)) {
             return acc + (order.totalPrice || 0);
          }
          return acc;
        }, 0);

        return { name: month, sales: monthlySales };
      });

      setChartData(realChartData);

      // Sort orders by date descending for recent orders
      const sortedOrders = [...orders].sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ).slice(0, 5);

      setStats({
        totalProducts,
        totalOrders: analytics.totalOrders,
        totalCustomers: analytics.totalCustomers,
        totalRevenue: parseFloat(analytics.totalRevenue),
      });

      setRecentOrders(sortedOrders);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch dashboard data. Please check your connection and try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (isPaid: boolean, isDelivered: boolean) => {
      if (isDelivered) return 'bg-green-100 text-green-800';
      if (isPaid) return 'bg-blue-100 text-blue-800';
      return 'bg-yellow-100 text-yellow-800';
  };

  const getStatusText = (isPaid: boolean, isDelivered: boolean) => {
      if (isDelivered) return 'Delivered';
      if (isPaid) return 'Paid / Processing';
      return 'Pending Payment';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
                <h1 className="font-display text-3xl font-bold text-foreground">Retail Dashboard</h1>
                <span className="px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wider bg-blue-100 text-blue-700 border border-blue-200">
                    B2C Mode
                </span>
            </div>
            <p className="text-muted-foreground mt-1">Welcome to Shree Balaji Textiles Admin Panel</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon={Package}
            trend={{ value: 12, isPositive: true }}
            className="from-blue-500/20 to-blue-600/5 text-blue-600"
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={ShoppingCart}
            trend={{ value: 8, isPositive: true }}
            className="from-purple-500/20 to-purple-600/5 text-purple-600"
          />
          <StatCard
            title="Total Customers"
            value={stats.totalCustomers}
            icon={Users}
            trend={{ value: 5, isPositive: true }}
            className="from-emerald-500/20 to-emerald-600/5 text-emerald-600"
          />
          <StatCard
            title="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            icon={IndianRupee}
            trend={{ value: 24, isPositive: true }}
            className="from-orange-500/20 to-orange-600/5 text-orange-600"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Sales Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Sales Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-muted-foreground" />
                  <YAxis className="text-muted-foreground" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem'
                    }} 
                  />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No orders yet</p>
                ) : (
                  recentOrders.map((order) => (
                    <div 
                      key={order._id || order.id} 
                      className="flex items-center justify-between border-b border-border pb-3 last:border-0"
                    >
                      <div>
                        <p className="font-medium text-foreground">Order #{order._id?.substring(order._id.length - 6) || order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">{formatCurrency(order.totalPrice)}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.isPaid, order.isDelivered)}`}>
                          {getStatusText(order.isPaid, order.isDelivered)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Best Performing Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Best Performing Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            {bestProducts.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No sales data available</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Product</th>
                      <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Units Sold</th>
                      <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Revenue</th>
                      <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Stock</th>
                      <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bestProducts.map((product, index) => (
                      <tr key={product.productId} className="border-b border-border last:border-0">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden bg-muted">
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-full h-full object-contain"
                                loading="lazy"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-foreground truncate">{product.name}</p>
                              <p className="text-sm text-muted-foreground">{formatCurrency(product.price)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="text-right py-3 px-2 font-medium">{product.totalQuantitySold}</td>
                        <td className="text-right py-3 px-2 font-medium text-green-600">
                          {formatCurrency(parseFloat(product.totalRevenue))}
                        </td>
                        <td className="text-right py-3 px-2">
                          <span className={`text-sm ${product.currentStock > 10 ? 'text-green-600' : 'text-orange-600'}`}>
                            {product.currentStock}
                          </span>
                        </td>
                        <td className="text-right py-3 px-2">
                          <div className="flex items-center justify-end gap-1">
                            <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
                            <span className="text-yellow-500">★</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
