import { CartCalculator } from './cart';
import { CartLine, Money } from './types/cart';

export class DefaultCartCalculator implements CartCalculator {
  calculateLineTotal(quantity: number, price: Money): Money {
    const amount = (Number(price.amount) * quantity).toString();
    return {
      id: '',
      amount,
      currencyCode: price.currencyCode
    };
  }

  calculateSubtotal(lines: CartLine[]): Money {
    const amount = lines.reduce(
      (sum, line) => sum + (Number(line.merchandise.price.amount) * line.quantity),
      0
    ).toString();

    const currencyCode = lines[0]?.merchandise.price.currencyCode ?? 'USD';

    return {
      id: '',
      amount,
      currencyCode
    };
  }

  calculateTax(subtotal: Money): Money {
    // For now, returning 0 tax. This can be updated with proper tax calculation logic
    return {
      id: '',
      amount: '0',
      currencyCode: subtotal.currencyCode
    };
  }

  calculateTotal(subtotal: Money, tax: Money): Money {
    if (subtotal.currencyCode !== tax.currencyCode) {
      throw new Error('Currency mismatch between subtotal and tax');
    }

    const amount = (Number(subtotal.amount) + Number(tax.amount)).toString();

    return {
      id: '',
      amount,
      currencyCode: subtotal.currencyCode
    };
  }
} 