import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { Minus, Plus, X, ShoppingBag, ArrowRight } from 'lucide-react';

export default function Cart() {
  const { state, removeItem, updateQuantity, totalPrice, clearCart, applyCoupon, removeCoupon, discountedPrice } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const shippingThreshold = 5000;
  const freeShipping = discountedPrice >= shippingThreshold;
  const amountToFreeShipping = shippingThreshold - discountedPrice;

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />
      <CartDrawer />

      <main className="container py-16 lg:py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-border/40 pb-12">
            <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-display font-medium tracking-tight italic">
                    Shopping <span className="not-italic font-bold text-primary">Bag</span>
                </h1>
                <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-muted-foreground/60 flex items-center gap-3">
                    <span className="w-8 h-px bg-primary/20" /> YOUR CURATED SELECTION
                </p>
            </div>
            <p className="text-[11px] font-black tracking-[0.2em] text-muted-foreground/40 uppercase">
                {state.items.length} ARCHIVED OBJECTS
            </p>
        </div>

        {state.items.length === 0 ? (
          <div className="text-center py-32 space-y-8 grayscale opacity-30">
            <ShoppingBag className="h-16 w-16 mx-auto stroke-1" />
            <div className="space-y-2">
                <h2 className="text-xl font-display font-medium italic">Your bag is currently void</h2>
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase">No curations found</p>
            </div>
            <Button size="xl" className="rounded-none bg-primary text-white text-[11px] font-bold tracking-[0.4em] uppercase shadow-2xl px-12" asChild>
              <Link to="/products">START CURATING</Link>
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
            {/* Cart items */}
            <div className="lg:col-span-8 space-y-12">
              {/* Elegant Free Shipping Notice */}
              {!freeShipping && (
                <div className="p-8 bg-secondary/5 border border-border/40 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="space-y-1 text-center md:text-left">
                    <p className="text-[10px] font-bold tracking-[0.3em] uppercase">COMPLIMENTARY LOGISTICS</p>
                    <p className="text-[9px] font-black tracking-[0.2em] text-muted-foreground/40 uppercase">EXPEND {formatPrice(amountToFreeShipping)} MORE FOR PRIVILEGED DELIVERY</p>
                  </div>
                  <div className="w-full md:w-48 h-1 bg-border/20 relative overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full bg-primary transition-all duration-1000 ease-in-out"
                      style={{ width: `${(discountedPrice / shippingThreshold) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="divide-y divide-border/40">
                {state.items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                    className="py-12 flex gap-8 md:gap-12 group"
                  >
                    <div className="w-32 md:w-48 aspect-[3/4] bg-secondary/10 flex-shrink-0 overflow-hidden relative group-hover:shadow-2xl transition-all duration-700">
                      <img 
                        src={item.product.image || item.product.images?.[0] || '/placeholder.svg'} 
                        alt={item.product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between py-2">
                      <div className="space-y-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <Link
                              to={`/product/${item.product.id}`}
                              className="text-2xl font-display font-medium italic tracking-tight hover:text-primary transition-colors"
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-[10px] font-black tracking-[0.3em] text-muted-foreground/60 uppercase">
                                SIZE: {item.selectedSize} / COLOR: {item.selectedColor}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              removeItem(item.product.id, item.selectedSize, item.selectedColor)
                            }
                            className="text-muted-foreground/40 hover:text-destructive transition-colors"
                          >
                            <X className="h-4 w-4" strokeWidth={1.5} />
                          </button>
                        </div>

                        <div className="flex items-center gap-8">
                           <div className="flex items-center border border-border/40">
                             <button
                               onClick={() =>
                                 updateQuantity(
                                   item.product.id,
                                   item.selectedSize,
                                   item.selectedColor,
                                   item.quantity - 1
                                 )
                               }
                               className="px-4 py-3 hover:bg-secondary/10 transition-colors disabled:opacity-20"
                               disabled={item.quantity <= 1}
                             >
                               <Minus className="h-3 w-3" strokeWidth={3} />
                             </button>
                             <span className="w-12 text-center text-[11px] font-black">{item.quantity}</span>
                             <button
                               onClick={() =>
                                 updateQuantity(
                                   item.product.id,
                                   item.selectedSize,
                                   item.selectedColor,
                                   item.quantity + 1
                                 )
                               }
                               className="px-4 py-3 hover:bg-secondary/10 transition-colors"
                             >
                               <Plus className="h-3 w-3" strokeWidth={3} />
                             </button>
                           </div>
                           <p className="text-xl font-display font-bold text-primary tracking-tighter">
                             {formatPrice(item.product.price * item.quantity)}
                           </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions Area */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-border/40">
                <button
                  onClick={clearCart}
                  className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground/40 hover:text-destructive transition-colors border-b border-transparent hover:border-destructive/20 pb-1"
                >
                  PURGE SELECTION
                </button>
                <Button variant="outline" className="rounded-none border-primary/20 text-primary hover:bg-primary/5 text-[10px] font-bold tracking-[0.3em] uppercase px-8 h-12" asChild>
                  <Link to="/products">CONTINUE EXPLORING</Link>
                </Button>
              </div>
            </div>

            {/* Order summary sidebar */}
            <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-12 bg-secondary/5 p-10 border border-border/40 shadow-2xl">
                <div className="space-y-2">
                    <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-secondary">ORDER SUMMARY</h2>
                    <div className="h-px w-8 bg-primary/20" />
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground">SUBTOTAL</span>
                    <span className="text-sm font-bold tracking-tighter">{formatPrice(totalPrice)}</span>
                  </div>
                  {state.coupon && (
                      <div className="flex justify-between items-baseline text-primary">
                        <span className="text-[10px] font-bold tracking-[0.3em] uppercase">PRIVILEGE ({state.coupon.code})</span>
                        <span className="text-sm font-bold tracking-tighter">-{formatPrice(totalPrice - discountedPrice)}</span>
                      </div>
                  )}
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground">LOGISTICS</span>
                    <span className="text-sm font-bold tracking-tighter">{freeShipping ? 'COMPLIMENTARY' : 'ESTIMATED AT CHECKOUT'}</span>
                  </div>
                </div>

                {/* Promo Code Input */}
                <div className="space-y-4">
                  <Label className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">PROMO CODE</Label>
                  {state.coupon ? (
                      <div className="flex items-center justify-between bg-primary/5 p-4 border border-primary/20">
                          <div>
                              <p className="text-[10px] font-black tracking-widest text-primary uppercase">{state.coupon.code}</p>
                              <p className="text-[9px] font-bold text-primary/60 uppercase">AUTHORIZED {state.coupon.discount}% REDUCTION</p>
                          </div>
                          <button onClick={removeCoupon} className="text-primary hover:scale-110 transition-transform">
                              <X className="h-4 w-4" strokeWidth={3} />
                          </button>
                      </div>
                  ) : (
                      <div className="relative group">
                        <input
                          type="text"
                          placeholder="ENTER CODE"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="w-full bg-transparent border-0 border-b border-border/60 rounded-none px-0 py-4 text-[11px] font-bold tracking-widest focus:outline-none focus:border-primary transition-all uppercase placeholder:text-muted-foreground/20"
                        />
                        <button 
                            disabled={!couponCode || isApplyingCoupon}
                            onClick={async () => {
                                setIsApplyingCoupon(true);
                                try {
                                    await applyCoupon(couponCode);
                                    setCouponCode('');
                                } catch (e) { /* Error handled in context */ }
                                finally { setIsApplyingCoupon(false); }
                            }}
                            className="absolute right-0 bottom-4 text-[10px] font-black tracking-widest uppercase text-primary disabled:opacity-20"
                        >
                            {isApplyingCoupon ? '...' : 'APPLY'}
                        </button>
                      </div>
                  )}
                </div>

                <div className="space-y-6 pt-12 border-t border-border/40">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[11px] font-black tracking-[0.4em] uppercase">TOTAL ESTIMATE</span>
                    <span className="text-3xl font-display font-bold text-primary tracking-tighter">{formatPrice(discountedPrice)}</span>
                  </div>
                  <p className="text-[9px] font-bold tracking-widest text-muted-foreground/40 uppercase leading-relaxed italic text-center">
                    Including all statutory levies. Global logistics calculated during authorization.
                  </p>
                </div>

                <Button size="xl" className="w-full h-20 bg-primary hover:bg-primary/90 text-white rounded-none text-[11px] font-bold tracking-[0.5em] uppercase shadow-2xl transition-all" asChild>
                  <Link to="/checkout">
                    AUTHORIZE CHECKOUT
                    <ArrowRight className="ml-4 h-4 w-4" />
                  </Link>
                </Button>

                <div className="pt-8 text-center space-y-4">
                  <p className="text-[8px] font-black tracking-[0.4em] text-muted-foreground/40 uppercase">SECURE TRANSACTIONS THROUGH RAZORPAY & SSL</p>
                </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
