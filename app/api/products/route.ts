import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        updatedAt: "desc"
      },
      include: {
        featuredImage: true,
        seo: true
      }
    })

    return NextResponse.json({
      success: true,
      data: products
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, handle, description, price, compareAtPrice, seo } = body

    // Validate required fields
    if (!title || !handle) {
      return NextResponse.json(
        { success: false, error: "Title and handle are required" },
        { status: 400 }
      )
    }

    // Check if handle is unique
    const existingProduct = await prisma.product.findUnique({
      where: { handle }
    })

    if (existingProduct) {
      return NextResponse.json(
        { success: false, error: "A product with this handle already exists" },
        { status: 400 }
      )
    }

    // Create product with SEO if provided
    const product = await prisma.product.create({
      data: {
        title,
        handle,
        description,
        price: price || 0,
        compareAtPrice: compareAtPrice || null,
        ...(seo?.title && {
          seo: {
            create: {
              title: seo.title,
              description: seo.description
            }
          }
        })
      }
    })

    return NextResponse.json({
      success: true,
      data: product
    })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 }
    )
  }
} 