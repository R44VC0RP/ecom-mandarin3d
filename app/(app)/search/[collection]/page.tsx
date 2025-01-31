import { getCollection, getCollectionProducts, getCollections } from 'lib/prisma-queries';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { defaultSort, sorting } from 'lib/constants';
import { Product } from 'lib/types';
import Link from 'next/link';

export async function generateMetadata(props: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  
  if (params.collection === 'collections') {
    return {
      title: 'Collections',
      description: 'Browse all available collections in our store'
    };
  }

  const collection = await getCollection(params.collection);

  if (!collection) return notFound();

  return {
    title: collection.seo?.title || collection.title,
    description:
      collection.seo?.description || collection.description || `${collection.title} products`
  };
}

export default async function CategoryPage(props: {
  params: Promise<{ collection: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { sort } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  // Special handling for collections route
  if (params.collection === 'collections') {
    const collections = await getCollections();
    const visibleCollections = collections.filter(c => !c.handle.startsWith('hidden') && c.handle !== 'collections');

    return (
      <section>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleCollections.map((collection) => (
            <Link
              key={collection.handle}
              href={collection.path || `/search/${collection.handle}`}
              className="group block overflow-hidden rounded-lg border border-neutral-200 bg-white hover:border-[--m3d-primary] dark:border-neutral-800 dark:bg-black"
            >
              <div className="p-6">
                <h2 className="mb-2 text-2xl font-bold">{collection.title}</h2>
                {collection.description && (
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {collection.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  const products = await getCollectionProducts({ collection: params.collection, sortKey, reverse });

  return (
    <section>
      {products.length === 0 ? (
        <p className="py-3 text-lg">{`No products found in this collection`}</p>
      ) : (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products as Product[]} />
        </Grid>
      )}
    </section>
  );
}
