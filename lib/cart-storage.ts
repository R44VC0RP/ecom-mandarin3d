import { Cart, CartLine } from './types/cart';

const CART_STORAGE_KEY = 'mandarin3d_cart';

export interface StoredCart extends Omit<Cart, 'id'> {
  id?: string;
}

export const cartStorage = {
  get: (): StoredCart | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const cart = localStorage.getItem(CART_STORAGE_KEY);
      return cart ? JSON.parse(cart) : null;
    } catch (error) {
      console.error('Error reading cart from localStorage:', error);
      return null;
    }
  },

  set: (cart: StoredCart) => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  },

  remove: () => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error('Error removing cart from localStorage:', error);
    }
  },

  merge: (serverCart: Cart | undefined, localCart: StoredCart | null): StoredCart => {
    if (!localCart) return serverCart || createEmptyCart();
    if (!serverCart) return localCart;

    // Merge lines from both carts
    const mergedLines = [...serverCart.lines];
    
    localCart.lines.forEach((localLine) => {
      const existingLine = mergedLines.find(
        (line) => line.merchandise.id === localLine.merchandise.id
      );

      if (existingLine) {
        // Update quantity if item exists
        existingLine.quantity += localLine.quantity;
        // Merge print settings if they exist
        if (localLine.printSettings) {
          existingLine.printSettings = {
            ...existingLine.printSettings,
            ...localLine.printSettings,
          };
        }
      } else {
        // Add new line if item doesn't exist
        mergedLines.push(localLine);
      }
    });

    return {
      ...serverCart,
      lines: mergedLines,
      totalQuantity: mergedLines.reduce((sum, line) => sum + line.quantity, 0),
      cost: calculateCartCost(mergedLines),
    };
  }
};

function createEmptyCart(): StoredCart {
  return {
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

function calculateCartCost(lines: CartLine[]) {
  const subtotalAmount = lines.reduce(
    (sum, line) => sum + (Number(line.merchandise.price.amount) * line.quantity),
    0
  ).toString();

  return {
    id: '',
    subtotalAmount: { id: '', amount: subtotalAmount, currencyCode: 'USD' },
    totalAmount: { id: '', amount: subtotalAmount, currencyCode: 'USD' }, // We'll add tax calculation later
    totalTaxAmount: { id: '', amount: '0', currencyCode: 'USD' }
  };
} 