'use client';

import { CartManager } from 'lib/cart-manager';
import { Product, ProductVariant } from 'lib/types';
import { Cart } from 'lib/types/cart';
import { createContext, useContext, useEffect, useState } from 'react';

interface CartContextType {
  cart: Cart;
  addCartItem: (variant: ProductVariant, product: Product) => void;
  removeCartItem: (variantId: string) => void;
  updateCartItemQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>(CartManager.getCart());

  useEffect(() => {
    // Initialize cart from local storage
    setCart(CartManager.getCart());
  }, []);

  const addCartItem = (variant: ProductVariant, product: Product) => {
    const updatedCart = CartManager.addItem(product, variant);
    setCart(updatedCart);
  };

  const removeCartItem = (variantId: string) => {
    const updatedCart = CartManager.removeItem(variantId);
    setCart(updatedCart);
  };

  const updateCartItemQuantity = (variantId: string, quantity: number) => {
    const updatedCart = CartManager.updateQuantity(variantId, quantity);
    setCart(updatedCart);
  };

  const clearCart = () => {
    const emptyCart = CartManager.clearCart();
    setCart(emptyCart);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addCartItem,
        removeCartItem,
        updateCartItemQuantity,
        clearCart
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
