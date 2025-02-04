"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa"

export default function PagesPage() {
  const router = useRouter()
  const [pages, setPages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch pages on component mount
  useState(async () => {
    try {
      const response = await fetch("/api/pages")
      const data = await response.json()
      if (data.success) {
        setPages(data.data)
      }
    } catch (error) {
      console.error("Error fetching pages:", error)
    } finally {
      setLoading(false)
    }
  })

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this page?")) return

    try {
      const response = await fetch(`/api/pages/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete page")
      }

      // Remove the page from the local state
      setPages(pages.filter((page) => page.id !== id))
      router.refresh()
    } catch (error) {
      console.error("Error deleting page:", error)
      // TODO: Show error message to user
    }
  }

  if (loading) {
    return (
      <div className="mx-auto grid gap-3 px-3 pb-3">
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="mx-auto grid gap-3 px-3 pb-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold leading-none">Pages</h1>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Manage your static pages
          </p>
        </div>
        <Link
          href="/dashboard/pages/new"
          className="flex h-7 items-center gap-1.5 rounded bg-neutral-100 px-3 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
        >
          <FaPlus className="h-3.5 w-3.5" />
          Add Page
        </Link>
      </div>

      <div className="rounded-md border border-neutral-800/50">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-800/50 bg-neutral-900/50">
                <th className="px-3 py-2 text-left text-xs font-medium">Title</th>
                <th className="px-3 py-2 text-left text-xs font-medium">Slug</th>
                <th className="px-3 py-2 text-left text-xs font-medium">Status</th>
                <th className="px-3 py-2 text-left text-xs font-medium">Updated</th>
                <th className="px-3 py-2 text-right text-xs font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr
                  key={page.id}
                  className="border-b border-neutral-800/50 last:border-0 hover:bg-neutral-900/50"
                >
                  <td className="px-3 py-2 text-sm">{page.title}</td>
                  <td className="px-3 py-2 text-sm">{page.slug}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${
                        page.published
                          ? "bg-green-500/10 text-green-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {page.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-sm">
                    {new Intl.DateTimeFormat(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }).format(new Date(page.updatedAt))}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/dashboard/pages/${page.id}`}
                        className="flex h-7 items-center gap-1.5 rounded bg-neutral-100 px-3 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
                      >
                        <FaEdit className="h-3.5 w-3.5" />
                        Edit
                      </Link>
                      <button
                        className="flex h-7 items-center gap-1.5 rounded bg-red-500/10 px-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/20"
                        onClick={() => handleDelete(page.id)}
                      >
                        <FaTrash className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 