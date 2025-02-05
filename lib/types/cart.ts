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

export type FeaturedImage = {
  id?: string;
  productId?: string | null;
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
};

export interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: {
      amount: string;
      currencyCode: string;
    };
    product: {
      id: string;
      handle: string;
      title: string;
      featuredImage: FeaturedImage | null;
    };
  };
  printSettings?: {
    layerHeight: number;
    infill: number;
  };
}

export interface Cart {
  id?: string;
  totalQuantity: number;
  lines: CartLine[];
  cost: {
    id: string;
    subtotalAmount: {
      id: string;
      amount: string;
      currencyCode: string;
    };
    totalAmount: {
      id: string;
      amount: string;
      currencyCode: string;
    };
    totalTaxAmount: {
      id: string;
      amount: string;
      currencyCode: string;
    };
  };
} 