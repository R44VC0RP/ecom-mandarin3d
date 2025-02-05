import { utapi } from '@/lib/server';
import { stl2png } from '@scalenc/stl-to-png';
import { NextResponse } from "next/server";


export async function GET(
    request: Request,
    { params }: { params: Promise<{ url: string }> }
) {
    try {
        const url = (await params).url;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch STL file');
        }
        const stlData = await response.arrayBuffer();
        const buffer = Buffer.from(stlData);
        const pngData = stl2png(buffer, { width: 500, height: 500 });
        const blob = new Blob([pngData], { type: 'image/png' });
        const file = new File([blob], `${url}.png`, { type: 'image/png' });
        const ut_response = await utapi.uploadFiles(file);

        return NextResponse.json(
            { success: true, data: ut_response.data?.url || null },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "An error occurred while fetching the image" },
            { status: 500 }
        );
    }
}