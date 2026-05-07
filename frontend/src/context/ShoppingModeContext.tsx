import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

type ShoppingMode = 'retail' | 'wholesale';

interface ShoppingModeContextType {
  mode: ShoppingMode;
  toggleMode: () => void;
  setMode: (mode: ShoppingMode) => void;
  isWholesaleActive: boolean;
  getEffectivePrice: (product: any) => number;
}

const ShoppingModeContext = createContext<ShoppingModeContextType | undefined>(undefined);

export function ShoppingModeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [mode] = useState<ShoppingMode>('retail');

  // Logic simplified as wholesale is removed
  const toggleMode = () => {
    // No-op
  };

  const setMode = () => {
     // No-op
  }

  const isWholesaleActive = false;

  const getEffectivePrice = (product: any) => {
    return product.price;
  };

  return (
    <ShoppingModeContext.Provider value={{ mode, toggleMode, setMode, isWholesaleActive, getEffectivePrice }}>
      {children}
    </ShoppingModeContext.Provider>
  );
}

export function useShoppingMode() {
  const context = useContext(ShoppingModeContext);
  if (context === undefined) {
    throw new Error('useShoppingMode must be used within a ShoppingModeProvider');
  }
  return context;
}
