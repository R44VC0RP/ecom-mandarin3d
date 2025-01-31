import { CollectionForm } from "@/components/collections/collection-form"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ id: string }>
}

export default async function CollectionPage({ params }: Props) {
  const { id } = await params
  const isNew = id === "new"
  let collection = null

  if (!isNew) {
    collection = await prisma.collection.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            product: {
              include: {
                featuredImage: true
              }
            }
          }
        },
        seo: true
      }
    })

    if (!collection) {
      notFound()
    }
  }

  return (
    <div className="mx-auto grid gap-3 px-3 pb-3">
      <div>
        <h1 className="text-lg font-bold leading-none">
          {isNew ? "New Collection" : "Edit Collection"}
        </h1>
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          {isNew ? "Create a new collection" : `Edit ${collection?.title || ''}`}
        </p>
      </div>
      <CollectionForm collection={collection} />
    </div>
  )
} 