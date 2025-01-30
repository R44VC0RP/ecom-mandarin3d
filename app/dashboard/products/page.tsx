import { ProductsDataTable } from "@/components/products/products-data-table"

export const metadata = {
  title: "Products | Admin Dashboard",
  description: "Manage your products",
}

export default async function ProductsPage() {
  return (
    <div className="flex flex-col p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Manage your product catalog here.
          </p>
        </div>
        <a 
          href="/dashboard/products/new" 
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
        >
          Add Product
        </a>
      </div>
      <ProductsDataTable />
    </div>
  )
} 