import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean up existing data in the correct order
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.collectionProduct.deleteMany();
  await prisma.priceRange.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productOption.deleteMany();
  await prisma.sEO.deleteMany();
  await prisma.image.deleteMany();
  await prisma.money.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.product.deleteMany();

  // Create mock products
  const mockProducts = [
    {
      handle: 'mandarin-3d-printer',
      title: 'Mandarin 3D Printer',
      description: 'High-quality 3D printer for professional use',
      descriptionHtml: '<p>High-quality 3D printer for professional use</p>',
      availableForSale: true,
      tags: ['3d-printer', 'professional', 'featured'],
    },
    {
      handle: 'mandarin-filament-pla',
      title: 'Mandarin PLA Filament',
      description: 'Premium PLA filament for perfect prints',
      descriptionHtml: '<p>Premium PLA filament for perfect prints</p>',
      availableForSale: true,
      tags: ['filament', 'pla', 'featured'],
    },
    {
      handle: 'mandarin-resin',
      title: 'Mandarin Resin',
      description: 'High-detail resin for SLA printing',
      descriptionHtml: '<p>High-detail resin for SLA printing</p>',
      availableForSale: true,
      tags: ['resin', 'sla', 'featured'],
    },
  ];

  for (const productData of mockProducts) {
    // Create the product
    const product = await prisma.product.create({
      data: {
        ...productData,
        seo: {
          create: {
            title: productData.title,
            description: productData.description,
          },
        },
        images: {
          create: [
            {
              url: `https://picsum.photos/seed/${productData.handle}/800/800`,
              altText: productData.title,
              width: 800,
              height: 800,
            },
            {
              url: `https://picsum.photos/seed/${productData.handle}-2/800/800`,
              altText: `${productData.title} - View 2`,
              width: 800,
              height: 800,
            },
          ],
        },
        options: {
          create: [
            {
              name: 'Color',
              values: ['Black', 'White', 'Silver'],
            },
            {
              name: 'Size',
              values: ['Standard', 'Professional'],
            },
          ],
        },
      },
    });

    // Create variants with prices
    const variants = [];
    const colors = ['Black', 'White', 'Silver'];
    const sizes = ['Standard', 'Professional'];

    for (const color of colors) {
      for (const size of sizes) {
        const basePrice = size === 'Professional' ? 1999.99 : 999.99;
        const price = await prisma.money.create({
          data: {
            amount: basePrice.toString(),
            currencyCode: 'USD',
          },
        });

        const variant = await prisma.productVariant.create({
          data: {
            title: `${color} / ${size}`,
            availableForSale: true,
            productId: product.id,
            priceId: price.id,
            selectedOptions: [
              { name: 'Color', value: color },
              { name: 'Size', value: size },
            ],
          },
        });
        
        const variantWithPrice = await prisma.productVariant.findUnique({
          where: { id: variant.id },
          include: { price: true }
        });
        
        variants.push(variantWithPrice);
      }
    }

    // Create price range
    const prices = variants.map(v => Number(v?.price?.amount || 0));
    const minPrice = await prisma.money.create({
      data: {
        amount: Math.min(...prices).toString(),
        currencyCode: 'USD',
      },
    });
    const maxPrice = await prisma.money.create({
      data: {
        amount: Math.max(...prices).toString(),
        currencyCode: 'USD',
      },
    });

    await prisma.priceRange.create({
      data: {
        productId: product.id,
        maxVariantPriceId: maxPrice.id,
        minVariantPriceId: minPrice.id,
      },
    });

    // Set the first image as featured image
    const firstImage = await prisma.image.findFirst({
      where: { productId: product.id }
    });
    if (firstImage) {
      await prisma.product.update({
        where: { id: product.id },
        data: { featuredImageId: firstImage.id }
      });
    }
  }

  // Create featured collection
  const featuredCollection = await prisma.collection.create({
    data: {
      handle: 'hidden-homepage-featured-items',
      title: 'Featured Items',
      description: 'Featured items displayed on the homepage',
      seo: {
        create: {
          title: 'Featured Items',
          description: 'Featured items displayed on the homepage',
        }
      }
    },
  });

  // Add all products to the featured collection
  const products = await prisma.product.findMany();
  for (const product of products) {
    await prisma.collectionProduct.create({
      data: {
        collectionId: featuredCollection.id,
        productId: product.id,
      },
    });
  }

  // Seed static pages
  const pages = [
    {
      slug: 'faq',
      title: 'Frequently Asked Questions',
      content: 'Frequently asked questions about our products and services.',
      metaTitle: 'FAQ - Mandarin 3D',
      metaDescription: 'Find answers to commonly asked questions about Mandarin 3D products and services.'
    },
    {
      slug: 'terms-of-service',
      title: 'Terms of Service',
      content: 'Terms and conditions for using our services.',
      metaTitle: 'Terms of Service - Mandarin 3D',
      metaDescription: 'Read our terms of service and conditions for using Mandarin 3D products and services.'
    },
    {
      slug: 'privacy-policy',
      title: 'Privacy Policy',
      content: 'Our privacy policy and data protection practices.',
      metaTitle: 'Privacy Policy - Mandarin 3D',
      metaDescription: 'Learn about how we protect your privacy and handle your data at Mandarin 3D.'
    },
    {
      slug: 'shipping',
      title: 'Shipping Information',
      content: 'Information about our shipping policies and delivery times.',
      metaTitle: 'Shipping Information - Mandarin 3D',
      metaDescription: 'Learn about our shipping policies, delivery times, and shipping methods.'
    },
    {
      slug: 'returns',
      title: 'Returns & Refunds',
      content: 'Our returns and refunds policy.',
      metaTitle: 'Returns & Refunds - Mandarin 3D',
      metaDescription: 'Understanding our returns process and refund policy for Mandarin 3D products.'
    },
    {
      slug: 'contact',
      title: 'Contact Us',
      content: 'Get in touch with our team.',
      metaTitle: 'Contact Us - Mandarin 3D',
      metaDescription: 'Contact Mandarin 3D for support, questions, or business inquiries.'
    }
  ];

  async function seedPages() {
    console.log('🌱 Seeding static pages...');
    
    for (const page of pages) {
      await prisma.page.upsert({
        where: { slug: page.slug },
        update: {
          ...page,
          updatedAt: new Date()
        },
        create: {
          ...page,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    }
    
    console.log('✅ Static pages seeded successfully');
  }

  await seedPages();

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 