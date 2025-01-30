import { getCollectionProducts } from 'lib/prisma-queries';
import Link from 'next/link';
import { GridTileImage } from './grid/tile';

export async function Carousel() {
  // We're using the featured collection from our seed data
  const products = await getCollectionProducts({ collection: 'hidden-homepage-featured-items' });

  if (!products?.length) return null;

  // Purposefully duplicating products to make the carousel loop and not run out of products on wide screens.
  const carouselProducts = [...products, ...products, ...products];

  return (
    <div className="w-full overflow-x-auto pb-6 pt-1">
      <ul className="flex animate-carousel gap-4">
        {carouselProducts.map((product, i) => (
          <li
            key={`${product.handle}${i}`}
            className="relative aspect-square h-[30vh] max-h-[275px] w-2/3 max-w-[475px] flex-none md:w-1/3"
          >
            <Link href={`/product/${product.handle}`} className="relative h-full w-full">
              <GridTileImage
                alt={product.title}
                label={{
                  title: product.title,
                  amount: product.priceRange?.maxVariantPrice.amount || '0',
                  currencyCode: product.priceRange?.maxVariantPrice.currencyCode || 'USD'
                }}
                src={product.featuredImage?.url || ''}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
