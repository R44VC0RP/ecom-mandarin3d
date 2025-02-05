'use client';

import { CartManager } from 'lib/cart-manager';
import { Product, ProductVariant } from 'lib/types';
import { Cart } from 'lib/types/cart';
import { createContext, useContext, useEffect, useState } from 'react';

type CartContextType = {
  cart: Cart | undefined;
  isLoading: boolean;
  addCartItem: (variant: ProductVariant, product: Product) => Promise<void>;
  updateCartItem: (merchandiseId: string, action: 'plus' | 'minus' | 'delete') => Promise<void>;
  updatePrintSettings: (merchandiseId: string, layerHeight: number, infill: number) => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({
  children,
  cartPromise,
  userId
}: {
  children: React.ReactNode;
  cartPromise: Promise<Cart | undefined>;
  userId?: string;
}) {
  const [cart, setCart] = useState<Cart>();
  const [isLoading, setIsLoading] = useState(true);
  const [cartManager] = useState(() => new CartManager(userId));

  useEffect(() => {
    const initCart = async () => {
      try {
        const initialCart = await cartPromise;
        if (initialCart) {
          const mergedCart = await cartManager.getCart();
          setCart(mergedCart);
        } else {
          setCart(await cartManager.getCart());
        }
      } catch (error) {
        console.error('Error initializing cart:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initCart();
  }, [cartPromise, cartManager]);

  const addCartItem = async (variant: ProductVariant, product: Product) => {
    try {
      setIsLoading(true);
      const updatedCart = await cartManager.addItem(variant, product);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error adding item to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartItem = async (merchandiseId: string, action: 'plus' | 'minus' | 'delete') => {
    try {
      setIsLoading(true);
      const updatedCart = await cartManager.updateQuantity(merchandiseId, action);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error updating cart item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePrintSettings = async (merchandiseId: string, layerHeight: number, infill: number) => {
    try {
      setIsLoading(true);
      const updatedCart = await cartManager.updatePrintSettings(merchandiseId, layerHeight, infill);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error updating print settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addCartItem,
        updateCartItem,
        updatePrintSettings
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
