import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function CartDrawer() {
  const { state, closeCart, removeItem, updateQuantity, totalPrice, calculateItemUnitPrice } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      {/* Overlay - Sophisticated Blur */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-700",
          state.isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={closeCart}
      />

      {/* Drawer - Editorial Aesthetic */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-md bg-background z-50 shadow-[0_0_100px_rgba(0,0,0,0.2)] transition-all duration-700 ease-in-out flex flex-col",
          state.isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-10 border-b border-border/40">
          <div className="space-y-1">
            <h2 className="text-xl font-display font-medium uppercase tracking-[0.2em]">Your Bag</h2>
            <p className="text-[10px] font-bold tracking-[0.3em] text-muted-foreground uppercase">{state.items.length} Elements Selected</p>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:text-primary transition-all duration-300 hover:rotate-90"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-10 py-6 scrollbar-hide">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
              <div className="w-20 h-20 bg-secondary/5 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-muted-foreground/30" strokeWidth={1} />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-display italic">Your bag is empty</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground max-w-[200px] mx-auto leading-relaxed">
                  Discover our collections and find your next masterpiece
                </p>
              </div>
              <Link 
                to="/products" 
                onClick={closeCart}
                className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary border-b border-primary/40 pb-1 hover:border-primary transition-all pt-4"
              >
                Explore Everything
              </Link>
            </div>
          ) : (
            <div className="space-y-10 py-4">
              {state.items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                  className="flex gap-8 group"
                >
                  <div className="w-24 h-32 bg-secondary/5 overflow-hidden transition-shadow duration-500 group-hover:shadow-xl">
                    <img
                      src={item.product.image || item.product.images?.[0] || '/placeholder.svg'}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <h3 className="font-bold text-[11px] uppercase tracking-widest line-clamp-2 leading-tight group-hover:text-primary transition-colors italic">{item.product.name}</h3>
                        <p className="text-[9px] font-black tracking-[0.2em] text-muted-foreground uppercase">
                          Size: {item.selectedSize} / {item.selectedColor}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          removeItem(item.product.id, item.selectedSize, item.selectedColor)
                        }
                        className="text-muted-foreground/40 hover:text-primary transition-colors"
                        aria-label="Remove item"
                      >
                        <X className="h-4 w-4" strokeWidth={1.5} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4">
                      <div className="flex items-center border border-border/60 h-10 px-2 bg-secondary/5">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.selectedSize,
                              item.selectedColor,
                              item.quantity - 1
                            )
                          }
                          className="p-1 hover:text-primary transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-4 text-[10px] font-bold">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.selectedSize,
                              item.selectedColor,
                              item.quantity + 1
                            )
                          }
                          className="p-1 hover:text-primary transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="font-bold text-sm tracking-tighter">
                        {formatPrice(calculateItemUnitPrice(item) * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - High Impact Checkout */}
        {state.items.length > 0 && (
          <div className="border-t border-border/40 p-10 space-y-8 bg-background">
            <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                    <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-muted-foreground">Estimate Total</span>
                    <span className="text-2xl font-display font-bold text-primary">{formatPrice(totalPrice)}</span>
                </div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 leading-relaxed italic text-right">
                    Shipping & taxes calculated at checkout.
                </p>
            </div>
            
            <div className="flex flex-col gap-4">
                <Link to="/checkout" onClick={closeCart}>
                    <Button size="xl" className="w-full h-16 bg-primary hover:bg-primary/90 text-white rounded-none text-[10px] font-bold tracking-[0.4em] uppercase shadow-2xl transition-all">
                        Proceed to Checkout
                    </Button>
                </Link>
                <Link to="/cart" onClick={closeCart} className="text-center">
                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground hover:text-primary transition-colors border-b border-border/60 pb-1">
                        Refine Selection
                    </span>
                </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
