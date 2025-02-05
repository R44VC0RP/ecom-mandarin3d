'use client';

import { Product, ProductVariant } from 'lib/types';
import { Cart, CartLine } from 'lib/types/cart';
import React, { createContext, startTransition, use, useContext, useMemo, useOptimistic } from 'react';

type UpdateType = 'plus' | 'minus' | 'delete';

type CartAction =
  | { type: 'UPDATE_ITEM'; payload: { merchandiseId: string; updateType: UpdateType } }
  | { type: 'ADD_ITEM'; payload: { variant: ProductVariant; product: Product } };

type CartContextType = {
  cart: Cart | undefined;
  updateCartItem: (merchandiseId: string, updateType: UpdateType) => void;
  addCartItem: (variant: ProductVariant, product: Product) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function calculateItemCost(quantity: number, price: string): string {
  return (Number(price) * quantity).toString();
}

function updateCartItem(item: CartLine, updateType: UpdateType): CartLine | null {
  if (updateType === 'delete') return null;

  const newQuantity = updateType === 'plus' ? item.quantity + 1 : item.quantity - 1;
  if (newQuantity === 0) return null;

  return {
    ...item,
    quantity: newQuantity
  };
}

function createOrUpdateCartItem(
  existingItem: CartLine | undefined,
  variant: ProductVariant,
  product: Product
): CartLine {
  return {
    id: existingItem?.id || '',
    quantity: existingItem ? existingItem.quantity + 1 : 1,
    merchandise: {
      id: variant.id,
      title: variant.title,
      price: variant.price,
      product: {
        id: product.id,
        handle: product.handle,
        title: product.title,
        featuredImage: product.featuredImage
      }
    }
  };
}

function updateCartTotals(lines: CartLine[]): Pick<Cart, 'totalQuantity' | 'cost'> {
  const totalQuantity = lines.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = lines.reduce((sum, item) => sum + Number(item.merchandise.price.amount) * item.quantity, 0);
  const currencyCode = lines[0]?.merchandise.price.currencyCode ?? 'USD';

  return {
    totalQuantity,
    cost: {
      id: '',
      subtotalAmount: { id: '', amount: totalAmount.toString(), currencyCode },
      totalAmount: { id: '', amount: totalAmount.toString(), currencyCode },
      totalTaxAmount: { id: '', amount: '0', currencyCode }
    }
  };
}

function createEmptyCart(): Cart {
  return {
    id: undefined,
    totalQuantity: 0,
    lines: [],
    cost: {
      id: '',
      subtotalAmount: { id: '', amount: '0', currencyCode: 'USD' },
      totalAmount: { id: '', amount: '0', currencyCode: 'USD' },
      totalTaxAmount: { id: '', amount: '0', currencyCode: 'USD' }
    }
  };
}

function cartReducer(state: Cart | undefined, action: CartAction): Cart {
  const currentCart = state || createEmptyCart();

  switch (action.type) {
    case 'UPDATE_ITEM': {
      const { merchandiseId, updateType } = action.payload;
      const updatedLines = currentCart.lines
        .map((item) =>
          item.merchandise.id === merchandiseId ? updateCartItem(item, updateType) : item
        )
        .filter(Boolean) as CartLine[];

      if (updatedLines.length === 0) {
        return createEmptyCart();
      }

      return { ...currentCart, ...updateCartTotals(updatedLines), lines: updatedLines };
    }
    case 'ADD_ITEM': {
      const { variant, product } = action.payload;
      const existingItem = currentCart.lines.find((item) => item.merchandise.id === variant.id);
      const updatedItem = createOrUpdateCartItem(existingItem, variant, product);

      const updatedLines = existingItem
        ? currentCart.lines.map((item) => (item.merchandise.id === variant.id ? updatedItem : item))
        : [...currentCart.lines, updatedItem];

      return { ...currentCart, ...updateCartTotals(updatedLines), lines: updatedLines };
    }
    default:
      return currentCart;
  }
}

export function CartProvider({
  children,
  cartPromise
}: {
  children: React.ReactNode;
  cartPromise: Promise<Cart | undefined>;
}) {
  const initialCart = use(cartPromise);
  const [optimisticCart, updateOptimisticCart] = useOptimistic(initialCart, cartReducer);

  const updateCartItem = (merchandiseId: string, updateType: UpdateType) => {
    startTransition(() => {
      updateOptimisticCart({ type: 'UPDATE_ITEM', payload: { merchandiseId, updateType } });
    });
  };

  const addCartItem = (variant: ProductVariant, product: Product) => {
    startTransition(() => {
      updateOptimisticCart({ type: 'ADD_ITEM', payload: { variant, product } });
    });
  };

  const value = useMemo(
    () => ({
      cart: optimisticCart,
      updateCartItem,
      addCartItem
    }),
    [optimisticCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
