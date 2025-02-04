import { PageForm } from "@/components/pages/page-form"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ id: string }>
}

export default async function PagePage({ params }: Props) {
  const { id } = await params
  const isNew = id === "new"
  let page = null

  if (!isNew) {
    page = await prisma.page.findUnique({
      where: { id }
    })

    if (!page) {
      notFound()
    }
  }

  return (
    <div className="mx-auto grid gap-3 px-3 pb-3">
      <div>
        <h1 className="text-lg font-bold leading-none">
          {isNew ? "New Page" : "Edit Page"}
        </h1>
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          {isNew ? "Create a new page" : `Edit ${page?.title || ''}`}
        </p>
      </div>
      <PageForm page={page} />
    </div>
  )
} 