import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

interface Params {
  params: {
    id: string
  }
}

export async function PUT(request: Request, { params }: Params) {
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

    // Check if handle is unique (excluding current collection)
    const existingCollection = await prisma.collection.findFirst({
      where: {
        handle,
        NOT: {
          id: params.id
        }
      }
    })

    if (existingCollection) {
      return NextResponse.json(
        { success: false, error: "A collection with this handle already exists" },
        { status: 400 }
      )
    }

    // Update collection
    const collection = await prisma.collection.update({
      where: { id: params.id },
      data: {
        title,
        handle,
        description,
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
      data: collection
    })
  } catch (error) {
    console.error("Error updating collection:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update collection" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    // Delete collection
    await prisma.collection.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true
    })
  } catch (error) {
    console.error("Error deleting collection:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete collection" },
      { status: 500 }
    )
  }
} 