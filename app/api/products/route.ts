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
        images: true,
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