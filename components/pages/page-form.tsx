"use client"

import { Page } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FaSave } from "react-icons/fa"

interface PageFormProps {
  page: Page | null
}

export function PageForm({ page }: PageFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Page>>({
    title: page?.title || "",
    slug: page?.slug || "",
    content: page?.content || "",
    metaTitle: page?.metaTitle || "",
    metaDescription: page?.metaDescription || "",
    published: page?.published ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/pages${page ? `/${page.id}` : ""}`, {
        method: page ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to save page")
      }

      router.refresh()
      router.push("/dashboard/pages")
    } catch (error) {
      console.error("Error saving page:", error)
      // TODO: Show error message to user
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <div className="grid gap-2">
        <label htmlFor="title" className="text-xs font-medium">
          Title
        </label>
        <input
          type="text"
          id="title"
          className="h-8 rounded border border-neutral-800 bg-[#1a1b1e] px-2 text-sm"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="slug" className="text-xs font-medium">
          Slug
        </label>
        <input
          type="text"
          id="slug"
          className="h-8 rounded border border-neutral-800 bg-[#1a1b1e] px-2 text-sm"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          required
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="content" className="text-xs font-medium">
          Content
        </label>
        <textarea
          id="content"
          className="min-h-[200px] rounded border border-neutral-800 bg-[#1a1b1e] p-2 text-sm"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          required
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="metaTitle" className="text-xs font-medium">
          Meta Title
        </label>
        <input
          type="text"
          id="metaTitle"
          className="h-8 rounded border border-neutral-800 bg-[#1a1b1e] px-2 text-sm"
          value={formData.metaTitle || ""}
          onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="metaDescription" className="text-xs font-medium">
          Meta Description
        </label>
        <textarea
          id="metaDescription"
          className="h-20 rounded border border-neutral-800 bg-[#1a1b1e] p-2 text-sm"
          value={formData.metaDescription || ""}
          onChange={(e) =>
            setFormData({ ...formData, metaDescription: e.target.value })
          }
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="published"
          className="h-4 w-4 rounded border-neutral-800 bg-[#1a1b1e]"
          checked={formData.published}
          onChange={(e) =>
            setFormData({ ...formData, published: e.target.checked })
          }
        />
        <label htmlFor="published" className="text-sm">
          Published
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="flex h-8 items-center gap-1.5 rounded bg-neutral-100 px-4 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-200 disabled:opacity-50 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
        >
          <FaSave className="h-3.5 w-3.5" />
          {loading ? "Saving..." : "Save Page"}
        </button>
      </div>
    </form>
  )
} 