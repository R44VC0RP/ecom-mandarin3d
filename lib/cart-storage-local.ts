import { CartStorage } from './cart';
import { Cart } from './types/cart';

const CART_STORAGE_KEY = 'mandarin3d_cart';

export class LocalStorageAdapter implements CartStorage {
  async get(): Promise<Cart | null> {
    if (typeof window === 'undefined') return null;
    
    try {
      const cartData = localStorage.getItem(CART_STORAGE_KEY);
      return cartData ? JSON.parse(cartData) : null;
    } catch (error) {
      console.error('Error reading cart from localStorage:', error);
      return null;
    }
  }

  async set(cart: Cart): Promise<void> {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
      throw new Error('Failed to save cart to local storage');
    }
  }

  async remove(): Promise<void> {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error('Error removing cart from localStorage:', error);
      throw new Error('Failed to remove cart from local storage');
    }
  }

  async merge(serverCart: Cart | undefined, localCart: Cart | null): Promise<Cart> {
    if (!localCart) return serverCart || this.createEmptyCart();
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

    // Create merged cart with updated lines
    const mergedCart: Cart = {
      ...serverCart,
      lines: mergedLines,
      totalQuantity: mergedLines.reduce((sum, line) => sum + line.quantity, 0)
    };

    // Save merged cart to local storage
    await this.set(mergedCart);

    return mergedCart;
  }

  private createEmptyCart(): Cart {
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
} 