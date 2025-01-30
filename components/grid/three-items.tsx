import { GridTileImage, ShowcaseGridTileImage } from 'components/grid/tile';
import { prisma } from 'lib/prisma';
import Link from 'next/link';

async function getCollectionProducts(collection: string) {
  const collectionData = await prisma.collection.findUnique({
    where: { handle: collection },
    include: {
      products: {
        include: {
          product: {
            include: {
              featuredImage: true,
              priceRange: {
                include: {
                  maxVariantPrice: true,
                  minVariantPrice: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!collectionData) {
    return [];
  }

  return collectionData.products.map(cp => cp.product);
}

function ThreeItemGridItem({
  item,
  size,
  priority
}: {
  item: {
    handle: string;
    title: string;
    featuredImage: { url: string } | null;
    priceRange: {
      maxVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    } | null;
  };
  size: 'full' | 'half';
  priority?: boolean;
}) {
  return (
    <div
      className={size === 'full' ? 'md:col-span-4 md:row-span-2' : 'md:col-span-2 md:row-span-1'}
    >
      <Link
        className="relative block aspect-square h-full w-full"
        href={`/product/${item.handle}`}
        prefetch={true}
      >
        <GridTileImage
          src={item.featuredImage?.url || ''}
          fill
          sizes={
            size === 'full' ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 768px) 33vw, 100vw'
          }
          priority={priority}
          alt={item.title}
          label={{
            position: size === 'full' ? 'center' : 'bottom',
            title: item.title,
            amount: item.priceRange?.maxVariantPrice.amount || '0',
            currencyCode: item.priceRange?.maxVariantPrice.currencyCode || 'USD'
          }}
        />
      </Link>
    </div>
  );
}

function ThreeItemShowcaseItem({
  item,
  size,
  priority
}: {
  item: {
    image: string;
    isVideo?: boolean;
    videoStyle?: 'loop' | 'freeze';
    description: string;
    url?: string;
  };
  size: 'full' | 'half';
  priority?: boolean;
}) {
  const Content = () => (
    <div className="relative block aspect-square h-full w-full">
      <ShowcaseGridTileImage
        src={item.image}
        isVideo={item.isVideo}
        videoStyle={item.videoStyle}
        fill={!item.isVideo}
        sizes={
          size === 'full' ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 768px) 33vw, 100vw'
        }
        priority={priority}
        alt={item.description}
        label={{
          position: 'center',
          title: item.description
        }}
      />
    </div>
  );

  return (
    <div
      className={size === 'full' ? 'md:col-span-4 md:row-span-2' : 'md:col-span-2 md:row-span-1'}
    >
      {item.url ? (
        <Link className="relative block aspect-square h-full w-full" href={item.url} prefetch={true}>
          <Content />
        </Link>
      ) : (
        <Content />
      )}
    </div>
  );
}

export async function ThreeItemGrid() {
  // Collections that start with `hidden-*` are hidden from the search page.
  const homepageItems = await getCollectionProducts('hidden-homepage-featured-items');

  if (!homepageItems[0] || !homepageItems[1] || !homepageItems[2]) return null;

  const [firstProduct, secondProduct, thirdProduct] = homepageItems;

  return (
    <section className="mx-auto grid max-w-screen-2xl gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2 lg:max-h-[calc(100vh-200px)]">
      <ThreeItemShowcaseItem
        item={{
          image: "/X1C.webm",
          isVideo: true,
          videoStyle: 'freeze',
          description: "Redefining 3D Printing | Layer by Layer",
          url: "/optional/link" // optional
        }}
        size="full"
        priority={true}
      />
      <ThreeItemGridItem size="half" item={secondProduct} priority={true} />
      <ThreeItemGridItem size="half" item={thirdProduct} />
    </section>
  );
}

export { ThreeItemGridItem, ThreeItemShowcaseItem };
