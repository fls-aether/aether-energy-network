import { NextResponse } from 'next/server';
import { AetherForecastPayload } from '@/lib/types/forecast';
import { NetworkNodePayload } from '@/lib/types/network';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- MOCK PAYLOADS PROVISIONING ---
const mockForecastPayload: AetherForecastPayload = {
    today: {
        transitTitle: "Moon Square Mars",
        energyStatus: "High Friction / Kinetic Release",
        primaryDirective: "Heavy physical exertion (Weightlifting, Sprints)",
        secondaryDirective: "Solo deep-work requiring intense singular focus"
    },
    thisWeek: {
        transitTitle: "Mercury Trine Jupiter",
        energyStatus: "Expansion / Mental Flow",
        primaryDirective: "Launch new marketing campaigns",
        secondaryDirective: "Sign contracts or negotiate terms"
    },
    thisMonth: {
        transitTitle: "Sun Conjunction Uranus",
        energyStatus: "Sudden Innovation / Disruption",
        primaryDirective: "Brainstorming unconventional solutions",
        secondaryDirective: "Upgrading tech stacks or hardware"
    },
    thisYear: {
        transitTitle: "Saturn in Pisces Phase II",
        energyStatus: "Structuring the Ethereal",
        primaryDirective: "Building long-term spiritual practices into daily routine",
        secondaryDirective: "Formalizing artistic or creative endeavors into businesses"
    }
};

const mockNetworkPayload: NetworkNodePayload[] = [
    {
        connection: { id: "p_001", name: "Elara Vance", category: "Work", lastSync: "2H Ago" },
        synastry: { resonance: 88, frictionPoints: 2, activeHarmonics: ["Trine", "Sextile"], karmicLink: false }
    },
    {
        connection: { id: "p_002", name: "Kaelen Thorne", category: "Romantic", lastSync: "Live" },
        synastry: { resonance: 94, frictionPoints: 5, activeHarmonics: ["Conjunction", "Trine"], karmicLink: true }
    },
    {
        connection: { id: "p_003", name: "Jax Morovan", category: "Social", lastSync: "1D Ago" },
        synastry: { resonance: 72, frictionPoints: 12, activeHarmonics: ["Square"], karmicLink: false }
    },
    {
        connection: { id: "p_004", name: "Lyra Sterling", category: "Family", lastSync: "5M Ago" },
        synastry: { resonance: 65, frictionPoints: 18, activeHarmonics: ["Opposition", "Square"], karmicLink: true }
    },
    {
        connection: { id: "p_005", name: "Orion Chase", category: "Work", lastSync: "1W Ago" },
        synastry: { resonance: 81, frictionPoints: 4, activeHarmonics: ["Sextile"], karmicLink: false }
    }
];

export async function POST(request: Request) {
  try {
    const { stats, hardware, currentDate, source } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    // Fail-Safe Fallback
    if (!apiKey || !stats) {
       console.warn("Aether API: Missing API Key or Stats Payload. Falling back to Mock Offline Schema.");
       await new Promise((resolve) => setTimeout(resolve, 1500));
       return NextResponse.json({
          forecast: mockForecastPayload,
          network: mockNetworkPayload,
          adventureLog: {
            id: `offline-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
            text: "[Sovereign Offline] Telemetry array uncoupled. Local diagnostic routines returning ambient static baseline. Connect to Aether Mainframe for live Oracle parsing."
          }
       });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Enforce strict JSON output
    const generationConfig = {
      responseMimeType: "application/json",
    };

    let prompt = "";

    if (source === "story") {
        prompt = `
          You are the Aether Energy Network Oracle. Generate a highly personalized LitRPG Adventure Log for the Operator.
          Use the following Draconic Hardware data as their 'Inner Soul Class': ${JSON.stringify(hardware)}.
          Use the following Biometric Stats as their 'Active Leveling Attributes':
          - Logic: ${stats?.logic || 50}/100
          - Drive: ${stats?.drive || 50}/100
          - Empathy: ${stats?.empathy || 50}/100
          - Stability: ${stats?.stability || 50}/100

          Tone: Gritty, high-fantasy, technical. Format as a 'Daily Quest Log' entry.
          Constraint: Generate EXACTLY 1 paragraph of narrative followed by exactly 3 specific 'System Notifications' (e.g., +1 Logic for deciphering the void).

          You MUST respond ONLY with a valid JSON object strictly matching this schema:
          {
            "adventureLog": "Your generated string with the paragraph and the 3 system notifications combined into a single text block."
          }
        `;
    } else {
        prompt = `
          You are an advanced astrological logic engine and tactical Oracle operating within the Aether Energy Network.
          Calculate daily transits based on the current date: ${currentDate || "today"}.

          Cross-reference the current cosmic weather against the operator's Natal Hardware: ${JSON.stringify(hardware)}.
          The operator's current SPA (Spiritual/Psyche Architecture) metrics are:
          - Logic: ${stats?.logic || 50}/100
          - Drive: ${stats?.drive || 50}/100
          - Empathy: ${stats?.empathy || 50}/100
          - Stability: ${stats?.stability || 50}/100

          Use these metrics and explicit natal coordinates to inform your transit response.

          You must generate a strict JSON response containing TWO keys:
          1. "forecast": A nested JSON object formatted EXACTLY like this structure:
             {
               "today": {
                 "active_transit": "Creative ASTROLOGICAL Transit Name (e.g. Moon Square Mars)",
                 "energy_status": "Creative Vibe Descriptor (e.g. Kinetic Release)",
                 "system_warning": "Optional warning string (can be null)",
                 "recommended_activities": ["activity 1", "activity 2", "activity 3"]
               },
               "this_week": { "active_transit": "...", "energy_status": "...", "system_warning": "...", "recommended_activities": ["...", "..."] },
               "this_month": { "active_transit": "...", "energy_status": "...", "system_warning": "...", "recommended_activities": ["...", "..."] },
               "this_year": { "active_transit": "...", "energy_status": "...", "system_warning": "...", "recommended_activities": ["...", "..."] }
             }
             
             CRITICAL DIRECTIVE for the recommended_activities strings: Generate a highly personalized tactical forecast. Focus on structural integrity, potential failure modes during current transits, and practical alchemy. Maintain an engineering/military tone. Provide EXACTLY 2 distinct activities for each temporal block, keeping them actionable and brief.

          2. "adventureLog": A single, 1-paragraph string written from the perspective of an AI LitRPG quest log. It should mention the exact stat numbers provided and how they are affecting the operator's current "quest" or "diagnostic weld" today. Keep it punchy, cyber-mystic, and very evocative.

          Ensure the output is VALID JSON.
        `;
    }

    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig
    });

    const responseText = result.response.text();
    const liveData = JSON.parse(responseText);

    if (source === "story") {
        return NextResponse.json({
            adventureLog: {
                id: `live-story-${Date.now()}`,
                timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
                text: liveData.adventureLog
            }
        });
    }

    return NextResponse.json({
      forecast: liveData.forecast,
      network: mockNetworkPayload, // Network remains mocked for this phase
      adventureLog: {
          id: `live-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
          text: liveData.adventureLog
      }
    });

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Ultimate fallback if JSON parsing or SDK call fails
    return NextResponse.json({
        forecast: mockForecastPayload,
        network: mockNetworkPayload,
        adventureLog: {
          id: `error-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
          text: "[Sovereign Error] Catastrophic misalignment in the Oracle Relay. Engaging deep-sleep protocol."
        }
    });
  }
}
