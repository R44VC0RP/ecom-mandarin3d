import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const prisma = new PrismaClient();

// Input validation schemas
const GetProductsSchema = z.object({
  query: z.string().optional(),
  sortKey: z.string().optional(),
  reverse: z.boolean().optional(),
});

const GetProductSchema = z.object({
  handle: z.string(),
});

const GetCollectionProductsSchema = z.object({
  collection: z.string(),
  sortKey: z.string().optional(),
  reverse: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'getProducts': {
        const validated = GetProductsSchema.parse({
          query: searchParams.get('query') || undefined,
          sortKey: searchParams.get('sortKey') || undefined,
          reverse: searchParams.get('reverse') === 'true',
        });

        const products = await prisma.product.findMany({
          where: validated.query ? {
            OR: [
              { title: { contains: validated.query, mode: 'insensitive' } },
              { description: { contains: validated.query, mode: 'insensitive' } },
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
          },
          orderBy: validated.sortKey === 'TITLE' 
            ? { title: validated.reverse ? 'desc' : 'asc' }
            : validated.sortKey === 'CREATED_AT'
            ? { createdAt: validated.reverse ? 'desc' : 'asc' }
            : undefined,
        });

        return NextResponse.json({ products });
      }

      case 'getProduct': {
        const validated = GetProductSchema.parse({
          handle: searchParams.get('handle'),
        });

        const product = await prisma.product.findUnique({
          where: { handle: validated.handle },
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

        if (!product) {
          return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ product });
      }

      case 'getCollectionProducts': {
        const validated = GetCollectionProductsSchema.parse({
          collection: searchParams.get('collection'),
          sortKey: searchParams.get('sortKey') || undefined,
          reverse: searchParams.get('reverse') === 'true',
        });

        const collection = await prisma.collection.findUnique({
          where: { handle: validated.collection },
          include: {
            products: {
              include: {
                product: {
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
                  },
                },
              },
            },
          },
        });

        if (!collection) {
          return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
        }

        const products = collection.products.map(cp => cp.product);

        if (validated.sortKey) {
          products.sort((a, b) => {
            const compareValue = validated.sortKey === 'TITLE' 
              ? a.title.localeCompare(b.title)
              : validated.sortKey === 'CREATED_AT'
              ? a.createdAt.getTime() - b.createdAt.getTime()
              : 0;
            
            return validated.reverse ? -compareValue : compareValue;
          });
        }

        return NextResponse.json({ products });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input parameters' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action;

    switch (action) {
      case 'createCart': {
        const cart = await prisma.cart.create({
          data: {
            checkoutUrl: '', // You'll need to implement your checkout URL generation logic
            totalQuantity: 0,
            subtotalAmount: {
              create: {
                amount: '0',
                currencyCode: 'USD',
              },
            },
            totalAmount: {
              create: {
                amount: '0',
                currencyCode: 'USD',
              },
            },
          },
          include: {
            items: {
              include: {
                variant: true,
                totalAmount: true,
              },
            },
            subtotalAmount: true,
            totalAmount: true,
            totalTaxAmount: true,
          },
        });

        return NextResponse.json({ cart });
      }

      // Add more POST actions here (addToCart, removeFromCart, etc.)

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 