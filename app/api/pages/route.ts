import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const page = await prisma.page.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        published: data.published,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true, data: page })
  } catch (error) {
    console.error("Error creating page:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create page" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const pages = await prisma.page.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    })

    return NextResponse.json({ success: true, data: pages })
  } catch (error) {
    console.error("Error fetching pages:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch pages" },
      { status: 500 }
    )
  }
} 