import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '@/lib/api';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { OrderTimeline } from '@/components/orders/OrderTimeline';
import { ChevronLeft, Package, MapPin, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // We might need to use the track endpoint or a direct get order endpoint
        // iterating on orderRoutes.js, we have GET /api/orders/:id
        const { data } = await api.get(`/orders/${id}`);
        
        // If the order object doesn't have history populated yet but has raw fields, construct it?
        // backend getOrderById returns the raw order object. 
        // We might want to use the track endpoint to get the history object easily, 
        // OR construct it here relative to the available fields.
        // Let's call the track endpoint for easy history object if we can, 
        // OR just map it manually here. 
        
        // Actually, let's just use the raw data and map it for the timeline
        const history = {
            placed: data.createdAt,
            paid: data.paidAt,
            shipped: data.shippedAt,
            outForDelivery: data.outForDeliveryAt,
            delivered: data.deliveredAt,
        };
        data.history = history;
        
        setOrder(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      const { data } = await api.put(`/orders/${id}/cancel`, { reason: 'User requested cancellation' });
      setOrder(data);
      alert('Order cancelled successfully');
      window.location.reload(); 
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel order');
    }
  };

  const handleReturnOrder = async () => {
    if (!window.confirm('Are you sure you want to return this order?')) return;

    try {
      const { data } = await api.put(`/orders/${id}/return`, { reason: 'User requested return' });
      setOrder(data);
      alert('Order return request submitted successfully');
      window.location.reload();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to return order');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!order || !order._id) return <div className="min-h-screen flex items-center justify-center">Order not found or Invalid Data</div>;

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />
      <main className="container py-16 lg:py-24">
        {/* Breadcrumb / Back Link */}
        <Link to="/account" className="inline-flex items-center gap-3 text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground/60 hover:text-primary transition-all mb-16 group">
            <ChevronLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
            Order Archives
        </Link>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8 border-b border-border/40 pb-12">
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-4xl lg:text-5xl font-display font-medium tracking-tight italic">
                        Order <span className="not-italic font-bold text-primary">#{order?._id?.slice(-8).toUpperCase()}</span>
                    </h1>
                    {order?.isCancelled && <span className="bg-destructive/10 text-destructive text-[10px] font-black px-4 py-1.5 uppercase tracking-widest rounded-full">Cancelled</span>}
                    {order?.isReturned && <span className="bg-orange-500/10 text-orange-600 text-[10px] font-black px-4 py-1.5 uppercase tracking-widest rounded-full">Returned</span>}
                </div>
                <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-muted-foreground/60">
                    PLACED ON {order?.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase() : 'UNKNOWN DATE'}
                </p>
            </div>
             <div className="flex flex-col items-end gap-6">
                <div className="text-right space-y-1">
                    <p className="text-3xl font-display font-bold text-primary tracking-tighter">₹{order?.totalPrice?.toLocaleString()}</p>
                    <p className="text-[9px] font-black tracking-[0.3em] text-muted-foreground/40 uppercase">{order?.orderItems?.length || 0} ARCHIVED ITEMS</p>
                </div>
                <div className="flex gap-4">
                    {!order.isCancelled && !order.isShipped && !order.isDelivered && !order.isReturned && (
                        <Button 
                            variant="destructive" 
                            className="rounded-none h-12 px-8 text-[10px] font-bold tracking-[0.3em] uppercase transition-all" 
                            onClick={handleCancelOrder}
                        >
                            REVOKE ORDER
                        </Button>
                    )}
                    {order.isDelivered && !order.isReturned && (
                        <Button 
                            variant="outline" 
                            className="rounded-none h-12 px-8 text-[10px] font-bold tracking-[0.3em] uppercase border-primary/20 text-primary hover:bg-primary/5 transition-all" 
                            onClick={handleReturnOrder}
                        >
                            INITIATE RETURN
                        </Button>
                    )}
                </div>
            </div>
        </div>

        {/* Timeline Section */}
        <section className="mb-24">
            <div className="bg-secondary/5 border border-border/40 p-12 lg:p-16">
                <div className="mb-12 space-y-2">
                    <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-secondary">ORDER TRACKING</h2>
                    <div className="h-px w-8 bg-primary/20" />
                </div>
                <OrderTimeline status={order.orderStatus || (order.isDelivered ? 'Delivered' : 'Processing')} history={order.history} />
            </div>
        </section>

        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
            {/* Order Items Grid */}
            <div className="lg:col-span-7 space-y-12">
                <div className="space-y-2">
                    <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-secondary">CURATED ITEMS</h2>
                    <div className="h-px w-8 bg-primary/20" />
                </div>
                <div className="space-y-8">
                    {order.orderItems.map((item: any) => (
                        <div key={item._id} className="flex gap-8 group">
                            <div className="w-32 h-40 bg-secondary/10 relative overflow-hidden transition-all duration-700 group-hover:shadow-2xl">
                                <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                                    loading="lazy" 
                                />
                            </div>
                            <div className="flex-1 flex flex-col justify-center space-y-4">
                                <div>
                                    <h3 className="text-lg font-display font-medium tracking-tight italic line-clamp-1">{item.name}</h3>
                                    <p className="text-[10px] font-black tracking-[0.3em] text-muted-foreground/60 uppercase mt-2">
                                        QTY: {item.qty} | SIZE: {item.size} | COLOR: {item.color}
                                    </p>
                                </div>
                                <p className="text-xl font-bold text-primary tracking-tighter">₹{item.price * item.qty}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Logistics & Payment Summaries */}
            <div className="lg:col-span-5 space-y-16">
                {/* Shipping Details */}
                <div className="bg-secondary/5 border border-border/40 p-12 space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-secondary">DESTINATION</h2>
                        <div className="h-px w-8 bg-primary/20" />
                    </div>
                    <div className="space-y-4">
                        <p className="text-sm font-bold tracking-widest text-foreground uppercase leading-relaxed">
                            {order?.shippingAddress?.address}
                        </p>
                        <p className="text-[11px] font-black tracking-[0.2em] text-muted-foreground/60 uppercase">
                            {order?.shippingAddress?.city}, {order?.shippingAddress?.state} {order?.shippingAddress?.postalCode}
                        </p>
                        <p className="text-[9px] font-black tracking-[0.5em] text-primary uppercase pt-4 border-t border-border/20">
                            {order?.shippingAddress?.country?.toUpperCase()}
                        </p>
                    </div>
                </div>

                {/* Payment Modal */}
                <div className="bg-secondary/5 border border-border/40 p-12 space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-secondary">TRANSACTION</h2>
                        <div className="h-px w-8 bg-primary/20" />
                    </div>
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground/60 uppercase">METHOD</span>
                            <span className="text-[11px] font-black tracking-widest uppercase">{order.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground/60 uppercase">STATUS</span>
                            <span className={cn("text-[10px] font-black tracking-[0.2em] uppercase px-3 py-1 rounded-full", order.isPaid ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600")}>
                                {order.isPaid ? "AUTHORIZED" : "PENDING"}
                            </span>
                        </div>
                        {order.isPaid && (
                            <div className="flex justify-between items-center pt-4 border-t border-border/20">
                                <span className="text-[9px] font-bold tracking-[0.2em] text-muted-foreground/40 uppercase">PROCESSED ON</span>
                                <span className="text-[10px] font-black tracking-widest uppercase">{new Date(order.paidAt).toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Financial Summary */}
                <div className="space-y-6">
                     <div className="flex justify-between items-baseline">
                        <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground">SUBTOTAL</span>
                        <span className="text-sm font-bold tracking-tighter">₹{order.itemsPrice?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                        <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground">LOGISTICS</span>
                        <span className="text-sm font-bold tracking-tighter">{order.shippingPrice === 0 ? 'COMPLIMENTARY' : `₹${order.shippingPrice}`}</span>
                    </div>
                    {order.discount > 0 && (
                        <div className="flex justify-between items-baseline text-primary">
                            <span className="text-[10px] font-bold tracking-[0.3em] uppercase">PRIVILEGE REDUCTION</span>
                            <span className="text-sm font-bold tracking-tighter">-₹{order.discount?.toLocaleString()}</span>
                        </div>
                    )}
                    <div className="h-px w-full bg-border/40 my-6" />
                    <div className="flex justify-between items-baseline">
                        <span className="text-[11px] font-black tracking-[0.4em] uppercase">FINAL TOTAL</span>
                        <span className="text-3xl font-display font-bold text-primary tracking-tighter">₹{order.totalPrice?.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
