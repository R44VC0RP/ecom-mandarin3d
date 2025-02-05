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

export type CartItem = {
  productId: string;
  variantId: string;
  quantity: number;
  title: string;
  price: number;
  image?: {
    url: string;
    altText: string | null;
  };
};

export type Cart = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}; 