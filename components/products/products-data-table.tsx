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
  seo: SEO | null
  updatedAt: string
}

interface ApiResponse {
  success: boolean
  data?: Product[]
  error?: string
}

export function ProductsDataTable() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products")
        const data: ApiResponse = await response.json()

        if (!data.success || !data.data) {
          throw new Error(data.error || "Failed to fetch products")
        }

        setProducts(data.data)
        setFilteredProducts(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    const filtered = products.filter(product => 
      product.title.toLowerCase().includes(search.toLowerCase()) ||
      product.handle.toLowerCase().includes(search.toLowerCase()) ||
      product.description?.toLowerCase().includes(search.toLowerCase())
    )
    setFilteredProducts(filtered)
  }, [search, products])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE"
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to delete product")
      }

      setProducts(prev => prev.filter(product => product.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete product")
    }
  }

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
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 w-full rounded-md border border-neutral-200 bg-white pl-8 pr-3 text-sm placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-[#1a1b1e] dark:placeholder:text-neutral-400"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Handle</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  {product.featuredImage && (
                    <img
                      src={product.featuredImage.url}
                      alt={product.featuredImage.alt || product.title}
                      className="h-8 w-8 rounded-md object-cover"
                    />
                  )}
                  <div>
                    <span className="font-medium">{product.title}</span>
                    {product.description && (
                      <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
                        {product.description}
                      </p>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">{product.handle}</span>
              </TableCell>
              <TableCell>
                <div className="text-xs">
                  <span className="font-medium">${product.price?.toFixed(2) || "0.00"}</span>
                  {product.compareAtPrice && (
                    <span className="ml-1 text-neutral-500 line-through dark:text-neutral-400">
                      ${product.compareAtPrice?.toFixed(2) || "0.00"}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {new Date(product.updatedAt).toLocaleDateString()}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1.5">
                  <Link href={`/dashboard/products/${product.id}`}>
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
                    onClick={() => handleDelete(product.id)}
                  >
                    <FaTrash className="h-3.5 w-3.5" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {!filteredProducts.length && !isLoading && (
            <TableRow>
              <TableCell colSpan={5} className="h-20 text-center text-sm text-neutral-500 dark:text-neutral-400">
                {search ? "No products found matching your search." : "No products found."}
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