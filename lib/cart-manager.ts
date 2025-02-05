import { Product, ProductVariant } from './types';
import { Cart, CartItem } from './types/cart';

const CART_STORAGE_KEY = 'mandarin3d_cart';

const createEmptyCart = (): Cart => ({
  items: [],
  totalItems: 0,
  totalPrice: 0
});

const calculateCartTotals = (items: CartItem[]): { totalItems: number; totalPrice: number } => {
  return items.reduce(
    (acc, item) => ({
      totalItems: acc.totalItems + item.quantity,
      totalPrice: acc.totalPrice + item.price * item.quantity
    }),
    { totalItems: 0, totalPrice: 0 }
  );
};

export const CartManager = {
  getCart: (): Cart => {
    if (typeof window === 'undefined') return createEmptyCart();
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return createEmptyCart();
    try {
      return JSON.parse(stored);
    } catch {
      return createEmptyCart();
    }
  },

  saveCart: (cart: Cart) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  },

  addItem: (product: Product, variant: ProductVariant): Cart => {
    const cart = CartManager.getCart();
    const existingItemIndex = cart.items.findIndex(item => item.variantId === variant.id);

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      cart.items[existingItemIndex].quantity += 1;
    } else {
      // Add new item
      cart.items.push({
        productId: product.id,
        variantId: variant.id,
        quantity: 1,
        title: product.title,
        price: parseFloat(variant.price.amount),
        image: product.featuredImage ? {
          url: product.featuredImage.url,
          altText: product.featuredImage.altText
        } : undefined
      });
    }

    const totals = calculateCartTotals(cart.items);
    cart.totalItems = totals.totalItems;
    cart.totalPrice = totals.totalPrice;

    CartManager.saveCart(cart);
    return cart;
  },

  removeItem: (variantId: string): Cart => {
    const cart = CartManager.getCart();
    cart.items = cart.items.filter(item => item.variantId !== variantId);
    
    const totals = calculateCartTotals(cart.items);
    cart.totalItems = totals.totalItems;
    cart.totalPrice = totals.totalPrice;

    CartManager.saveCart(cart);
    return cart;
  },

  updateQuantity: (variantId: string, quantity: number): Cart => {
    const cart = CartManager.getCart();
    const itemIndex = cart.items.findIndex(item => item.variantId === variantId);
    
    if (itemIndex > -1) {
      if (quantity <= 0) {
        return CartManager.removeItem(variantId);
      }
      cart.items[itemIndex].quantity = quantity;
      
      const totals = calculateCartTotals(cart.items);
      cart.totalItems = totals.totalItems;
      cart.totalPrice = totals.totalPrice;

      CartManager.saveCart(cart);
    }
    
    return cart;
  },

  clearCart: (): Cart => {
    const emptyCart = createEmptyCart();
    CartManager.saveCart(emptyCart);
    return emptyCart;
  }
}; 