import { Product } from '../types';

export type Money = {
  id: string;
  amount: string;
  currencyCode: string;
};

export type CartCost = {
  id: string;
  subtotalAmount: Money;
  totalAmount: Money;
  totalTaxAmount: Money;
};

export type SelectedOption = {
  name: string;
  value: string;
};

export type CartLine = {
  id: string;
  quantity: number;
  cost?: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions?: SelectedOption[];
    price: Money;
    product: Pick<Product, 'id' | 'handle' | 'title' | 'featuredImage'>;
  };
};

export type Cart = {
  id: string | undefined;
  lines: CartLine[];
  totalQuantity: number;
  cost: CartCost;
  checkoutUrl?: string;
}; 