import { ProductForm } from "@/components/products/product-form"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const isNew = id === "new"
  let product = null

  if (!isNew) {
    product = await prisma.product.findUnique({
      where: { id },
      include: {
        featuredImage: true,
        images: true,
        seo: true,
        priceRange: {
          include: {
            maxVariantPrice: true,
            minVariantPrice: true
          }
        },
        variants: {
          include: {
            price: true
          }
        }
      }
    })

    if (!product) {
      notFound()
    }
  }

  return (
    <div className="mx-auto grid gap-3 px-3 pb-3">
      <div>
        <h1 className="text-lg font-bold leading-none">
          {isNew ? "New Product" : "Edit Product"}
        </h1>
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          {isNew ? "Create a new product" : `Edit ${product?.title || ''}`}
        </p>
      </div>
      <ProductForm product={product || null} />
    </div>
  )
} 