"use client"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import { useEffect, useState } from "react"
import { FaEdit, FaSearch, FaTrash } from "react-icons/fa"

interface Collection {
  id: string
  title: string
  handle: string
  description: string | null
  updatedAt: string
  _count?: {
    products: number
  }
}

interface ApiResponse {
  success: boolean
  data?: Collection[]
  error?: string
}

export function CollectionsDataTable() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [filteredCollections, setFilteredCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch("/api/collections")
        const data: ApiResponse = await response.json()

        if (!data.success || !data.data) {
          throw new Error(data.error || "Failed to fetch collections")
        }

        setCollections(data.data)
        setFilteredCollections(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCollections()
  }, [])

  useEffect(() => {
    const filtered = collections.filter(collection => 
      collection.title.toLowerCase().includes(search.toLowerCase()) ||
      collection.handle.toLowerCase().includes(search.toLowerCase()) ||
      collection.description?.toLowerCase().includes(search.toLowerCase())
    )
    setFilteredCollections(filtered)
  }, [search, collections])

  if (error) {
    return (
      <div className="rounded-md bg-red-500/10 p-3 text-center">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <FaSearch className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-500" />
        <input
          type="text"
          placeholder="Search collections..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 w-full rounded-md border border-neutral-200 bg-white pl-8 pr-3 text-sm placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-[#1a1b1e] dark:placeholder:text-neutral-400"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Handle</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCollections.map((collection) => (
            <TableRow key={collection.id}>
              <TableCell>
                <div>
                  <span className="font-medium">{collection.title}</span>
                  {collection.description && (
                    <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
                      {collection.description}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">{collection.handle}</span>
              </TableCell>
              <TableCell>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {collection._count?.products || 0} products
                </span>
              </TableCell>
              <TableCell>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {new Date(collection.updatedAt).toLocaleDateString()}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1.5">
                  <Link href={`/dashboard/collections/${collection.id}`}>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-7 w-7 p-0"
                    >
                      <FaEdit className="h-3.5 w-3.5" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => {
                      // TODO: Implement delete
                      console.log("Delete", collection.id)
                    }}
                  >
                    <FaTrash className="h-3.5 w-3.5" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {!filteredCollections.length && !isLoading && (
            <TableRow>
              <TableCell colSpan={5} className="h-20 text-center text-sm text-neutral-500 dark:text-neutral-400">
                {search ? "No collections found matching your search." : "No collections found."}
              </TableCell>
            </TableRow>
          )}
          {isLoading && (
            <TableRow>
              <TableCell colSpan={5} className="h-20">
                <div className="flex items-center justify-center gap-1">
                  <div className="h-1 w-1 rounded-full bg-neutral-900 animate-bounce dark:bg-neutral-400 [animation-delay:-0.3s]"></div>
                  <div className="h-1 w-1 rounded-full bg-neutral-900 animate-bounce dark:bg-neutral-400 [animation-delay:-0.15s]"></div>
                  <div className="h-1 w-1 rounded-full bg-neutral-900 animate-bounce dark:bg-neutral-400"></div>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
} 