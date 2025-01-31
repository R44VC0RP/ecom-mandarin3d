import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id
    const body = await request.json()
    const { title, handle, description, price, compareAtPrice, seo } = body

    // Validate required fields
    if (!title || !handle) {
      return NextResponse.json(
        { success: false, error: "Title and handle are required" },
        { status: 400 }
      )
    }

    // Check if handle is unique (excluding current product)
    const existingProduct = await prisma.product.findFirst({
      where: {
        handle,
        NOT: {
          id: id
        }
      }
    })

    if (existingProduct) {
      return NextResponse.json(
        { success: false, error: "A product with this handle already exists" },
        { status: 400 }
      )
    }

    // Update product
    const product = await prisma.product.update({
      where: { id },
      data: {
        title,
        handle,
        description,
        updatedAt: new Date(),
        seo: {
          upsert: {
            create: {
              title: seo.title,
              description: seo.description
            },
            update: {
              title: seo.title,
              description: seo.description
            }
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: product
    })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update product" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id
    // Delete product
    await prisma.product.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true
    })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete product" },
      { status: 500 }
    )
  }
} 