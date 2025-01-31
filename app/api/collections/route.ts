import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const collections = await prisma.collection.findMany({
      orderBy: {
        updatedAt: "desc"
      },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: collections
    })
  } catch (error) {
    console.error("Error fetching collections:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch collections" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, handle, description, seo } = body

    // Validate required fields
    if (!title || !handle) {
      return NextResponse.json(
        { success: false, error: "Title and handle are required" },
        { status: 400 }
      )
    }

    // Check if handle is unique
    const existingCollection = await prisma.collection.findUnique({
      where: { handle }
    })

    if (existingCollection) {
      return NextResponse.json(
        { success: false, error: "A collection with this handle already exists" },
        { status: 400 }
      )
    }

    // Create collection with SEO if provided
    const collection = await prisma.collection.create({
      data: {
        title,
        handle,
        description,
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
      data: collection
    })
  } catch (error) {
    console.error("Error creating collection:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create collection" },
      { status: 500 }
    )
  }
} 