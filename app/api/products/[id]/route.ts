import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id
    const body = await request.json()
    const { title, handle, description, price, fileUrl, slicedFileUrl, slicedFileAttributes, seo } = body

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

    // Get the current product to update its variant price
    const currentProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: {
          include: {
            price: true
          }
        },
        priceRange: {
          include: {
            maxVariantPrice: true,
            minVariantPrice: true
          }
        }
      }
    })

    if (!currentProduct || !currentProduct.priceRange) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      )
    }

    // Update the price of the default variant
    if (currentProduct.variants[0]?.price?.id) {
      await prisma.money.update({
        where: { id: currentProduct.variants[0].price.id },
        data: {
          amount: price.toString()
        }
      })
    }

    // Update the price range
    if (currentProduct.priceRange.maxVariantPrice?.id) {
      await prisma.money.update({
        where: { id: currentProduct.priceRange.maxVariantPrice.id },
        data: {
          amount: price.toString()
        }
      })
    }

    if (currentProduct.priceRange.minVariantPrice?.id) {
      await prisma.money.update({
        where: { id: currentProduct.priceRange.minVariantPrice.id },
        data: {
          amount: price.toString()
        }
      })
    }

    // Update product with the new fields
    const updateData = {
      title,
      handle,
      description,
      updatedAt: new Date(),
      ...(fileUrl !== undefined && { fileUrl }),
      ...(slicedFileUrl !== undefined && { slicedFileUrl }),
      ...(slicedFileAttributes !== undefined && { 
        slicedFileAttributes: slicedFileAttributes ? JSON.stringify(slicedFileAttributes) : null 
      }),
      ...(seo && {
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
      })
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData
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