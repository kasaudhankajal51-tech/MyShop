import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Product } from '@/data/products';
import { useAuth } from './AuthContext';
import api from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  pricingTiers?: { minQuantity: number; maxQuantity?: number; pricePerUnit: number }[];
}

interface Coupon {
  code: string;
  discount: number; // Percentage or absolute amount? Let's assume percentage for now based on controller
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  coupon: Coupon | null;
}

type CartAction =
  | { type: 'SET_CART'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; size: string; color: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; size: string; color: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'SET_COUPON'; payload: Coupon }
  | { type: 'REMOVE_COUPON' };

const initialState: CartState = {
  items: [],
  isOpen: false,
  coupon: null,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, items: action.payload };

    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        (item) =>
          item.product.id === action.payload.product.id &&
          item.selectedSize === action.payload.selectedSize &&
          item.selectedColor === action.payload.selectedColor
      );

      if (existingIndex > -1) {
        const newItems = [...state.items];
        newItems[existingIndex].quantity += action.payload.quantity;
        return { ...state, items: newItems };
      }

      return { ...state, items: [...state.items, action.payload] };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
          (item) =>
            !(
              item.product.id === action.payload.productId &&
              item.selectedSize === action.payload.size &&
              item.selectedColor === action.payload.color
            )
        ),
      };

    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map((item) => {
        if (
          item.product.id === action.payload.productId &&
          item.selectedSize === action.payload.size &&
          item.selectedColor === action.payload.color
        ) {
          return { ...item, quantity: action.payload.quantity };
        }
        return item;
      });
      return { ...state, items: newItems };
    }

    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };

    case 'OPEN_CART':
      return { ...state, isOpen: true };

    case 'CLOSE_CART':
      return { ...state, isOpen: false };

    case 'SET_COUPON':
      return { ...state, coupon: action.payload };

    case 'REMOVE_COUPON':
      return { ...state, coupon: null };

    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  addItem: (product: Product, quantity: number, size: string, color: string) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => void;
  totalItems: number;
  totalPrice: number;
  discountedPrice: number;
  calculateItemUnitPrice: (item: CartItem) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load cart from localStorage on mount (for guest)
  useEffect(() => {
    if (!user) {
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
            try {
                dispatch({ type: 'SET_CART', payload: JSON.parse(savedCart) });
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }
  }, [user]);

  // Sync with backend on login
  useEffect(() => {
    const syncCart = async () => {
        if (user) {
            try {
                // Get local items to sync
                const localItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
                
                const { data } = await api.post('/cart/sync', { items: localItems });
                
                // Map backend response to frontend structure
                const mappedItems = data.items.map((item: any) => ({
                    product: {
                        id: item.product._id,
                        name: item.product.name,
                        price: item.product.price,
                        image: item.product.image,
                        category: item.product.category,
                        description: item.product.description
                    },
                    quantity: item.quantity,
                    selectedSize: item.selectedSize,
                    selectedColor: item.selectedColor
                }));

                dispatch({ type: 'SET_CART', payload: mappedItems });
                // Clear local storage after sync
                localStorage.removeItem('cartItems');
            } catch (error) {
                console.error("Failed to sync cart", error);
                // Fallback to local if sync fails? Or just fetch remote?
                // For now, let's try to just fetch remote if sync failed
                try {
                     const { data } = await api.get('/cart');
                     const mappedItems = data.items.map((item: any) => ({
                        product: {
                            id: item.product._id,
                            name: item.product.name,
                            price: item.product.price,
                            image: item.product.image,
                            category: item.product.category,
                            description: item.product.description
                        },
                        quantity: item.quantity,
                        selectedSize: item.selectedSize,
                        selectedColor: item.selectedColor
                    }));
                    dispatch({ type: 'SET_CART', payload: mappedItems });
                } catch (fetchError) {
                    console.error("Failed to fetch cart", fetchError);
                }
            }
        }
    };

    if (user) {
        syncCart();
    }
  }, [user]);

  // Save to localStorage when items change (for guests)
  useEffect(() => {
    if (!user) {
        localStorage.setItem('cartItems', JSON.stringify(state.items));
    }
  }, [state.items, user]);


  const addItem = async (product: Product, quantity: number, size: string, color: string) => {
    // Optimistic update
    dispatch({
      type: 'ADD_ITEM',
      payload: { 
        product, 
        quantity, 
        selectedSize: size, 
        selectedColor: color,
        pricingTiers: product.pricingTiers 
      },
    });

    if (user) {
        try {
            await api.post('/cart', {
                productId: product.id || product._id,
                quantity,
                size,
                color
            });
        } catch (error) {
            console.error("Failed to add to cart backend", error);
            toast({
                title: "Error",
                description: "Failed to save to cart on server",
                variant: 'destructive'
            });
        }
    }
  };

  const removeItem = async (productId: string, size: string, color: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId, size, color } });

    if (user) {
        try {
            await api.delete('/cart', {
                data: { productId, size, color }
            });
        } catch (error) {
             console.error("Failed to remove from cart backend", error);
        }
    }
  };

  const updateQuantity = async (productId: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, size, color);
      return;
    } 
    
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, size, color, quantity } });

    if (user) {
        try {
            await api.put('/cart', {
                productId,
                quantity,
                size,
                color
            });
        } catch (error) {
             console.error("Failed to update cart backend", error);
        }
    }
  };

  const clearCart = async () => {
      dispatch({ type: 'CLEAR_CART' });
      if (user) {
          try {
              await api.delete('/cart/clear');
          } catch(error) {
              console.error("Failed to clear cart backend", error);
          }
      } else {
          localStorage.removeItem('cartItems');
      }
  };

  const toggleCart = () => dispatch({ type: 'TOGGLE_CART' });
  const openCart = () => dispatch({ type: 'OPEN_CART' });
  const closeCart = () => dispatch({ type: 'CLOSE_CART' });

  const applyCoupon = async (code: string) => {
    try {
        const { data } = await api.post('/coupons/validate', { couponCode: code });
        dispatch({ type: 'SET_COUPON', payload: { code: data.name, discount: data.discount } });
        toast({
            title: "Coupon Applied",
            description: `${data.discount}% discount applied!`,
        });
    } catch (error: any) {
        toast({
            title: "Invalid Coupon",
            description: error.response?.data?.message || "Failed to apply coupon",
            variant: "destructive"
        });
        throw error;
    }
  };

  const removeCoupon = () => {
      dispatch({ type: 'REMOVE_COUPON' });
      toast({ title: "Coupon Removed" });
  };

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const calculateItemUnitPrice = (item: CartItem) => {
     if (item.pricingTiers && item.pricingTiers.length > 0) {
         // Sort tiers by minQuantity desc to find the matching tier
         const sortedTiers = [...item.pricingTiers].sort((a, b) => b.minQuantity - a.minQuantity);
         const activeTier = sortedTiers.find(tier => item.quantity >= tier.minQuantity);
         return activeTier ? activeTier.pricePerUnit : item.product.price;
     }
     return item.product.price;
  };

  const totalPrice = state.items.reduce(
    (sum, item) => sum + calculateItemUnitPrice(item) * item.quantity,
    0
  );
  
  const discountedPrice = state.coupon 
    ? totalPrice - (totalPrice * state.coupon.discount / 100) 
    : totalPrice;

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
        applyCoupon,
        removeCoupon,
        totalItems,
        totalPrice,
        discountedPrice,
        calculateItemUnitPrice: (item: CartItem) => {
             if (item.pricingTiers && item.pricingTiers.length > 0) {
                 const sortedTiers = [...item.pricingTiers].sort((a, b) => b.minQuantity - a.minQuantity);
                 const activeTier = sortedTiers.find(tier => item.quantity >= tier.minQuantity);
                 return activeTier ? activeTier.pricePerUnit : item.product.price;
             }
             return item.product.price;
        }
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
