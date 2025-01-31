import { CollectionsDataTable } from "@/components/collections/collections-data-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FaPlus } from "react-icons/fa"

export const metadata = {
  title: "Collections | Admin Dashboard",
  description: "Manage your collections",
}

export default async function CollectionsPage() {
  return (
    <div className="mx-auto grid gap-3 px-3 pb-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold leading-none">Collections</h1>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Manage your product collections
          </p>
        </div>
        <Link href="/dashboard/collections/new">
          <Button variant="primary" size="sm" className="inline-flex items-center gap-1.5">
            <FaPlus className="h-3.5 w-3.5" />
            Add Collection
          </Button>
        </Link>
      </div>
      <CollectionsDataTable />
    </div>
  )
} 