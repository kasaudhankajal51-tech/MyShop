import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  User, Package, Heart, MapPin, LogOut, Edit2, Save, TrendingUp, 
  ShoppingCart, CreditCard, Crown, Sparkles, ChevronRight, Camera, 
  Trash2, Plus, X, Navigation, LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';

// --- CUSTOM UI COMPONENTS ---

const TiltCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [style, setStyle] = useState({});

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        
        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
        const rotateY = ((x - centerX) / centerX) * 10;

        setStyle({
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
            transition: 'all 0.1s ease'
        });
    };

    const handleMouseLeave = () => {
        setStyle({
            transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
            transition: 'all 0.5s ease'
        });
    };

    return (
        <div 
            ref={cardRef} 
            className={cn("transition-all duration-200 will-change-transform", className)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={style}
        >
            {children}
        </div>
    );
};

const HolographicOverlay = () => (
    <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none rounded-xl overflow-hidden z-0 mix-blend-overlay">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_2s_infinite]" />
    </div>
);



export default function Account() {
  const { user, profile, loading, signOut, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Navigation State
  const [activeTab, setActiveTab] = useState('overview');
  // Transition State
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Logic State
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', phone: '' });
  
  // Data State
  const [orders, setOrders] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [reorderSuggestions, setReorderSuggestions] = useState<any[]>([]);
  
  const [loadingData, setLoadingData] = useState(false); 
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    address: '', city: '', postalCode: '', country: 'India', isDefault: false
  });
  const [fetchingLocation, setFetchingLocation] = useState(false);


  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile) setFormData({ full_name: profile.full_name || '', phone: profile.phone || '' });
  }, [profile]);

  useEffect(() => {
    if (user) fetchAllData();
  }, [user]);

  const fetchAllData = async () => {
    setLoadingData(true);
    try {
        const [ordersRes, analyticsRes, wishlistRes, addressRes, suggestionsRes] = await Promise.allSettled([
            api.get('/orders/myorders'),
            api.get('/analytics/user/purchases'),
            api.get('/users/wishlist'),
            api.get('/users/address'),
            api.get('/analytics/user/reorder-suggestions?limit=6')
        ]);

        if (ordersRes.status === 'fulfilled') setOrders(ordersRes.value.data);
        if (analyticsRes.status === 'fulfilled') setAnalytics(analyticsRes.value.data);
        if (wishlistRes.status === 'fulfilled') setWishlist(wishlistRes.value.data);
        if (addressRes.status === 'fulfilled') setAddresses(addressRes.value.data);
        if (suggestionsRes.status === 'fulfilled') setReorderSuggestions(suggestionsRes.value.data);

    } catch (error) {
        console.error("Failed to fetch account data", error);
    } finally {
        setLoadingData(false);
    }
  };

  const handleTabChange = (tabId: string) => {
    if (activeTab === tabId) return;
    setIsTransitioning(true);
    setTimeout(() => {
        setActiveTab(tabId);
        setIsTransitioning(false);
    }, 300); // Wait for exit animation
  };

  const handleSaveProfile = async () => { /* ... existing logic ... */ 
    setSaving(true);
    const { error } = await updateProfile(formData);
    setSaving(false);
    if (!error) {
        toast({ title: 'Profile Updated', description: 'Your details have been saved.' });
        setIsEditing(false);
    } else {
        toast({ title: 'Error', description: 'Failed to update profile.', variant: 'destructive' });
    }
  };
  const handleSignOut = async () => { await signOut(); navigate('/'); };
  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  
  const handleAddToCart = async (productId: string, slug: string) => { /* ... existing logic ... */ 
      try {
      await api.post('/cart', { productId, quantity: 1 });
      toast({ title: 'Added to cart', description: 'Product added to your cart successfully.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to add product.', variant: 'destructive' });
    }
  };
  const handleRemoveFromWishlist = async (id: string) => { /* ... existing logic ... */
      try {
      await api.delete(`/users/wishlist/${id}`);
      setWishlist(wishlist.filter(item => item._id !== id));
      toast({ title: 'Removed', description: 'Product removed from wishlist.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to remove.', variant: 'destructive' });
    }
  };
  const handleAddAddress = async () => { /* ... existing logic ... */ 
      try {
      const { data } = await api.post('/users/address', addressForm);
      setAddresses(data);
      setShowAddressForm(false);
      setAddressForm({ address: '', city: '', postalCode: '', country: 'India', isDefault: false });
      toast({ title: 'Address added', description: 'Saved successfully.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to add address.', variant: 'destructive' });
    }
  };
  const handleDeleteAddress = async (id: string) => { /* ... existing logic ... */
      try {
      await api.delete(`/users/address/${id}`);
      setAddresses(addresses.filter(addr => addr._id !== id));
      toast({ title: 'Deleted', description: 'Address removed.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete.', variant: 'destructive' });
    }
  }; 
  const handleFetchCurrentLocation = async () => { /* ... existing logic ... */ 
      if (!navigator.geolocation) return;
    setFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
          try {
              const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&addressdetails=1`);
              const data = await res.json();
              if(data && data.address) {
                  const addr = data.address;
                  setAddressForm(prev => ({...prev, 
                      address: `${addr.road||''} ${addr.suburb||''} ${addr.neighbourhood||''}`.trim() || data.display_name,
                      city: addr.city||addr.town||'', postalCode: addr.postcode||'', country: addr.country||'India'
                  }));
                  toast({title:'Location fetched', description:'Address updated.'});
              }
          } catch(e) { console.error(e); } finally { setFetchingLocation(false); }
      },
      (err) => { setFetchingLocation(false); toast({title:'Error', description:'Location access denied.', variant:'destructive'}); }
    );
  };

  if (loading) return null;
  if (!user) return null;

  const SidebarItem = ({ id, icon: Icon, label }: any) => (
    <button
        onClick={() => handleTabChange(id)}
        className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500 group relative overflow-hidden",
            activeTab === id 
                ? "bg-gradient-to-r from-primary/10 to-transparent text-primary font-bold shadow-[inset_2px_0_0_0_theme(colors.primary.DEFAULT)]" 
                : "text-muted-foreground hover:bg-white/50 hover:text-foreground dark:hover:bg-white/5 hover:pl-5"
        )}
    >
        {activeTab === id && (
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-50 animate-in fade-in duration-500" />
        )}
        <Icon className={cn("w-4 h-4 transition-all duration-300", activeTab === id ? "scale-110 text-primary drop-shadow-sm" : "group-hover:scale-110 group-hover:text-foreground")} />
        <span className="relative z-10 text-sm font-medium tracking-wide">{label}</span>
        {activeTab === id && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-100 text-primary animate-in slide-in-from-left-2" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
        <Header />
        <CartDrawer />

        <div className="container py-16 lg:py-24 relative z-10">
            
            {/* Elegant Identity Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-12 border-b border-border/40 pb-16">
                <div className="flex items-center gap-10">
                    <div className="w-24 h-24 lg:w-32 lg:h-32 bg-secondary/10 relative group">
                        <div className="w-full h-full flex items-center justify-center text-4xl lg:text-5xl font-display font-medium text-primary italic">
                            {user.name?.charAt(0) || 'U'}
                        </div>
                        <div className="absolute inset-0 border border-primary/20 group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute -bottom-2 -right-2 bg-primary text-white text-[9px] font-black px-4 py-1.5 uppercase tracking-widest shadow-2xl">
                             ATELIER PRO
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <h1 className="text-4xl lg:text-5xl font-display font-medium tracking-tight italic">
                            Salutations, <span className="not-italic font-bold text-primary">{user.name?.split(' ')[0] || 'Patron'}</span>
                        </h1>
                        <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-muted-foreground/60 flex items-center gap-3">
                            <span className="w-8 h-px bg-primary/20" /> YOUR PRIVATE ARCHIVE
                        </p>
                    </div>
                </div>
                
                <button onClick={handleSignOut} className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground/60 hover:text-primary transition-all border-b border-transparent hover:border-primary/20 pb-1">
                    ABANDON SESSION
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                
                {/* Minimalist Navigation Sidebar */}
                <div className="lg:col-span-3 space-y-12">
                     <div className="space-y-6">
                        <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-secondary">NAVIGATION</h2>
                        <div className="flex flex-col gap-2">
                            {[
                                { id: 'overview', icon: LayoutDashboard, label: 'DASHBOARD' },
                                { id: 'orders', icon: Package, label: 'ACQUISITIONS' },
                                { id: 'wishlist', icon: Heart, label: 'CURATIONS' },
                                { id: 'addresses', icon: MapPin, label: 'LOGISTICS' },
                                { id: 'profile', icon: User, label: 'SETTINGS' },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleTabChange(item.id)}
                                    className={cn(
                                        "w-full flex items-center gap-4 py-4 text-[10px] font-bold tracking-[0.3em] uppercase transition-all duration-500 group",
                                        activeTab === item.id 
                                            ? "text-primary italic translate-x-2" 
                                            : "text-muted-foreground/60 hover:text-primary hover:translate-x-2"
                                    )}
                                >
                                    <item.icon className={cn("w-3 h-3 transition-transform", activeTab === item.id && "scale-125")} strokeWidth={2.5} />
                                    <span>{item.label}</span>
                                    {activeTab === item.id && <div className="h-px w-8 bg-primary/40 ml-auto" />}
                                </button>
                            ))}
                        </div>
                     </div>
                </div>

                {/* Main Atelier Content Area */}
                <div className="lg:col-span-9">
                    <div className={cn(
                        "transition-all duration-700 ease-in-out",
                        isTransitioning ? "opacity-0 translate-y-8" : "opacity-100 translate-y-0"
                    )}>
                        
                        {/* OVERVIEW CONTENT */}
                        {activeTab === 'overview' && (
                            <div className="space-y-24">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                    {[
                                        { label: 'ARCHIVED ORDERS', value: analytics?.totalOrders || 0 },
                                        { label: 'VALUATION SPENT', value: formatCurrency(analytics?.totalSpent || 0) },
                                        { label: 'WISHLIST COUNT', value: wishlist.length },
                                    ].map((stat, i) => (
                                        <div key={i} className="space-y-4 group">
                                            <div className="text-[9px] font-black tracking-[0.4em] text-muted-foreground/40 uppercase group-hover:text-primary transition-colors">{stat.label}</div>
                                            <div className="text-4xl font-display font-bold text-foreground tracking-tighter group-hover:translate-x-2 transition-transform duration-700">{stat.value}</div>
                                            <div className="h-px w-8 bg-primary/20 group-hover:w-full transition-all duration-700" />
                                        </div>
                                    ))}
                                </div>

                                {/* Recent Acquisitions */}
                                <div className="space-y-12">
                                    <div className="flex justify-between items-end border-b border-border/40 pb-6">
                                        <h3 className="text-lg font-display font-medium tracking-tight italic">Recent Acquisitions</h3>
                                        <button onClick={() => handleTabChange('orders')} className="text-[9px] font-bold tracking-[0.3em] uppercase text-primary border-b border-primary/20 hover:border-primary transition-all">VIEW ARCHIVES</button>
                                    </div>
                                    <div className="space-y-12">
                                        {orders.slice(0, 3).map((order) => (
                                            <div key={order._id} className="group flex items-center gap-10 cursor-pointer" onClick={() => navigate(`/order/${order._id}`)}>
                                                <div className="w-24 h-32 bg-secondary/10 relative overflow-hidden group-hover:shadow-2xl transition-all duration-700">
                                                   {order.orderItems[0]?.image ? (
                                                       <img src={order.orderItems[0].image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                                   ) : <div className="w-full h-full flex items-center justify-center text-muted-foreground/20 italic">No Visual</div>}
                                                </div>
                                                <div className="flex-1 space-y-3">
                                                    <div className="flex items-center gap-4">
                                                        <h4 className="text-[11px] font-black tracking-widest uppercase">#{order._id.slice(-8).toUpperCase()}</h4>
                                                        <span className={cn("text-[8px] font-black px-3 py-1 uppercase tracking-widest", order.isDelivered ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600")}>
                                                            {order.isDelivered ? 'Delivered' : 'In Transit'}
                                                        </span>
                                                    </div>
                                                    <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground/60 uppercase">{order.orderItems.length} OBJECTS • {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }).toUpperCase()}</p>
                                                    <p className="text-xl font-display font-bold text-primary tracking-tighter">{formatCurrency(order.totalPrice)}</p>
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 group-hover:translate-x-4 transition-all duration-700">
                                                    <ChevronRight className="w-4 h-4 text-primary" strokeWidth={1.5} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ACQUISITIONS TAB */}
                        {activeTab === 'orders' && (
                             <div className="space-y-16">
                                <h2 className="text-2xl font-display font-medium italic tracking-tight border-b border-border/40 pb-6">Acquisition Archives</h2>
                                <div className="grid gap-16">
                                     {orders.length === 0 ? (
                                        <div className="text-center py-24 space-y-6 grayscale opacity-30">
                                            <Package className="w-12 h-12 mx-auto" strokeWidth={1} />
                                            <p className="text-[10px] font-bold tracking-[0.4em] uppercase">No archives found</p>
                                        </div>
                                     ) : (
                                        orders.map((order) => (
                                            <div key={order._id} className="group grid md:grid-cols-4 gap-12 items-center">
                                                <div className="space-y-2">
                                                    <h3 className="text-[11px] font-black tracking-widest uppercase mb-1">ORDER #{order._id.slice(-8).toUpperCase()}</h3>
                                                    <p className="text-[9px] font-bold tracking-[0.2em] text-muted-foreground/40 uppercase">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}</p>
                                                </div>
                                                <div className="flex gap-4 overflow-x-auto scrollbar-hide">
                                                    {order.orderItems.map((item: any, idx: number) => (
                                                        <div key={idx} className="w-16 h-20 bg-secondary/5 border border-border/20 flex-shrink-0 p-1 group-hover:shadow-lg transition-all duration-700">
                                                            <img src={item.image} className="w-full h-full object-cover" />
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="text-lg font-display font-bold text-primary tracking-tighter">{formatCurrency(order.totalPrice)}</div>
                                                <div className="text-right">
                                                    <Link to={`/order/${order._id}`} className="text-[9px] font-black tracking-[0.3em] uppercase text-primary border-b border-primary/20 hover:border-primary transition-all">
                                                        REVIEW DETAILS
                                                    </Link>
                                                </div>
                                            </div>
                                        ))
                                     )}
                                </div>
                            </div>
                        )}

                        {/* CURATIONS TAB */}
                        {activeTab === 'wishlist' && (
                             <div className="space-y-16">
                                <h2 className="text-2xl font-display font-medium italic tracking-tight border-b border-border/40 pb-6">Personal Curations</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                                    {wishlist.map((product) => (
                                        <div key={product._id} className="group space-y-6">
                                            <div className="aspect-[3/4] bg-secondary/5 relative overflow-hidden">
                                                <img src={product.image || product.images?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                                                     <Button 
                                                        className="h-14 rounded-none bg-white text-black hover:bg-white/90 text-[10px] font-bold tracking-[0.4em] uppercase translate-y-4 group-hover:translate-y-0 transition-all duration-700" 
                                                        onClick={() => handleAddToCart(product._id, product.slug)}
                                                     >
                                                         ACQUIRE
                                                     </Button>
                                                </div>
                                                <button onClick={() => handleRemoveFromWishlist(product._id)} className="absolute top-6 right-6 w-10 h-10 bg-white/90 backdrop-blur text-destructive flex items-center justify-center hover:bg-destructive hover:text-white transition-all shadow-2xl">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-[10px] font-black tracking-[0.2em] uppercase truncate">{product.name}</h3>
                                                <p className="text-xl font-display font-bold text-primary tracking-tighter">{formatCurrency(product.price)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                             </div>
                        )}

                        {/* LOGISTICS TAB */}
                        {activeTab === 'addresses' && (
                             <div className="space-y-16">
                                <div className="flex justify-between items-end border-b border-border/40 pb-6">
                                    <h2 className="text-2xl font-display font-medium italic tracking-tight">Shipping Logistics</h2>
                                    <button onClick={() => setShowAddressForm(true)} className="text-[9px] font-bold tracking-[0.3em] uppercase text-primary border-b border-primary/20 hover:border-primary transition-all">ADD DESTINATION</button>
                                </div>
                                {showAddressForm && (
                                     <div className="bg-secondary/5 p-12 space-y-12 animate-in slide-in-from-top duration-700">
                                         <div className="grid gap-12">
                                             <div className="relative group">
                                                <Input 
                                                    placeholder="FULL STREET ADDRESS" 
                                                    value={addressForm.address} 
                                                    onChange={e=>setAddressForm({...addressForm, address:e.target.value})} 
                                                    className="bg-transparent border-0 border-b border-border/60 rounded-none px-0 py-6 text-[11px] font-bold tracking-widest focus-visible:ring-0 focus-visible:border-primary transition-all uppercase" 
                                                />
                                                <div className="absolute bottom-0 left-0 h-px w-0 bg-primary group-focus-within:w-full transition-all duration-700" />
                                             </div>
                                             <div className="grid grid-cols-2 gap-12">
                                                 <div className="relative group">
                                                    <Input 
                                                        placeholder="CITY" 
                                                        value={addressForm.city} 
                                                        onChange={e=>setAddressForm({...addressForm, city:e.target.value})} 
                                                        className="bg-transparent border-0 border-b border-border/60 rounded-none px-0 py-6 text-[11px] font-bold tracking-widest focus-visible:ring-0 focus-visible:border-primary transition-all uppercase" 
                                                    />
                                                    <div className="absolute bottom-0 left-0 h-px w-0 bg-primary group-focus-within:w-full transition-all duration-700" />
                                                 </div>
                                                 <div className="relative group">
                                                    <Input 
                                                        placeholder="ZIP / PIN CODE" 
                                                        value={addressForm.postalCode} 
                                                        onChange={e=>setAddressForm({...addressForm, postalCode:e.target.value})} 
                                                        className="bg-transparent border-0 border-b border-border/60 rounded-none px-0 py-6 text-[11px] font-bold tracking-widest focus-visible:ring-0 focus-visible:border-primary transition-all uppercase" 
                                                    />
                                                    <div className="absolute bottom-0 left-0 h-px w-0 bg-primary group-focus-within:w-full transition-all duration-700" />
                                                 </div>
                                             </div>
                                             <div className="flex gap-8 pt-8">
                                                 <button className="text-[10px] font-black tracking-widest uppercase text-primary border-b border-primary/20 hover:border-primary transition-all" onClick={handleFetchCurrentLocation} disabled={fetchingLocation}>
                                                    {fetchingLocation ? 'LOCATING...' : 'DETECT CURRENT POSITION'}
                                                 </button>
                                                 <div className="flex-1" />
                                                 <button className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60 hover:text-foreground transition-colors" onClick={() => setShowAddressForm(false)}>DISCARD</button>
                                                 <button className="text-[10px] font-black tracking-widest uppercase text-primary" onClick={handleAddAddress}>SAVE LOGISTICS</button>
                                             </div>
                                         </div>
                                     </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    {addresses.map((addr) => (
                                        <div key={addr._id} className="group border border-border/40 p-12 space-y-8 hover:bg-secondary/5 transition-all duration-700">
                                            <div className="flex justify-between items-start">
                                                <MapPin className="w-5 h-5 text-primary" strokeWidth={1.5} />
                                                {addr.isDefault && <span className="text-[8px] font-black uppercase tracking-[0.4em] text-primary bg-primary/10 px-4 py-1.5">PRIMARY</span>}
                                            </div>
                                            <div className="space-y-4">
                                                <p className="text-[11px] font-black tracking-widest uppercase">{addr.city || 'ARCHIVED ADDRESS'}</p>
                                                <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground/60 uppercase leading-relaxed">{addr.address}, {addr.postalCode}</p>
                                            </div>
                                            <div className="pt-8 border-t border-border/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                                <button className="text-[9px] font-black tracking-[0.3em] uppercase text-destructive border-b border-transparent hover:border-destructive transition-all" onClick={() => handleDeleteAddress(addr._id)}>REMOVE DESTINATION</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                             </div>
                        )}

                        {/* SETTINGS TAB */}
                        {activeTab === 'profile' && (
                            <div className="max-w-xl space-y-16 py-8">
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-display font-medium italic tracking-tight">Atelier Profile Settings</h2>
                                    <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-muted-foreground/60">REDACT YOUR PRIVATE INFORMATION</p>
                                </div>
                                <div className="space-y-12">
                                     <div className="relative group">
                                         <Label className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 mb-2 block">FULL IDENTITY</Label>
                                         <Input 
                                            value={formData.full_name} 
                                            onChange={e => setFormData({...formData, full_name: e.target.value})} 
                                            disabled={!isEditing} 
                                            className="bg-transparent border-0 border-b border-border/60 rounded-none px-0 py-6 text-[11px] font-bold tracking-widest focus-visible:ring-0 focus-visible:border-primary transition-all uppercase" 
                                         />
                                         <div className="absolute bottom-0 left-0 h-px w-0 bg-primary group-focus-within:w-full transition-all duration-700" />
                                     </div>
                                     <div className="relative group">
                                         <Label className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 mb-2 block">CONTACT PHONE</Label>
                                         <Input 
                                            value={formData.phone} 
                                            onChange={e => setFormData({...formData, phone: e.target.value})} 
                                            disabled={!isEditing} 
                                            className="bg-transparent border-0 border-b border-border/60 rounded-none px-0 py-6 text-[11px] font-bold tracking-widest focus-visible:ring-0 focus-visible:border-primary transition-all uppercase" 
                                         />
                                         <div className="absolute bottom-0 left-0 h-px w-0 bg-primary group-focus-within:w-full transition-all duration-700" />
                                     </div>
                                     <div className="relative group opacity-60">
                                         <Label className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 mb-2 block">SECURE EMAIL (LOCKED)</Label>
                                         <Input value={user.email} disabled className="bg-transparent border-0 border-b border-border/20 rounded-none px-0 py-6 text-[11px] font-bold tracking-widest focus-visible:ring-0 transition-all uppercase" />
                                     </div>
                                     <div className="pt-8">
                                         {!isEditing ? (
                                             <Button 
                                                onClick={() => setIsEditing(true)} 
                                                className="h-16 rounded-none bg-primary text-white hover:bg-primary/90 text-[11px] font-bold tracking-[0.4em] uppercase shadow-2xl transition-all px-12"
                                             >
                                                EDIT IDENTITY
                                             </Button> 
                                         ) : (
                                             <div className="flex gap-12">
                                                 <button onClick={() => setIsEditing(false)} className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground/60 hover:text-foreground transition-colors border-b border-transparent hover:border-border pb-1">ABANDON CHANGES</button>
                                                 <Button onClick={handleSaveProfile} disabled={saving} className="h-16 rounded-none bg-primary text-white text-[11px] font-bold tracking-[0.4em] uppercase shadow-2xl px-12">COMMIT CHANGES</Button>
                                             </div>
                                         )}
                                     </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </div>
  );
}
