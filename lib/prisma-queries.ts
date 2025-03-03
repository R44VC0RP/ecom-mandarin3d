import { prisma } from './prisma';
import { Cart, Money } from './types/cart';

export async function getProduct(handle: string) {
  console.time('getProduct');
  
  const product = await prisma.product.findUnique({
    where: { handle },
    include: {
      images: true,
      featuredImage: true,
      variants: {
        include: {
          price: true,
        }
      },
      priceRange: {
        include: {
          maxVariantPrice: true,
          minVariantPrice: true,
        }
      },
      options: true,
      seo: true,
    },
  });

  if (!product) {
    return null;
  }

  // Parse selectedOptions JSON for each variant
  const variants = product.variants.map(variant => ({
    ...variant,
    selectedOptions: typeof variant.selectedOptions === 'string' 
      ? JSON.parse(variant.selectedOptions as string)
      : variant.selectedOptions
  }));

  const result = {
    ...product,
    variants
  };

  
  return result;
}

export async function getProducts({
  query,
  reverse,
  sortKey,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}) {
  console.time('getProducts');
  
  const products = await prisma.product.findMany({
    where: query ? {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    } : undefined,
    include: {
      images: true,
      variants: {
        include: {
          price: true,
        },
      },
      priceRange: {
        include: {
          maxVariantPrice: true,
          minVariantPrice: true,
        },
      },
      featuredImage: true,
      seo: true,
      options: true,
    },
    orderBy: sortKey === 'TITLE' 
      ? { title: reverse ? 'desc' : 'asc' }
      : sortKey === 'CREATED_AT'
      ? { createdAt: reverse ? 'desc' : 'asc' }
      : undefined,
  });

  // Parse selectedOptions JSON for each variant
  const parsedProducts = products.map(product => ({
    ...product,
    variants: product.variants.map(variant => ({
      ...variant,
      selectedOptions: typeof variant.selectedOptions === 'string'
        ? JSON.parse(variant.selectedOptions as string)
        : variant.selectedOptions
    }))
  }));

  return parsedProducts;
}

export async function getCollection(handle: string) {
  return prisma.collection.findUnique({
    where: { handle },
    include: {
      seo: true,
    },
  });
}

export async function getCollections() {
  const collections = await prisma.collection.findMany({
    include: {
      seo: true,
    },
  });

  return [
    {
      handle: '',
      title: 'All Products',
      description: 'All products in the store',
      seo: {
        title: 'All Products',
        description: 'All products available in our store',
      },
      path: '/search',
      updatedAt: new Date().toISOString(),
    },
    {
      handle: 'collections',
      title: 'Collections',
      description: 'Browse all collections',
      seo: {
        title: 'Collections',
        description: 'Browse all available collections in our store',
      },
      path: '/search/collections',
      updatedAt: new Date().toISOString(),
    },
    ...collections.filter(
      (collection) => !collection.handle.startsWith('hidden')
    ).map(collection => ({
      ...collection,
      path: `/search/${collection.handle}`,
    })),
  ];
}

export async function getCollectionProducts({
  collection,
  sortKey,
  reverse,
}: {
  collection: string;
  sortKey?: string;
  reverse?: boolean;
}) {
  const collectionData = await prisma.collection.findUnique({
    where: { handle: collection },
    include: {
      products: {
        include: {
          product: {
            include: {
              images: true,
              featuredImage: true,
              variants: {
                include: {
                  price: true,
                }
              },
              priceRange: {
                include: {
                  maxVariantPrice: true,
                  minVariantPrice: true,
                }
              },
              options: true,
              seo: true,
            },
          },
        },
      },
    },
  });

  if (!collectionData) {
    return [];
  }

  let products = collectionData.products.map(cp => {
    const product = cp.product;
    // Parse selectedOptions JSON for each variant
    const variants = product.variants.map(variant => ({
      ...variant,
      selectedOptions: typeof variant.selectedOptions === 'string' 
        ? JSON.parse(variant.selectedOptions as string)
        : variant.selectedOptions
    }));

    return {
      ...product,
      variants
    };
  });

  if (sortKey) {
    products.sort((a, b) => {
      const compareValue = sortKey === 'TITLE' 
        ? a.title.localeCompare(b.title)
        : sortKey === 'CREATED_AT'
        ? a.createdAt.getTime() - b.createdAt.getTime()
        : 0;
      
      return reverse ? -compareValue : compareValue;
    });
  }

  return products;
}

export async function getProductRecommendations(productId: string) {
  return prisma.product.findMany({
    where: {
      NOT: {
        id: productId,
      },
    },
    take: 4,
    include: {
      images: true,
      variants: {
        include: {
          price: true,
        },
      },
      priceRange: {
        include: {
          maxVariantPrice: true,
          minVariantPrice: true,
        },
      },
      featuredImage: true,
      seo: true,
      options: true,
    },
  });
}

export async function getCart(cartId: string | undefined): Promise<Cart | undefined> {
  if (!cartId) {
    return undefined;
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: cartId },
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

  if (!cart) return undefined;

  // Ensure we have valid money objects with required fields
  const subtotalAmount: Money = {
    id: cart.subtotalAmount?.id ?? '',
    amount: cart.subtotalAmount?.amount ?? '0',
    currencyCode: cart.subtotalAmount?.currencyCode ?? 'USD'
  };

  const totalAmount: Money = {
    id: cart.totalAmount?.id ?? '',
    amount: cart.totalAmount?.amount ?? '0',
    currencyCode: cart.totalAmount?.currencyCode ?? 'USD'
  };

  const totalTaxAmount: Money = {
    id: cart.totalTaxAmount?.id ?? '',
    amount: cart.totalTaxAmount?.amount ?? '0',
    currencyCode: cart.totalTaxAmount?.currencyCode ?? 'USD'
  };

  // Filter out items with null variants and map to CartLine type
  const lines = cart.items
    .filter((item): item is (typeof item & { variant: NonNullable<typeof item.variant> }) => 
      item.variant !== null
    )
    .map(item => ({
      id: item.id,
      quantity: item.quantity,
      merchandise: {
        id: item.variant.id,
        title: item.variant.title,
        selectedOptions: typeof item.variant.selectedOptions === 'string'
          ? JSON.parse(item.variant.selectedOptions)
          : item.variant.selectedOptions,
        price: item.variant.price,
        product: {
          id: item.variant.product.id,
          handle: item.variant.product.handle,
          title: item.variant.product.title,
          featuredImage: item.variant.product.featuredImage,
        },
      },
      printSettings: {
        layerHeight: item.layerHeight,
        infill: item.infill,
      },
    }));

  // Return cart with correct type structure
  return {
    id: cart.id,
    totalQuantity: cart.totalQuantity,
    lines,
    cost: {
      id: cart.id,
      subtotalAmount,
      totalAmount,
      totalTaxAmount,
    },
  };
}

export async function createCart() {
  // Create initial money records for cart totals
  const initialMoney = {
    amount: '0',
    currencyCode: 'USD',
  };

  return prisma.cart.create({
    data: {
      checkoutUrl: '',
      totalQuantity: 0,
      subtotalAmount: { create: initialMoney },
      totalAmount: { create: initialMoney },
      totalTaxAmount: { create: initialMoney },
    },
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
}

export async function addToCart(cartId: string, variantId: string, quantity: number = 1) {
  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
    include: {
      price: true,
      product: {
        include: {
          images: true,
          featuredImage: true,
        },
      },
    },
  });

  if (!variant) {
    throw new Error('Variant not found');
  }

  // Calculate item total
  const itemTotal = {
    amount: (Number(variant.price.amount) * quantity).toString(),
    currencyCode: variant.price.currencyCode,
  };

  // Get current cart to calculate new totals
  const currentCart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      items: {
        include: {
          totalAmount: true,
        },
      },
      subtotalAmount: true,
      totalAmount: true,
      totalTaxAmount: true,
    },
  });

  if (!currentCart) {
    throw new Error('Cart not found');
  }

  // Calculate new cart totals
  const currentSubtotal = currentCart.subtotalAmount?.amount ?? '0';
  const newSubtotal = (Number(currentSubtotal) + Number(itemTotal.amount)).toString();

  return prisma.cart.update({
    where: { id: cartId },
    data: {
      items: {
        create: {
          quantity,
          product: { connect: { id: variant.product.id } },
          variant: { connect: { id: variantId } },
          totalAmount: { create: itemTotal },
        },
      },
      totalQuantity: { increment: quantity },
      subtotalAmount: { 
        update: { 
          amount: newSubtotal,
        }
      },
      totalAmount: { 
        update: { 
          amount: newSubtotal, // For now, total = subtotal (no tax/shipping)
        }
      },
    },
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
}

export async function removeFromCart(cartId: string, lineId: string) {
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: lineId },
    include: {
      totalAmount: true,
    },
  });

  if (!cartItem) {
    throw new Error('Cart item not found');
  }

  const currentCart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      subtotalAmount: true,
      totalAmount: true,
    },
  });

  if (!currentCart) {
    throw new Error('Cart not found');
  }

  // Calculate new totals
  const currentSubtotal = currentCart.subtotalAmount?.amount ?? '0';
  const itemAmount = cartItem.totalAmount?.amount ?? '0';
  const newSubtotal = (Number(currentSubtotal) - Number(itemAmount)).toString();

  return prisma.cart.update({
    where: { id: cartId },
    data: {
      items: {
        delete: { id: lineId },
      },
      totalQuantity: { decrement: cartItem.quantity },
      subtotalAmount: { 
        update: { 
          amount: newSubtotal,
        }
      },
      totalAmount: { 
        update: { 
          amount: newSubtotal, // For now, total = subtotal (no tax/shipping)
        }
      },
    },
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
}

export async function updateCartItem(cartId: string, lineId: string, quantity: number) {
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: lineId },
    include: {
      variant: {
        include: {
          price: true,
        },
      },
      totalAmount: true,
    },
  });

  if (!cartItem || !cartItem.variant) {
    throw new Error('Cart item or variant not found');
  }

  const currentCart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      subtotalAmount: true,
      totalAmount: true,
    },
  });

  if (!currentCart) {
    throw new Error('Cart not found');
  }

  // Calculate new item total
  const newItemTotal = {
    amount: (Number(cartItem.variant.price.amount) * quantity).toString(),
    currencyCode: cartItem.variant.price.currencyCode,
  };

  // Calculate cart totals
  const currentSubtotal = currentCart.subtotalAmount?.amount ?? '0';
  const oldItemAmount = cartItem.totalAmount?.amount ?? '0';
  const newSubtotal = (Number(currentSubtotal) - Number(oldItemAmount) + Number(newItemTotal.amount)).toString();

  const quantityDiff = quantity - cartItem.quantity;

  return prisma.cart.update({
    where: { id: cartId },
    data: {
      items: {
        update: {
          where: { id: lineId },
          data: {
            quantity,
            totalAmount: { update: newItemTotal },
          },
        },
      },
      totalQuantity: { increment: quantityDiff },
      subtotalAmount: { 
        update: { 
          amount: newSubtotal,
        }
      },
      totalAmount: { 
        update: { 
          amount: newSubtotal, // For now, total = subtotal (no tax/shipping)
        }
      },
    },
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
}

export async function getPages() {
  return prisma.page.findMany({
    where: {
      published: true
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });
} 
