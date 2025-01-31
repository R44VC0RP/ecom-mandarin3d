"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FaInfoCircle, FaSave } from "react-icons/fa"
import { PiSparkleFill } from "react-icons/pi"

interface Image {
  id: string
  url: string
  alt: string | null
}

interface SEO {
  title: string
  description: string | null
}

interface Product {
  id: string
  title: string
  handle: string
  description: string | null
  price: number
  compareAtPrice: number | null
  featuredImage: Image | null
  images: Image[]
  seo: SEO | null
}

interface ProductFormProps {
  product?: Product | null
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: product?.title || "",
    handle: product?.handle || "",
    description: product?.description || "",
    price: product?.price || 0,
    compareAtPrice: product?.compareAtPrice || 0,
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
          body: JSON.stringify(formData)
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
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <label htmlFor="price" className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                Price
              </label>
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
            <div className="grid gap-2">
              <label htmlFor="compareAtPrice" className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                Compare at Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500">$</span>
                <input
                  id="compareAtPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.compareAtPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, compareAtPrice: parseFloat(e.target.value) }))}
                  className="h-8 w-full rounded-md border border-neutral-200 bg-white pl-7 pr-3 text-sm placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-[#1a1b1e] dark:placeholder:text-neutral-400"
                  placeholder="0.00"
                />
              </div>
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