"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FaInfoCircle, FaSave } from "react-icons/fa"
import { PiSparkleFill } from "react-icons/pi"

interface Product {
  id: string
  title: string
  handle: string
  featuredImage?: {
    url: string
  } | null
}

interface CollectionProduct {
  product: Product
}

interface SEO {
  title: string
  description: string | null
}

interface Collection {
  id: string
  title: string
  handle: string
  description: string | null
  products: CollectionProduct[]
  seo: SEO | null
}

interface CollectionFormProps {
  collection?: Collection | null
}

export function CollectionForm({ collection }: CollectionFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: collection?.title || "",
    handle: collection?.handle || "",
    description: collection?.description || "",
    seo: {
      title: collection?.seo?.title || "",
      description: collection?.seo?.description || ""
    }
  })

  // Auto-generate handle from title
  useEffect(() => {
    if (!collection && formData.title && !formData.handle) {
      setFormData(prev => ({
        ...prev,
        handle: formData.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
      }))
    }
  }, [collection, formData.title])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        collection ? `/api/collections/${collection.id}` : "/api/collections", 
        {
          method: collection ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      router.push("/dashboard/collections")
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
            placeholder="e.g. New Arrivals"
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
                <p>The handle is used in the URL for this collection (e.g. /collections/new-arrivals). It's automatically generated from the title but can be customized.</p>
              </div>
            </div>
          </div>
          <input
            id="handle"
            type="text"
            value={formData.handle}
            onChange={(e) => setFormData(prev => ({ ...prev, handle: e.target.value }))}
            className="h-8 rounded-md border border-neutral-200 bg-white px-3 text-sm placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-[#1a1b1e] dark:placeholder:text-neutral-400"
            placeholder="e.g. new-arrivals"
            required
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            This will be used in the URL: mandarin3d.com/collections/<span className="font-mono">{formData.handle || 'handle'}</span>
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
              placeholder="Describe your collection..."
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
          <span className="ml-1.5">Save Collection</span>
        </Button>
      </div>
    </form>
  )
} 