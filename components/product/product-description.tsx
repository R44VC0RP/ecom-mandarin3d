import { ProductOption } from '@prisma/client';
import { AddToCart } from 'components/cart/add-to-cart';
import Price from 'components/price';
import Prose from 'components/prose';
import { Product, ProductVariant } from 'lib/types';
import { VariantSelector } from './variant-selector';

export function ProductDescription({ product }: { product: Product }) {
  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-5xl font-medium">{product.title}</h1>
        <div className="mr-auto w-auto rounded-full bg-[--m3d-primary-border] p-2 text-sm text-white">
          <Price
            amount={product.priceRange?.maxVariantPrice?.amount || '0'}
            currencyCode={product.priceRange?.maxVariantPrice?.currencyCode || 'USD'}
          />
        </div>
      </div>
      <VariantSelector options={product.options as ProductOption[]} variants={product.variants as ProductVariant[]} />
      {product.descriptionHtml ? (
        <Prose
          className="mb-6 text-sm leading-tight dark:text-white/[60%]"
          html={product.descriptionHtml}
        />
      ) : null}
      <AddToCart product={product} />
    </>
  );
}
