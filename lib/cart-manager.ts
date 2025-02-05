import { DefaultCartCalculator } from './cart-calculator';
import { LocalStorageAdapter } from './cart-storage-local';
import { PrismaStorageAdapter } from './cart-storage-prisma';
import { Product, ProductVariant } from './types';
import { Cart } from './types/cart';

export class CartManager {
  private localStorageAdapter: LocalStorageAdapter;
  private serverStorageAdapter: PrismaStorageAdapter | null;
  private calculator: DefaultCartCalculator;

  constructor(userId?: string) {
    this.localStorageAdapter = new LocalStorageAdapter();
    this.serverStorageAdapter = userId ? new PrismaStorageAdapter(userId) : null;
    this.calculator = new DefaultCartCalculator();
  }

  async getCart(): Promise<Cart> {
    try {
      // In the browser, only use local storage
      if (typeof window !== 'undefined') {
        const localCart = await this.localStorageAdapter.get();
        return localCart || this.createEmptyCart();
      }

      // On the server, try to get both carts and merge
      const [localCart, serverCart] = await Promise.all([
        this.localStorageAdapter.get(),
        this.serverStorageAdapter?.get() ?? Promise.resolve(null)
      ]);

      // If we have a server cart, merge it with local cart
      if (this.serverStorageAdapter && serverCart) {
        return this.serverStorageAdapter.merge(serverCart, localCart);
      }

      // Otherwise, return local cart or create new one
      return localCart || this.createEmptyCart();
    } catch (error) {
      console.error('Error getting cart:', error);
      return this.createEmptyCart();
    }
  }

  async addItem(variant: ProductVariant, product: Product): Promise<Cart> {
    const currentCart = await this.getCart();
    const existingLine = currentCart.lines.find(line => line.merchandise.id === variant.id);

    const updatedLines = existingLine
      ? currentCart.lines.map(line =>
          line.merchandise.id === variant.id
            ? { ...line, quantity: line.quantity + 1 }
            : line
        )
      : [
          ...currentCart.lines,
          {
            id: '',
            quantity: 1,
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
            },
            printSettings: {
              layerHeight: 0.2,
              infill: 20
            }
          }
        ];

    return this.updateCart({
      ...currentCart,
      lines: updatedLines,
      totalQuantity: updatedLines.reduce((sum, line) => sum + line.quantity, 0)
    });
  }

  async updateQuantity(
    merchandiseId: string, 
    action: 'plus' | 'minus' | 'delete' | 'set',
    quantity?: number
  ): Promise<Cart> {
    const currentCart = await this.getCart();

    const updatedLines = currentCart.lines
      .map(line => {
        if (line.merchandise.id !== merchandiseId) return line;
        
        if (action === 'delete') return null;
        if (action === 'set' && quantity !== undefined) {
          return quantity > 0 ? { ...line, quantity } : null;
        }
        
        const newQuantity = action === 'plus' 
          ? line.quantity + 1 
          : line.quantity - 1;
        
        return newQuantity > 0 ? { ...line, quantity: newQuantity } : null;
      })
      .filter((line): line is NonNullable<typeof line> => line !== null);

    return this.updateCart({
      ...currentCart,
      lines: updatedLines,
      totalQuantity: updatedLines.reduce((sum, line) => sum + line.quantity, 0)
    });
  }

  async updatePrintSettings(
    merchandiseId: string,
    layerHeight: number,
    infill: number
  ): Promise<Cart> {
    const currentCart = await this.getCart();

    const updatedLines = currentCart.lines.map(line =>
      line.merchandise.id === merchandiseId
        ? {
            ...line,
            printSettings: {
              layerHeight,
              infill
            }
          }
        : line
    );

    return this.updateCart({
      ...currentCart,
      lines: updatedLines,
      totalQuantity: updatedLines.reduce((sum, line) => sum + line.quantity, 0)
    });
  }

  private async updateCart(cart: Cart): Promise<Cart> {
    // Calculate totals
    const subtotal = this.calculator.calculateSubtotal(cart.lines);
    const tax = this.calculator.calculateTax(subtotal);
    const total = this.calculator.calculateTotal(subtotal, tax);

    const updatedCart: Cart = {
      ...cart,
      totalQuantity: cart.lines.reduce((sum, line) => sum + line.quantity, 0),
      cost: {
        id: cart.cost.id,
        subtotalAmount: subtotal,
        totalAmount: total,
        totalTaxAmount: tax
      }
    };

    // In browser, only update local storage
    if (typeof window !== 'undefined') {
      await this.localStorageAdapter.set(updatedCart);
      return updatedCart;
    }

    // On server, update both storages
    await Promise.all([
      this.localStorageAdapter.set(updatedCart),
      this.serverStorageAdapter?.set(updatedCart)
    ]);

    return updatedCart;
  }

  private createEmptyCart(): Cart {
    return {
      totalQuantity: 0,
      lines: [],
      cost: {
        id: '',
        subtotalAmount: {
          id: '',
          amount: '0',
          currencyCode: 'USD'
        },
        totalAmount: {
          id: '',
          amount: '0',
          currencyCode: 'USD'
        },
        totalTaxAmount: {
          id: '',
          amount: '0',
          currencyCode: 'USD'
        }
      }
    };
  }
} 