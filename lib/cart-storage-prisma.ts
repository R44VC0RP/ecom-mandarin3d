import { CartStorage } from './cart';
import { prisma } from './prisma';
import { Cart } from './types/cart';

export class PrismaStorageAdapter implements CartStorage {
  private userId?: string;

  constructor(userId?: string) {
    this.userId = userId;
  }

  private isBrowser() {
    return typeof window !== 'undefined';
  }

  async get(): Promise<Cart | null> {
    if (this.isBrowser()) {
      console.warn('Attempted to use PrismaStorageAdapter in browser');
      return null;
    }

    if (!this.userId) return null;

    try {
      const cart = await prisma.cart.findUnique({
        where: { userId: this.userId },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  price: true,
                  product: {
                    include: {
                      images: true,
                      featuredImage: true,
                    },
                  },
                },
              },
              totalAmount: true,
            },
          },
          subtotalAmount: true,
          totalAmount: true,
          totalTaxAmount: true,
        },
      });

      if (!cart) return null;

      // Ensure we have valid money objects
      const subtotalAmount = cart.subtotalAmount || { id: '', amount: '0', currencyCode: 'USD' };
      const totalAmount = cart.totalAmount || { id: '', amount: '0', currencyCode: 'USD' };
      const totalTaxAmount = cart.totalTaxAmount || { id: '', amount: '0', currencyCode: 'USD' };

      return {
        id: cart.id,
        totalQuantity: cart.totalQuantity,
        lines: cart.items
          .filter(item => item.variant !== null)
          .map(item => ({
            id: item.id,
            quantity: item.quantity,
            merchandise: {
              id: item.variant!.id,
              title: item.variant!.title,
              selectedOptions: typeof item.variant!.selectedOptions === 'string'
                ? JSON.parse(item.variant!.selectedOptions)
                : item.variant!.selectedOptions,
              price: item.variant!.price,
              product: {
                id: item.variant!.product.id,
                handle: item.variant!.product.handle,
                title: item.variant!.product.title,
                featuredImage: item.variant!.product.featuredImage,
              },
            },
            printSettings: {
              layerHeight: item.layerHeight,
              infill: item.infill,
            },
          })),
        cost: {
          id: cart.id,
          subtotalAmount,
          totalAmount,
          totalTaxAmount,
        },
      };
    } catch (error) {
      console.error('Error fetching cart:', error);
      return null;
    }
  }

  async set(cart: Cart): Promise<void> {
    if (this.isBrowser()) {
      console.warn('Attempted to use PrismaStorageAdapter in browser');
      return;
    }

    if (!this.userId) throw new Error('User ID is required for server-side cart operations');
    if (!cart) throw new Error('Cart is required');

    try {
      await prisma.cart.upsert({
        where: { userId: this.userId },
        create: {
          userId: this.userId,
          totalQuantity: cart.totalQuantity,
          checkoutUrl: '',
          items: {
            create: cart.lines.map(line => ({
              quantity: line.quantity,
              product: { connect: { id: line.merchandise.product.id } },
              variant: { connect: { id: line.merchandise.id } },
              layerHeight: line.printSettings?.layerHeight ?? 0.2,
              infill: line.printSettings?.infill ?? 20,
              totalAmount: {
                create: {
                  amount: (Number(line.merchandise.price.amount) * line.quantity).toString(),
                  currencyCode: line.merchandise.price.currencyCode,
                },
              },
            })),
          },
        },
        update: {
          totalQuantity: cart.totalQuantity,
          items: {
            deleteMany: {},
            create: cart.lines.map(line => ({
              quantity: line.quantity,
              product: { connect: { id: line.merchandise.product.id } },
              variant: { connect: { id: line.merchandise.id } },
              layerHeight: line.printSettings?.layerHeight ?? 0.2,
              infill: line.printSettings?.infill ?? 20,
              totalAmount: {
                create: {
                  amount: (Number(line.merchandise.price.amount) * line.quantity).toString(),
                  currencyCode: line.merchandise.price.currencyCode,
                },
              },
            })),
          },
        },
      });

      // Update money records separately to avoid type issues
      if (cart.cost.subtotalAmount) {
        await prisma.money.upsert({
          where: { id: cart.cost.subtotalAmount.id || 'temp' },
          create: {
            amount: cart.cost.subtotalAmount.amount,
            currencyCode: cart.cost.subtotalAmount.currencyCode,
            cart: { connect: { userId: this.userId } },
          },
          update: {
            amount: cart.cost.subtotalAmount.amount,
            currencyCode: cart.cost.subtotalAmount.currencyCode,
          },
        });
      }

      if (cart.cost.totalAmount) {
        await prisma.money.upsert({
          where: { id: cart.cost.totalAmount.id || 'temp' },
          create: {
            amount: cart.cost.totalAmount.amount,
            currencyCode: cart.cost.totalAmount.currencyCode,
            cartTotal: { connect: { userId: this.userId } },
          },
          update: {
            amount: cart.cost.totalAmount.amount,
            currencyCode: cart.cost.totalAmount.currencyCode,
          },
        });
      }

      if (cart.cost.totalTaxAmount) {
        await prisma.money.upsert({
          where: { id: cart.cost.totalTaxAmount.id || 'temp' },
          create: {
            amount: cart.cost.totalTaxAmount.amount,
            currencyCode: cart.cost.totalTaxAmount.currencyCode,
            cartTax: { connect: { userId: this.userId } },
          },
          update: {
            amount: cart.cost.totalTaxAmount.amount,
            currencyCode: cart.cost.totalTaxAmount.currencyCode,
          },
        });
      }
    } catch (error) {
      console.error('Error setting cart:', error);
      throw new Error('Failed to update cart');
    }
  }

  async remove(): Promise<void> {
    if (this.isBrowser()) {
      console.warn('Attempted to use PrismaStorageAdapter in browser');
      return;
    }

    if (!this.userId) return;

    try {
      await prisma.cart.delete({
        where: { userId: this.userId },
      });
    } catch (error) {
      console.error('Error removing cart:', error);
      throw new Error('Failed to remove cart');
    }
  }

  async merge(serverCart: Cart | undefined, localCart: Cart | null): Promise<Cart> {
    if (this.isBrowser()) {
      console.warn('Attempted to use PrismaStorageAdapter in browser');
      return localCart || this.createEmptyCart();
    }

    if (!this.userId) throw new Error('User ID is required for cart merge');
    if (!localCart) return serverCart || this.createEmptyCart();

    const mergedLines = localCart.lines.map(line => {
      const serverLine = serverCart?.lines.find(
        sLine => sLine.merchandise.id === line.merchandise.id
      );

      if (serverLine) {
        return {
          ...line,
          quantity: line.quantity + serverLine.quantity,
          printSettings: {
            layerHeight: serverLine.printSettings?.layerHeight ?? line.printSettings?.layerHeight ?? 0.2,
            infill: serverLine.printSettings?.infill ?? line.printSettings?.infill ?? 20,
          },
        };
      }

      return {
        ...line,
        printSettings: {
          layerHeight: line.printSettings?.layerHeight ?? 0.2,
          infill: line.printSettings?.infill ?? 20,
        },
      };
    });

    if (serverCart) {
      serverCart.lines.forEach(serverLine => {
        const exists = mergedLines.some(
          line => line.merchandise.id === serverLine.merchandise.id
        );
        if (!exists) {
          mergedLines.push({
            ...serverLine,
            printSettings: {
              layerHeight: serverLine.printSettings?.layerHeight ?? 0.2,
              infill: serverLine.printSettings?.infill ?? 20,
            },
          });
        }
      });
    }

    const totalQuantity = mergedLines.reduce((sum, line) => sum + line.quantity, 0);
    const subtotalAmount = mergedLines.reduce(
      (sum, line) => sum + Number(line.merchandise.price.amount) * line.quantity,
      0
    );

    const mergedCart: Cart = {
      ...localCart,
      lines: mergedLines,
      totalQuantity,
      cost: {
        id: localCart.cost.id,
        subtotalAmount: {
          ...localCart.cost.subtotalAmount,
          amount: subtotalAmount.toString(),
        },
        totalAmount: {
          ...localCart.cost.totalAmount,
          amount: subtotalAmount.toString(), // For now, total = subtotal (no tax)
        },
        totalTaxAmount: {
          ...localCart.cost.totalTaxAmount,
          amount: '0',
        },
      },
    };

    await this.set(mergedCart);
    return mergedCart;
  }

  createEmptyCart(): Cart {
    return {
      totalQuantity: 0,
      lines: [],
      cost: {
        id: '',
        subtotalAmount: {
          id: '',
          amount: '0',
          currencyCode: 'USD',
        },
        totalAmount: {
          id: '',
          amount: '0',
          currencyCode: 'USD',
        },
        totalTaxAmount: {
          id: '',
          amount: '0',
          currencyCode: 'USD',
        },
      },
    };
  }
} 