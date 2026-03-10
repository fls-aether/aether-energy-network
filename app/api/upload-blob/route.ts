import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename') || 'articles/blob.txt';
    const data = await request.text() || 'Hello World!';

    // Ensure allowOverwrite is included as requested by the user
    const { url } = await put(filename, data, {
      access: 'public',
      allowOverwrite: true,
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Blob upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload Blob.' },
      { status: 500 }
    );
  }
}
