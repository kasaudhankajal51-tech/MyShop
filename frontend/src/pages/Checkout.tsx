import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '@/lib/api';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
// useShoppingMode import removed
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, CreditCard, Truck, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Checkout() {
  const { state, totalPrice, clearCart, discountedPrice } = useCart();
  // const { mode } = useShoppingMode(); // Removed usage
  const { toast } = useToast();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const userInfoString = localStorage.getItem('userInfo');
      if (!userInfoString) {
        // ... login check
      }
      const userInfo = JSON.parse(userInfoString);

      const shippingCost = discountedPrice >= 5000 ? 0 : 199;
      const total = discountedPrice + shippingCost;

      // 1. COD Flow
      if (paymentMethod === 'cod') {
         const orderData = {
          orderItems: state.items.map(item => ({
            product: item.product.id || item.product._id,
            name: item.product.name,
            image: item.product.image || item.product.images?.[0] || '/placeholder.svg',
            price: item.product.price,
            qty: item.quantity, 
          })),
          shippingAddress: {
            address: formData.address,
            city: formData.city,
            postalCode: formData.pincode,
            country: 'India',
          },
          paymentMethod: 'COD',
          itemsPrice: totalPrice,
          taxPrice: 0,
          shippingPrice: shippingCost,
          totalPrice: total,
          discount: totalPrice - discountedPrice,
          orderType: 'retail', // Hardcoded retail
        };

        const { data } = await api.post('/orders', orderData);
        // ... success handler
        toast({
          title: "Order placed successfully!",
          description: `Order #${data._id} has been placed.`,
        });
        clearCart();
        navigate('/account');
        return;
      }

      // 2. Razorpay Flow
      // ... loadRazorpay
      const res = await loadRazorpay();
      if (!res) {
          toast({ title: "Error", description: "Razorpay SDK failed to load", variant: "destructive" });
          return;
      }

      // Create Order on Backend
      const { data: orderData } = await api.post('/payment/create-order', { amount: total });
      
      const options = {
        key: 'rzp_test_placeholder_id', // Replace with valid Key ID
        amount: orderData.amount,
        currency: "INR",
        name: "Shree Balaji Textiles",
        description: "Purchase Transaction",
        image: "/logo.png", // Start serving logo if available
        order_id: orderData.id,
        handler: async function (response: any) {
          // Verify Payment
          try {
            const verifyRes = await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyRes.data.success) {
               // Place Final Order in Backend
               const finalOrderData = {
                  orderItems: state.items.map(item => ({
                    product: item.product.id || item.product._id,
                    name: item.product.name,
                    image: item.product.image || item.product.images?.[0] || '/placeholder.svg',
                    price: item.product.price,
                    qty: item.quantity, 
                  })),
                  shippingAddress: {
                    address: formData.address,
                    city: formData.city,
                    postalCode: formData.pincode,
                    country: 'India',
                  },
                  paymentMethod: 'Razorpay',
                  paymentResult: {
                    id: response.razorpay_payment_id,
                    status: 'completed',
                    email_address: formData.email,
                  },
                  itemsPrice: totalPrice,
                  taxPrice: 0,
                  shippingPrice: shippingCost,
                  totalPrice: total,
                  discount: totalPrice - discountedPrice,
                  isPaid: true,
                  paidAt: new Date(),
                  orderType: 'retail', // Hardcoded retail
               };

               const { data } = await api.post('/orders', finalOrderData);
               
               toast({
                  title: "Payment Successful!",
                  description: `Order #${data._id} has been placed.`,
               });
               clearCart();
               navigate('/account');
            }
          } catch (error) {
             toast({ title: "Payment Verification Failed", description: "Contact support if money was deducted", variant: "destructive" });
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#4f46e5",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (error: any) {
      console.error(error);
      toast({
        title: "Order failed",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const shippingCost = discountedPrice >= 5000 ? 0 : 199;
  const total = discountedPrice + shippingCost;

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-20 text-center">
          <h1 className="text-2xl font-display mb-4">Your bag is empty</h1>
          <Button asChild>
            <Link to="/products">Continue Shopping</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Refined Header */}
      <header className="border-b border-border/40 sticky top-0 bg-background/80 backdrop-blur-xl z-50">
        <div className="container py-8 flex items-center justify-between">
          <Link to="/" className="text-2xl font-display font-medium uppercase tracking-[0.2em]">
            BALAJI <span className="text-primary italic">TEXTILES</span>
          </Link>
          <div className="flex items-center gap-4 text-[9px] font-black tracking-[0.3em] uppercase text-muted-foreground/60">
            <Lock className="h-3 w-3" />
            SECURE CONCIERGE CHECKOUT
          </div>
        </div>
      </header>

      <main className="container py-16">
        <Link
          to="/cart"
          className="inline-flex items-center gap-3 text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground/60 hover:text-primary transition-all mb-12 group"
        >
          <ChevronLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
          REFINE BAG
        </Link>

        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          {/* Form Area */}
          <div className="lg:col-span-7 space-y-16">
            <form onSubmit={handleSubmit} className="space-y-16">
              {/* Identity & Contact */}
              <section className="space-y-8">
                <div className="space-y-2">
                    <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-secondary">01. CONTACT IDENTITY</h2>
                    <div className="h-px w-8 bg-primary/20" />
                </div>
                <div className="relative group">
                  <Input
                    type="email"
                    name="email"
                    placeholder="EMAIL ADDRESS"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-transparent border-0 border-b border-border/60 rounded-none px-0 py-6 text-[11px] font-bold tracking-widest focus-visible:ring-0 focus-visible:border-primary transition-all uppercase placeholder:text-muted-foreground/20"
                  />
                  <div className="absolute bottom-0 left-0 h-px w-0 bg-primary group-focus-within:w-full transition-all duration-700" />
                </div>
              </section>

              {/* Shipping Logistics */}
              <section className="space-y-8">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-secondary">02. SHIPPING LOGISTICS</h2>
                        <div className="h-px w-8 bg-primary/20" />
                    </div>
                    <button 
                        type="button" 
                        onClick={() => {
                            if ('geolocation' in navigator) {
                                navigator.geolocation.getCurrentPosition(async (position) => {
                                    try {
                                        const { latitude, longitude } = position.coords;
                                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                                        const data = await response.json();
                                        setFormData(prev => ({
                                            ...prev,
                                            address: data.display_name || '',
                                            city: data.address.city || data.address.town || data.address.village || '',
                                            state: data.address.state || '',
                                            pincode: data.address.postcode || '',
                                        }));
                                        toast({ title: "Location detected", description: "Address updated." });
                                    } catch (error) {
                                        toast({ title: "Error", description: "Failed to fetch location.", variant: "destructive" });
                                    }
                                });
                            }
                        }}
                        className="text-[9px] font-bold tracking-[0.2em] uppercase text-primary border-b border-primary/20 hover:border-primary transition-all"
                    >
                        DETECT LOCATION
                    </button>
                </div>
                
                <div className="grid grid-cols-2 gap-12">
                  <div className="relative group">
                    <Input
                      type="text"
                      name="firstName"
                      placeholder="GIVEN NAME"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="bg-transparent border-0 border-b border-border/60 rounded-none px-0 py-6 text-[11px] font-bold tracking-widest focus-visible:ring-0 focus-visible:border-primary transition-all uppercase placeholder:text-muted-foreground/20"
                    />
                    <div className="absolute bottom-0 left-0 h-px w-0 bg-primary group-focus-within:w-full transition-all duration-700" />
                  </div>
                  <div className="relative group">
                    <Input
                      type="text"
                      name="lastName"
                      placeholder="SURNAME"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="bg-transparent border-0 border-b border-border/60 rounded-none px-0 py-6 text-[11px] font-bold tracking-widest focus-visible:ring-0 focus-visible:border-primary transition-all uppercase placeholder:text-muted-foreground/20"
                    />
                    <div className="absolute bottom-0 left-0 h-px w-0 bg-primary group-focus-within:w-full transition-all duration-700" />
                  </div>
                </div>

                <div className="relative group">
                  <Input
                    type="text"
                    name="address"
                    placeholder="STREET ADDRESS / APARTMENT"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="bg-transparent border-0 border-b border-border/60 rounded-none px-0 py-6 text-[11px] font-bold tracking-widest focus-visible:ring-0 focus-visible:border-primary transition-all uppercase placeholder:text-muted-foreground/20"
                  />
                  <div className="absolute bottom-0 left-0 h-px w-0 bg-primary group-focus-within:w-full transition-all duration-700" />
                </div>

                <div className="grid grid-cols-3 gap-8">
                  <div className="relative group col-span-1">
                    <Input
                      type="text"
                      name="city"
                      placeholder="CITY"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="bg-transparent border-0 border-b border-border/60 rounded-none px-0 py-6 text-[11px] font-bold tracking-widest focus-visible:ring-0 focus-visible:border-primary transition-all uppercase placeholder:text-muted-foreground/20"
                    />
                    <div className="absolute bottom-0 left-0 h-px w-0 bg-primary group-focus-within:w-full transition-all duration-700" />
                  </div>
                  <div className="relative group col-span-1">
                    <Input
                      type="text"
                      name="state"
                      placeholder="STATE / PROVINCE"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      className="bg-transparent border-0 border-b border-border/60 rounded-none px-0 py-6 text-[11px] font-bold tracking-widest focus-visible:ring-0 focus-visible:border-primary transition-all uppercase placeholder:text-muted-foreground/20"
                    />
                    <div className="absolute bottom-0 left-0 h-px w-0 bg-primary group-focus-within:w-full transition-all duration-700" />
                  </div>
                  <div className="relative group col-span-1">
                    <Input
                      type="text"
                      name="pincode"
                      placeholder="ZIP / PIN"
                      required
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="bg-transparent border-0 border-b border-border/60 rounded-none px-0 py-6 text-[11px] font-bold tracking-widest focus-visible:ring-0 focus-visible:border-primary transition-all uppercase placeholder:text-muted-foreground/20"
                    />
                    <div className="absolute bottom-0 left-0 h-px w-0 bg-primary group-focus-within:w-full transition-all duration-700" />
                  </div>
                </div>

                <div className="relative group">
                  <Input
                    type="tel"
                    name="phone"
                    placeholder="CONTACT NUMBER"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-transparent border-0 border-b border-border/60 rounded-none px-0 py-6 text-[11px] font-bold tracking-widest focus-visible:ring-0 focus-visible:border-primary transition-all uppercase placeholder:text-muted-foreground/20"
                  />
                  <div className="absolute bottom-0 left-0 h-px w-0 bg-primary group-focus-within:w-full transition-all duration-700" />
                </div>
              </section>

              {/* Payment Modality */}
              <section className="space-y-8">
                <div className="space-y-2">
                    <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-secondary">03. PAYMENT MODALITY</h2>
                    <div className="h-px w-8 bg-primary/20" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { id: 'razorpay', label: 'TRANSACT ONLINE', desc: 'UPI, CARD, NETBANKING', icon: CreditCard },
                    { id: 'cod', label: 'CASH ON DELIVERY', desc: 'PAY AT YOUR DOORSTEP', icon: Truck },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={cn(
                        "group flex flex-col gap-4 p-8 border transition-all duration-500 cursor-pointer",
                        paymentMethod === method.id 
                            ? 'bg-primary/5 border-primary shadow-2xl' 
                            : 'bg-transparent border-border/40 hover:border-primary/20 hover:bg-secondary/5'
                      )}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id as any)}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between">
                        <method.icon className={cn("h-5 w-5 transition-colors", paymentMethod === method.id ? 'text-primary' : 'text-muted-foreground/40')} strokeWidth={1.5} />
                        <div className={cn("w-3 h-3 rounded-full border border-border/60", paymentMethod === method.id && "bg-primary border-primary")} />
                      </div>
                      <div className="space-y-1">
                        <p className={cn("text-[10px] font-bold tracking-[0.2em] transition-colors", paymentMethod === method.id ? 'text-foreground' : 'text-muted-foreground')}>
                            {method.label}
                        </p>
                        <p className="text-[9px] font-bold tracking-widest text-muted-foreground/40">{method.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </section>

              <Button 
                type="submit"
                size="xl" 
                className="w-full h-20 bg-primary hover:bg-primary/90 text-white rounded-none text-[11px] font-bold tracking-[0.5em] uppercase shadow-2xl transition-all" 
                disabled={isProcessing}
              >
                {isProcessing ? 'AUTHORIZING...' : `FINALIZE TRANSACTION — ${formatPrice(total)}`}
              </Button>
            </form>
          </div>

          {/* Editorial Summary */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-12 bg-secondary/5 p-12 border border-border/40">
            <div className="space-y-2">
                <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-secondary">ORDER SUMMARY</h2>
                <div className="h-px w-8 bg-primary/20" />
            </div>

            <div className="space-y-8 max-h-[40vh] overflow-y-auto pr-4 scrollbar-hide">
              {state.items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                  className="flex gap-6 group"
                >
                  <div className="w-20 h-24 bg-secondary/10 relative overflow-hidden group-hover:shadow-lg transition-all duration-500">
                    <img 
                      src={item.product.image || item.product.images?.[0] || '/placeholder.svg'} 
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-primary text-white text-[9px] font-black flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col justify-center py-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest line-clamp-1 italic">{item.product.name}</p>
                    <p className="text-[9px] font-black tracking-[0.2em] text-muted-foreground/60 uppercase mt-1">
                      {item.selectedSize} / {item.selectedColor}
                    </p>
                    <p className="text-[11px] font-bold text-foreground mt-2 tracking-tighter">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6 pt-8 border-t border-border/40">
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground">SUBTOTAL</span>
                <span className="text-sm font-bold tracking-tighter">{formatPrice(totalPrice)}</span>
              </div>
              {state.coupon && (
                <div className="flex justify-between items-baseline text-primary">
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase">PRIVILEGE DISCOUNT ({state.coupon.code})</span>
                  <span className="text-sm font-bold tracking-tighter">-{formatPrice(totalPrice - discountedPrice)}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground">LOGISTICS</span>
                <span className="text-sm font-bold tracking-tighter">{shippingCost === 0 ? 'COMPLIMENTARY' : formatPrice(shippingCost)}</span>
              </div>
              
              <div className="h-px w-full bg-border/40 my-6" />
              
              <div className="flex justify-between items-baseline">
                <span className="text-[11px] font-black tracking-[0.4em] uppercase">TOTAL ESTIMATE</span>
                <span className="text-3xl font-display font-bold text-primary tracking-tighter">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="bg-white/50 p-6 space-y-4">
                <p className="text-[9px] font-bold tracking-widest text-muted-foreground uppercase leading-relaxed text-center italic">
                    All transactions are encrypted and secure. By placing an order, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
          </div>
        </div>
      </main>
      
      <div className="container py-20 border-t border-border/40 text-center space-y-8">
            <div className="flex justify-center items-center gap-12 opacity-30 grayscale">
                 <div className="text-[10px] font-black tracking-widest">VISA</div>
                 <div className="text-[10px] font-black tracking-widest">MASTERCARD</div>
                 <div className="text-[10px] font-black tracking-widest">RAZORPAY</div>
                 <div className="text-[10px] font-black tracking-widest">SECURE SSL</div>
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">
                © {new Date().getFullYear()} BALAJI TEXTILES. ALL RIGHTS RESERVED.
            </p>
      </div>
    </div>
  );
}
