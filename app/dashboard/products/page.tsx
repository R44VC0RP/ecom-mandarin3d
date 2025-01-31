import { ProductsDataTable } from "@/components/products/products-data-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FaPlus } from "react-icons/fa"

export const metadata = {
  title: "Products | Admin Dashboard",
  description: "Manage your products",
}

export default async function ProductsPage() {
  return (
    <div className="mx-auto grid gap-3 px-3 pb-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold leading-none">Products</h1>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Manage your 3D models and digital products
          </p>
        </div>
        <Link href="/dashboard/products/new">
          <Button variant="primary" size="sm" className="inline-flex items-center gap-1.5">
            <FaPlus className="h-3.5 w-3.5" />
            Add Product
          </Button>
        </Link>
      </div>
      <ProductsDataTable />
    </div>
  )
} 