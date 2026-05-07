
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Search, Truck, Package, CheckCircle, Clock } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

import api from '@/lib/api';

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [orderStatus, setOrderStatus] = useState<any>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    
    setIsSearching(true);
    setOrderStatus(null);

    try {
      const { data } = await api.post('/orders/track', { orderId });
      
      // Format date
      const date = new Date(data.date).toLocaleDateString();
      
      setOrderStatus({
        id: data.id,
        status: data.status,
        date: date,
        items: data.items,
        total: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(data.total)
      });
    } catch (error: any) {
      toast({
        title: "Order Not Found",
        description: error.response?.data?.message || "Please check your Order ID and try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />
      <main className="flex-1">
        {/* Editorial Tracking Header */}
        <section className="container py-24 lg:py-32 border-b border-border/40">
          <div className="flex flex-col md:flex-row justify-between items-end gap-12">
            <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-display font-medium tracking-tight italic">
                    Track <span className="not-italic font-bold text-primary">Logistics</span>
                </h1>
                <p className="text-[11px] font-black tracking-[0.4em] uppercase text-muted-foreground/60 flex items-center gap-4">
                    <span className="w-12 h-px bg-primary/20" /> GLOBAL DISPATCH MONITORING
                </p>
            </div>
            <div className="max-w-md text-right">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground/40 leading-relaxed italic">
                    Enter your archival reference number to monitor the progression of your curated objects through our logistics network.
                </p>
            </div>
          </div>
        </section>

        <section className="container py-24 lg:py-32">
          <div className="max-w-3xl mx-auto space-y-24">
            <div className="bg-secondary/5 p-12 lg:p-16 border border-border/40 shadow-2xl space-y-12">
                <div className="space-y-4">
                    <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-secondary">AUTHORIZE TRACKING</h2>
                    <div className="h-px w-12 bg-primary/20" />
                </div>
                
                <form onSubmit={handleTrack} className="space-y-12">
                  <div className="relative group">
                    <Input 
                      placeholder="ARCHIVAL REFERENCE (e.g. #ORD-1234)" 
                      className="bg-transparent border-0 border-b border-border/60 rounded-none px-0 py-6 text-[11px] font-bold tracking-widest focus-visible:ring-0 focus-visible:border-primary transition-all uppercase placeholder:text-muted-foreground/20"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                    />
                    <div className="absolute bottom-0 left-0 h-px w-0 bg-primary group-focus-within:w-full transition-all duration-700" />
                  </div>
                  <Button 
                      type="submit" 
                      size="xl" 
                      className="w-full h-20 bg-primary hover:bg-primary/90 text-white rounded-none text-[11px] font-bold tracking-[0.5em] uppercase shadow-2xl transition-all" 
                      disabled={isSearching}
                  >
                    {isSearching ? 'AUTHORIZING...' : 'START MONITORING'}
                  </Button>
                </form>
            </div>

            {orderStatus && (
              <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="flex flex-col md:flex-row justify-between items-baseline gap-6 border-b border-border/40 pb-12">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground/40">REFERENCE NUMBER</p>
                    <h2 className="text-3xl font-display font-bold tracking-tighter text-primary">{orderStatus.id}</h2>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground/40">CURRENT STATUS</p>
                    <div className="flex items-center gap-4 text-primary">
                        <Truck className="h-4 w-4" />
                        <span className="text-[11px] font-black tracking-widest uppercase">{orderStatus.status}</span>
                    </div>
                  </div>
                </div>

                {/* Refined Timeline */}
                <div className="space-y-16 pl-12 border-l border-border/40 relative ml-6">
                  {/* Item 1 */}
                  <div className="relative group">
                    <div className="absolute -left-[55px] top-0 w-3 h-3 bg-primary rounded-full ring-8 ring-background" />
                    <div className="space-y-2">
                        <p className="text-[10px] font-black tracking-widest text-primary uppercase">ORDER AUTHORIZED</p>
                        <p className="text-[9px] font-bold tracking-widest text-muted-foreground/60 uppercase">The request has been verified and registered in our archive.</p>
                        <p className="text-[8px] font-black tracking-[0.2em] text-muted-foreground/40 uppercase">{orderStatus.date}</p>
                    </div>
                  </div>
                  
                  {/* Item 2 */}
                  <div className="relative group">
                    <div className="absolute -left-[55px] top-0 w-3 h-3 bg-primary rounded-full ring-8 ring-background" />
                    <div className="space-y-2">
                        <p className="text-[10px] font-black tracking-widest text-primary uppercase">PREPARING FOR DISPATCH</p>
                        <p className="text-[9px] font-bold tracking-widest text-muted-foreground/60 uppercase">Our atelier is meticulously preparing your curated selection.</p>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="relative group">
                    <div className="absolute -left-[55px] top-0 w-3 h-3 bg-primary rounded-full ring-8 ring-background animate-pulse" />
                    <div className="space-y-2">
                        <p className="text-[10px] font-black tracking-widest text-primary uppercase">LOGISTICS IN TRANSIT</p>
                        <p className="text-[9px] font-bold tracking-widest text-muted-foreground/60 uppercase">The objects are currently navigating our global logistics network.</p>
                        <p className="text-[8px] font-black tracking-[0.2em] text-primary/60 uppercase italic">Expected delivery: 3—5 cycles</p>
                    </div>
                  </div>

                   <div className="relative group opacity-20 grayscale">
                    <div className="absolute -left-[55px] top-0 w-3 h-3 bg-muted-foreground rounded-full ring-8 ring-background" />
                    <div className="space-y-2">
                        <p className="text-[10px] font-black tracking-widest uppercase">SUCCESSFUL HANDOVER</p>
                        <p className="text-[9px] font-bold tracking-widest uppercase">The archival objects have reached their final destination.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
