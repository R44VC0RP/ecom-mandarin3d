import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        updatedAt: "desc"
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
    const { title, handle, description, price, fileUrl, slicedFileUrl, slicedFileAttributes, seo } = body

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

    // Create money record for price
    const moneyRecord = await prisma.money.create({
      data: {
        amount: price.toString(),
        currencyCode: "USD"
      }
    })

    // Create product with new fields
    const product = await prisma.product.create({
      data: {
        title,
        handle,
        description,
        fileUrl: fileUrl || null,
        slicedFileUrl: slicedFileUrl || null,
        slicedFileAttributes: slicedFileAttributes ? JSON.stringify(slicedFileAttributes) : null,
        variants: {
          create: {
            title: "Default Variant",
            availableForSale: true,
            selectedOptions: [],
            price: {
              connect: {
                id: moneyRecord.id
              }
            }
          }
        },
        priceRange: {
          create: {
            maxVariantPrice: {
              connect: {
                id: moneyRecord.id
              }
            },
            minVariantPrice: {
              connect: {
                id: moneyRecord.id
              }
            }
          }
        },
        ...(seo && {
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