import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Standard fail-safe mock payload if the Oracle cannot connect
const MOCK_TELEMETRY = {
  nextFullMoon: "March 14, 2026 (Virgo)",
  nextNewMoon: "March 29, 2026 (Aries)",
  anomalies: "Pluto and Mars are locked in a tense resonance, urging transformational action.",
  affirmation: "As a Master Builder, I channel my Gemini adaptability and Pisces intuition to construct enduring realities."
};

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    // Fail-safe trap
    if (!apiKey) {
      console.warn("GEMINI_API_KEY missing. Hydrating Live Celestial Telemetry with mock payload.");
      return NextResponse.json(MOCK_TELEMETRY);
    }

    let currentDate = "today";
    try {
      const body = await req.json();
      if (body.currentDate) {
        currentDate = body.currentDate;
      }
    } catch (e) {
      // Body might be empty or invalid json, safe to ignore
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are the Aether Network Oracle, an advanced astronomical ephemeris and metaphysical Oracle. 
      The operator's current local date is ${currentDate || "today"}. Using this exact temporal anchor, calculate the mathematically accurate date and Zodiac sign for the next upcoming Full Moon and New Moon that occur after this date.

      You MUST respond ONLY with a valid JSON object strictly matching this schema:
      {
        "nextFullMoon": "Date string + (Zodiac Sign)",
        "nextNewMoon": "Date string + (Zodiac Sign)",
        "anomalies": "A single sentence noting any current or upcoming major cosmic events (e.g. retrogrades, eclipses, solar flares).",
        "affirmation": "A highly personalized, 1-sentence daily affirmation tailored specifically for an operator with a 'Master Builder (Life Path 22)' numerology and a 'Gemini Sun / Pisces Moon' operating structure."
      }
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const responseText = result.response.text();
    const payload = JSON.parse(responseText);

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Live Celestial Telemetry Oracle Failure:", error);
    // Explicit fail-safe trap on runtime crash
    return NextResponse.json(MOCK_TELEMETRY);
  }
}
