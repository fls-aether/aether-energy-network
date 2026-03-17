import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { operatorClass, dominantSign } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
       console.error("Aether Avatar API: Missing GEMINI_API_KEY.");
       return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    if (!operatorClass || !dominantSign) {
       return NextResponse.json({ error: "Missing required telemetry (operatorClass, dominantSign)" }, { status: 400 });
    }

    const prompt = `A highly detailed, metaphysical sacred geometry emblem representing a ${operatorClass} aligned with the energy of ${dominantSign}. Intricate golden ratio proportions, ethereal cosmic light, crystalline structures, and overlapping astral circles (resembling Metatron's Cube or the Seed of Life). Clean, symmetrical, and deeply mystical. Dark aethereal background with glowing cyan and gold line work. No text, no faces, purely geometric and esoteric. Render in the style of a high-end graphic novel, heavy ink lines, cinematic lighting, cel-shaded, Moebius-inspired, mystical modern alchemy aesthetic.`;

    // Construct exactly for the v1beta Imagen endpoint
    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`;

    const requestBody = {
      instances: [
        {
          prompt: prompt
        }
      ],
      parameters: {
        sampleCount: 1,
        // Depending on specific API privileges, 1024x1024 is standard, some allow 1:1 specifically
        aspectRatio: "1:1",
        outputOptions: {
           mimeType: "image/jpeg"
        }
      }
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Imagen API Error Response:", errorText);
        return NextResponse.json({ error: "Upstream image generation failed", details: errorText }, { status: response.status });
    }

    const json = await response.json();
    console.log("Imagen Raw Response Metadata:", Object.keys(json));

    // Try to safely extract the standard response object (usually predictions[0].bytesBase64Encoded)
    if (json.predictions && json.predictions.length > 0 && json.predictions[0].bytesBase64Encoded) {
        return NextResponse.json({ 
            avatarBase64: `data:image/jpeg;base64,${json.predictions[0].bytesBase64Encoded}` 
        });
    } else {
        console.error("Imagen API Payload Structure Mismatch:", JSON.stringify(json).substring(0, 500) + "...");
        return NextResponse.json({ error: "Unexpected response format from Imagen" }, { status: 500 });
    }

  } catch (error) {
    console.error("Avatar API Internal Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
