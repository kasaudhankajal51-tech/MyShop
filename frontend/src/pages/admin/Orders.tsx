import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import api from '@/lib/api';
import { Search, Loader2, Eye, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Order {
  _id: string; // Changed id to _id
  id?: string; // Fallback
  user: {
      name: string;
      email: string;
  };
  orderItems: OrderItem[];
  shippingAddress: {
      address: string;
      city: string;
      postalCode: string; // Changed from pincode
      country: string;
  };
  paymentMethod: string;
  paymentResult?: {
      id: string;
      status: string;
      update_time: string;
      email_address: string;
  };
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number; // Changed from total
  isPaid: boolean;
  paidAt?: string;
  isShipped?: boolean;
  shippedAt?: string;
  isOutForDelivery?: boolean;
  outForDeliveryAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  createdAt: string; // Changed from created_at
}

interface OrderItem {
  name: string; // Product name
  qty: number;
  image: string;
  price: number;
  product: string; // Product ID
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders', { params: { orderType: 'retail' } });
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch orders',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      if (status === 'delivered') {
          await api.put(`/orders/${orderId}/deliver`, {});
          toast({ title: 'Success', description: 'Order marked as delivered' });
      } else if (status === 'shipped') {
          await api.put(`/orders/${orderId}/ship`, {});
          toast({ title: 'Success', description: 'Order marked as shipped' });
      } else if (status === 'out-for-delivery') {
          await api.put(`/orders/${orderId}/out`, {});
          toast({ title: 'Success', description: 'Order marked as out for delivery' });
      } else if (status === 'paid') {
           // Generally paid is handled by payment gateway, but for COD manual update might be needed
           // For now keeping it simple as per request
           toast({
            title: 'Info',
            description: 'Payment status is usually updated automatically.',
            variant: 'default',
          });
          return;
      }
      fetchOrders();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
      try {
          await api.delete(`/orders/${orderId}`);
          toast({ title: 'Success', description: 'Order deleted successfully' });
          fetchOrders();
      } catch (error: any) {
          toast({
              title: 'Error',
              description: error.message || 'Failed to delete order',
              variant: 'destructive',
          });
      }
  };

  const filteredOrders = orders.filter((order) =>
    (order._id || order.id || '').toLowerCase().includes(search.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (order: Order) => {
    if (order.isDelivered) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (order.isOutForDelivery) return 'bg-orange-100 text-orange-700 border-orange-200';
    if (order.isShipped) return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    if (order.isPaid) return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-amber-100 text-amber-700 border-amber-200';
  };

  const getStatusText = (order: Order) => {
    if (order.isDelivered) return 'Delivered';
    if (order.isOutForDelivery) return 'Out for Delivery';
    if (order.isShipped) return 'Shipped';
    if (order.isPaid) return 'Processing';
    return 'Pending';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground mt-1">Manage customer orders</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order._id || order.id}>
                        <TableCell className="font-medium">#{order._id?.substring(order._id.length - 6) || order.id}</TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleDateString('en-IN')}
                        </TableCell>
                        <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                        <TableCell>{order.user?.name || 'Guest'}</TableCell>
                        <TableCell>
                           <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order)}`}>
                            {getStatusText(order)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                                <Select
                                    value={
                                        order.isDelivered ? 'delivered' : 
                                        order.isOutForDelivery ? 'out-for-delivery' :
                                        order.isShipped ? 'shipped' :
                                        (order.isPaid ? 'paid' : 'pending')
                                    }
                                    onValueChange={(value) => handleStatusChange(order._id || order.id!, value)}
                                >
                                    <SelectTrigger className="w-36 h-8 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="paid">Paid (Processing)</SelectItem>
                                        <SelectItem value="shipped">Shipped</SelectItem>
                                        <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
                                        <SelectItem value="delivered">Delivered</SelectItem>
                                    </SelectContent>
                                </Select>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleViewOrder(order)}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                        onClick={() => {
                                            if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
                                                handleDeleteOrder(order._id || order.id!);
                                            }
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Order Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Order Details - #{selectedOrder?._id?.substring(selectedOrder?._id.length - 6)}</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Order Date</p>
                    <p className="font-medium">
                      {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Method</p>
                    <p className="font-medium uppercase">{selectedOrder.paymentMethod || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Shipping Address</h3>
                  {selectedOrder.shippingAddress && (
                    <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                      <p>{selectedOrder.shippingAddress.address}</p>
                      <p>
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.country} - {selectedOrder.shippingAddress.postalCode}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Order Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.orderItems.map((item, index) => (
                      <div key={index} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.qty}
                          </p>
                        </div>
                        <div className="text-right">
                          <p>{formatCurrency(item.price)} × {item.qty}</p>
                          <p className="font-medium">{formatCurrency(item.price * item.qty)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Items Price</span>
                    <span>{formatCurrency(selectedOrder.itemsPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatCurrency(selectedOrder.taxPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{formatCurrency(selectedOrder.shippingPrice)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(selectedOrder.totalPrice)}</span>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
