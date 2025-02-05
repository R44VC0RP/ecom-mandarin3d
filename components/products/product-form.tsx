"use client"

import { OurFileRouter } from "@/app/api/uploadthing/core"
import { Button } from "@/components/ui/button"
import { type Image as PrismaImage, type Product as PrismaProduct, type SEO as PrismaSEO } from "@prisma/client"
import { UploadButton } from "@uploadthing/react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FaImage, FaInfoCircle, FaSave, FaTrash, FaUpload } from "react-icons/fa"
import { PiSparkleFill } from "react-icons/pi"

interface UploadedImage {
  id: string
  url: string
  altText: string | null
  width: number
  height: number
  productId: string | null
}

interface Image extends PrismaImage {
  altText: string | null
}

interface SEO extends PrismaSEO {
  title: string
  description: string | null
}

interface Product extends PrismaProduct {
  featuredImage: Image | null
  images: Image[]
  seo: SEO | null
  fileUrl: string | null
  priceRange: {
    maxVariantPrice: {
      amount: string
      currencyCode: string
    }
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
  } | null
  variants: {
    price: {
      amount: string
      currencyCode: string
    }
  }[]
}

interface ProductFormProps {
  product?: Product | null
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [images, setImages] = useState<UploadedImage[]>(product?.images || [])
  const [featuredImageId, setFeaturedImageId] = useState<string | null>(product?.featuredImageId || null)
  const [formData, setFormData] = useState({
    title: product?.title || "",
    handle: product?.handle || "",
    description: product?.description || "",
    price: product?.variants[0]?.price.amount ? parseFloat(product?.variants[0]?.price.amount) : 0,
    fileUrl: product?.fileUrl || "",
    seo: {
      title: product?.seo?.title || "",
      description: product?.seo?.description || ""
    }
  })

  // Auto-generate handle from title
  useEffect(() => {
    if (!product && formData.title && !formData.handle) {
      setFormData(prev => ({
        ...prev,
        handle: formData.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
      }))
    }
  }, [product, formData.title])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        product ? `/api/products/${product.id}` : "/api/products",
        {
          method: product ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            images,
            featuredImageId
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      router.push("/dashboard/products")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageDelete = (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId))
    if (featuredImageId === imageId) {
      setFeaturedImageId(null)
    }
  }

  const handleSetFeaturedImage = (imageId: string) => {
    setFeaturedImageId(imageId)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      {error && (
        <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-500">
          {error}
        </div>
      )}

      <div className="grid gap-3">
        <div className="grid gap-2">
          <label htmlFor="title" className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="h-8 rounded-md border border-neutral-200 bg-white px-3 text-sm placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-[#1a1b1e] dark:placeholder:text-neutral-400"
            placeholder="e.g. Awesome 3D Model"
            required
          />
        </div>

        <div className="grid gap-2">
          <div className="flex items-center gap-2">
            <label htmlFor="handle" className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Handle
            </label>
            <div className="group relative">
              <FaInfoCircle className="h-3.5 w-3.5 text-neutral-400" />
              <div className="absolute left-1/2 top-full z-50 mt-1 hidden w-60 -translate-x-1/2 rounded-md bg-neutral-900 px-3 py-2 text-xs text-white shadow-lg group-hover:block dark:bg-white dark:text-neutral-900">
                <p>The handle is used in the URL for this product (e.g. /products/awesome-3d-model). It's automatically generated from the title but can be customized.</p>
              </div>
            </div>
          </div>
          <input
            id="handle"
            type="text"
            value={formData.handle}
            onChange={(e) => setFormData(prev => ({ ...prev, handle: e.target.value }))}
            className="h-8 rounded-md border border-neutral-200 bg-white px-3 text-sm placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-[#1a1b1e] dark:placeholder:text-neutral-400"
            placeholder="e.g. awesome-3d-model"
            required
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            This will be used in the URL: mandarin3d.com/products/<span className="font-mono">{formData.handle || 'handle'}</span>
          </p>
        </div>

        <div className="grid gap-2">
          <label htmlFor="description" className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
            Description
          </label>
          <div className="flex gap-1.5">
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="h-20 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-[#1a1b1e] dark:placeholder:text-neutral-400"
              placeholder="Describe your product..."
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <PiSparkleFill className="h-3.5 w-3.5" />
              <span className="sr-only">Generate Description</span>
            </Button>
          </div>
        </div>

        <div className="grid gap-3 rounded-md border border-neutral-200 p-3 dark:border-neutral-800">
          <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
            Pricing
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500">$</span>
            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
              className="h-8 w-full rounded-md border border-neutral-200 bg-white pl-7 pr-3 text-sm placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-[#1a1b1e] dark:placeholder:text-neutral-400"
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div className="grid gap-3 rounded-md border border-neutral-200 p-3 dark:border-neutral-800">
          <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
            Files
          </div>
          <div className="grid gap-3">
            <div className="grid gap-2">
              <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                3D Model File (STL)
              </label>
              <div className="flex items-center gap-3">
                {formData.fileUrl ? (
                  <div className="flex flex-1 items-center justify-between rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-[#1a1b1e]">
                    <div className="flex items-center gap-2">
                      <FaUpload className="h-4 w-4 text-neutral-500" />
                      <span className="truncate">{formData.fileUrl.split("/").pop()}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, fileUrl: "" }))}
                      className="ml-2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                    >
                      <span className="sr-only">Remove file</span>
                      <FaTrash className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <UploadButton<OurFileRouter, "modelUploader">
                    endpoint="modelUploader"
                    onClientUploadComplete={(res) => {
                      if (!res) return
                      const file = res[0]
                      if (!file?.url) return
                      setFormData(prev => ({ ...prev, fileUrl: file.url }))
                    }}
                    onUploadError={(error: Error) => {
                      setError(error.message)
                    }}
                    className="ut-button:bg-neutral-800 ut-button:text-white ut-button:text-sm ut-button:font-medium ut-button:h-8 ut-button:px-3 ut-button:rounded-md ut-button:border ut-button:border-neutral-700 ut-button:hover:bg-neutral-700"
                  />
                )}
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Upload your STL file. Maximum file size: 32MB
              </p>
            </div>

            <div className="grid gap-2">
              <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                Product Images
              </label>
              <div className="grid gap-3">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {images.map((image) => (
                    <div 
                      key={image.id} 
                      className={`group relative aspect-square overflow-hidden rounded-md border ${
                        featuredImageId === image.id 
                          ? "border-[--m3d-primary] dark:border-[--m3d-primary]" 
                          : "border-neutral-200 dark:border-neutral-800"
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt={image.altText || "Product image"}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                        {featuredImageId !== image.id && (
                          <button
                            type="button"
                            onClick={() => handleSetFeaturedImage(image.id)}
                            className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                          >
                            <FaImage className="h-4 w-4" />
                            <span className="sr-only">Set as featured image</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleImageDelete(image.id)}
                          className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                        >
                          <FaTrash className="h-4 w-4" />
                          <span className="sr-only">Delete image</span>
                        </button>
                      </div>
                      {featuredImageId === image.id && (
                        <div className="absolute left-2 top-2 rounded-full bg-[--m3d-primary] px-2 py-0.5 text-[10px] font-medium text-white">
                          Featured
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <UploadButton<OurFileRouter, "imageUploader">
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (!res) return
                    const uploadedImages: UploadedImage[] = res.map(file => ({
                      id: Math.random().toString(36).slice(2), // Temporary ID
                      url: file.url,
                      altText: null,
                      width: 800, // Default width
                      height: 800, // Default height
                      productId: product?.id || null
                    }))
                    if (uploadedImages.length === 0) return
                    setImages(prev => [...prev, ...uploadedImages])
                    // Set first uploaded image as featured if none is set
                    if (!featuredImageId && uploadedImages[0]) {
                      setFeaturedImageId(uploadedImages[0].id)
                    }
                  }}
                  onUploadError={(error: Error) => {
                    setError(error.message)
                  }}
                  className="ut-button:bg-neutral-800 ut-button:text-white ut-button:text-sm ut-button:font-medium ut-button:h-8 ut-button:px-3 ut-button:rounded-md ut-button:border ut-button:border-neutral-700 ut-button:hover:bg-neutral-700"
                />
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Upload product images. Maximum file size: 4MB per image
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-2">
          <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
            SEO
          </div>
          <div className="rounded-md border border-neutral-200 p-3 dark:border-neutral-800">
            <div className="grid gap-3">
              <div className="grid gap-2">
                <label htmlFor="seoTitle" className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  Title
                </label>
                <div className="flex gap-1.5">
                  <input
                    id="seoTitle"
                    type="text"
                    value={formData.seo.title}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      seo: { ...prev.seo, title: e.target.value }
                    }))}
                    className="h-8 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-[#1a1b1e] dark:placeholder:text-neutral-400"
                    placeholder="SEO title"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <PiSparkleFill className="h-3.5 w-3.5" />
                    <span className="sr-only">Generate SEO Title</span>
                  </Button>
                </div>
              </div>

              <div className="grid gap-2">
                <label htmlFor="seoDescription" className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  Description
                </label>
                <div className="flex gap-1.5">
                  <textarea
                    id="seoDescription"
                    value={formData.seo.description}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      seo: { ...prev.seo, description: e.target.value }
                    }))}
                    className="h-20 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-[#1a1b1e] dark:placeholder:text-neutral-400"
                    placeholder="SEO description"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <PiSparkleFill className="h-3.5 w-3.5" />
                    <span className="sr-only">Generate SEO Description</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          size="sm"
          className="w-full sm:w-auto"
          isLoading={isLoading}
        >
          <FaSave className="h-3.5 w-3.5" />
          <span className="ml-1.5">Save Product</span>
        </Button>
      </div>
    </form>
  )
} 