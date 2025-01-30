export type Image = {
  id: string;
  url: string;
  altText: string | null;
  width: number;
  height: number;
  productId: string | null;
};

export type Money = {
  id: string;
  amount: string;
  currencyCode: string;
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  selectedOptions: { name: string; value: string; }[];
  product?: Product;
};

export type PriceRange = {
  id: string;
  maxVariantPrice: Money;
  minVariantPrice: Money;
  productId: string;
  maxVariantPriceId: string;
  minVariantPriceId: string;
};

export type SEO = {
  id: string;
  title: string;
  description: string | null;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string | null;
  descriptionHtml: string | null;
  availableForSale: boolean;
  tags: string[];
  options: {
    id: string;
    name: string;
    values: string[];
  }[];
  variants: ProductVariant[];
  images: Image[];
  featuredImage: Image | null;
  priceRange: PriceRange | null;
  seo: SEO | null;
  updatedAt: Date;
  createdAt: Date;
};

export type Collection = {
  id: string;
  handle: string;
  title: string;
  description: string | null;
  seo: SEO | null;
  updatedAt: Date;
  path?: string;
};

export type Page = {
  id: string;
  handle: string;
  title: string;
  body: string;
  bodySummary: string | null;
  seo: SEO | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CartItem = {
  id: string;
  quantity: number;
  cartId: string;
  productId: string;
  variantId: string;
  totalAmount: Money;
  totalAmountId: string;
  product: Product;
  variant: ProductVariant;
}; 