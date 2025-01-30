"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { FaEdit, FaTrash } from "react-icons/fa"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface Product {
  id: string
  title: string
  handle: string
  availableForSale: boolean
  updatedAt: string
}

interface ApiResponse {
  success: boolean
  data?: Product[]
  error?: string
}

export function ProductsDataTable() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products")
        const data: ApiResponse = await response.json()

        if (!data.success || !data.data) {
          throw new Error(data.error || "Failed to fetch products")
        }

        setProducts(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (error) {
    return (
      <div className="rounded-md border p-6 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border-none">
      <Table className="border-none">
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Handle</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.title}</TableCell>
              <TableCell>{product.handle}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  product.availableForSale 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {product.availableForSale ? "Active" : "Draft"}
                </span>
              </TableCell>
              <TableCell>{new Date(product.updatedAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/dashboard/products/${product.id}`}
                    className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground"
                  >
                    <FaEdit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Link>
                  <button
                    onClick={() => {
                      // TODO: Implement delete
                      console.log("Delete", product.id)
                    }}
                    className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <FaTrash className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {!products.length && !isLoading && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No products found.
              </TableCell>
            </TableRow>
          )}
          {isLoading && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                Loading...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
} 