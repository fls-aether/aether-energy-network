import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const input = searchParams.get('input');

  if (!input) {
    return NextResponse.json({ error: 'Input is required' }, { status: 400 });
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    console.error('CRITICAL: NEXT_PUBLIC_GOOGLE_PLACES_API_KEY is missing');
    return NextResponse.json({ error: 'API key configuration missing' }, { status: 500 });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      input
    )}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Places API Error:', data);
      return NextResponse.json(
        { error: 'Failed to fetch predictions from Google Places' },
        { status: 500 }
      );
    }

    const predictions = data.predictions.map((p: any) => p.description);

    return NextResponse.json({ predictions });
  } catch (error) {
    console.error('Error proxying to Google Places API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
