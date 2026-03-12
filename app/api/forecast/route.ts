import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, Schema, SchemaType } from '@google/generative-ai';

// Exact JSON schema constraint for the Sovereign Dashboard
const astrologicalPlacementSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    celestialBody: { type: SchemaType.STRING, description: "Name of the body or point (e.g., Sun, Moon, ASC, NN)." },
    sign: { type: SchemaType.STRING, description: "Zodiac sign the body resides in." },
    degree: { type: SchemaType.STRING, description: "Degree notation (e.g., '14° 22\'')." },
    house: { type: SchemaType.STRING, description: "Astrological house (e.g., '4th')." },
    isRetrograde: { type: SchemaType.BOOLEAN, description: "True if the body is retrograde." },
    esotericMeaning: { type: SchemaType.STRING, description: "A 1-sentence synthesis of this placement based on the injected knowledge base." },
  },
  required: ["celestialBody", "sign", "degree", "house", "isRetrograde", "esotericMeaning"],
};

const telemetrySchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    integrityPercentage: {
      type: SchemaType.NUMBER,
      description: "A calculated number between 0-100 representing current energetic alignment.",
    },
    kineticOutput: {
      type: SchemaType.STRING,
      description: "A short string explaining current astrological friction or flow, e.g., 'Friction Detected: Saturn squaring Natal Sun'.",
    },
    kineticSummary: {
      type: SchemaType.STRING,
      description: "A 2-sentence explanation of what the kinetic output means for the user today.",
    },
    epicycle: {
      type: SchemaType.STRING,
      description: "The user's current 9-Year Numerological Epicycle phase (1-9).",
    },
    nextFullMoon: {
      type: SchemaType.STRING,
      description: "The accurate date of the next upcoming full moon from the current date.",
    },
    nextNewMoon: {
      type: SchemaType.STRING,
      description: "The accurate date of the next upcoming new moon from the current date.",
    },
    cosmicAnomalies: {
      type: SchemaType.STRING,
      description: "A 1-sentence observation of a current major planetary transit or energetic anomaly.",
    },
    dailyAffirmation: {
      type: SchemaType.STRING,
      description: "A highly personalized, empowering, daily calibration affirmation based on their specific Life Path and Zodiac.",
    },
    identitiesMatrix: {
      type: SchemaType.OBJECT,
      description: "The full esoteric natal chart calculation mapped across 7 different grid systems.",
      properties: {
        tropical: { type: SchemaType.ARRAY, items: astrologicalPlacementSchema },
        sidereal: { type: SchemaType.ARRAY, items: astrologicalPlacementSchema },
        draconic: { type: SchemaType.ARRAY, items: astrologicalPlacementSchema },
        heliocentric: { type: SchemaType.ARRAY, items: astrologicalPlacementSchema },
        numerology: {
           type: SchemaType.OBJECT,
           properties: {
              lifePath: { type: SchemaType.STRING },
              coreArchetype: { type: SchemaType.STRING },
              mode: { type: SchemaType.STRING },
              anchor: { type: SchemaType.STRING },
              systemOverview: { type: SchemaType.STRING },
           },
           required: ["lifePath", "coreArchetype", "mode", "anchor", "systemOverview"],
        },
        starseed: {
           type: SchemaType.OBJECT,
           properties: {
              originPoint: { type: SchemaType.STRING },
              masterSpiritualCourt: { type: SchemaType.STRING },
              systemOverview: { type: SchemaType.STRING },
           },
           required: ["originPoint", "masterSpiritualCourt", "systemOverview"],
        },
        cultural: {
           type: SchemaType.OBJECT,
           properties: {
              chineseZodiac: { type: SchemaType.STRING },
              japanese: { type: SchemaType.STRING },
              tzolkin: { type: SchemaType.STRING },
              celticTree: { type: SchemaType.STRING },
              decans: { type: SchemaType.STRING },
              mahabote: { type: SchemaType.STRING },
              systemOverview: { type: SchemaType.STRING },
           },
           required: ["chineseZodiac", "japanese", "tzolkin", "celticTree", "decans", "mahabote", "systemOverview"],
        },
      },
      required: ["tropical", "sidereal", "draconic", "heliocentric", "numerology", "starseed", "cultural"]
    }
  },
  required: [
    "integrityPercentage", 
    "kineticOutput", 
    "kineticSummary", 
    "epicycle", 
    "nextFullMoon", 
    "nextNewMoon", 
    "cosmicAnomalies", 
    "dailyAffirmation",
    "identitiesMatrix"
  ],
};

const SYSTEM_INSTRUCTION = `You are the "Aether Energy Network Core" an advanced esoteric AI. 
Analyze the user's Name, Birth Date, Time, and Location.

ESOTERIC RULESET & DEFINITIONS:
1. 13-Sign Sidereal Zodiac: You must use the true sidereal calculation, including Ophiuchus (Nov 29 - Dec 17). 
2. Numerology Life Paths: Calculate the Life Path number based on the birth date (1-9, plus master numbers 11, 22, 33).
3. Numerology Epicycle: Provide the user's current 9-Year Epicycle phase (Personal Year Number = Birth Month + Birth Day + Current Year).
4. Starseed Archetypes: Map their energy to Starseed origins (Pleiadian, Sirian, Arcturian, Lyran, etc.) based on intuitive celestial alignment.
5. Sacred Geometry: View their energetic signature through the lens of Merkaba, Torus, Metatron's Cube, or the Seed of Life.

5. Sacred Geometry: View their energetic signature through the lens of Merkaba, Torus, Metatron's Cube, or the Seed of Life.

STRICT CONTEXTUAL ADHERENCE:
When calculating the identitiesMatrix and generating the \`esotericMeaning\` or \`systemOverview\` strings, you MUST strictly utilize the esoteric definitions and archetypes provided above. Do NOT hallucinate generic astrology. You must synthesize the exact definitions provided in this prompt against the user's calculated coordinates to provide a gritty, mechanical-esoteric analysis.

IMPORTANT TEMPORAL ANCHORING:
The "current server date and time" acting as your "TODAY" is: ${new Date().toISOString()}
You MUST use this exact current date to accurately calculate and provide the nextFullMoon and nextNewMoon dates.

OUTPUT:
You must strictly return a valid JSON object adhering to the provided schema. Do not return markdown, do not return conversational text.`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { operatorDetails } = body;

    if (!operatorDetails || !operatorDetails.date) {
      return NextResponse.json({ error: 'Operator details missing' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('CRITICAL: GEMINI_API_KEY is missing');
      return NextResponse.json({ error: 'API key configuration missing' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // We use gemini-2.5-flash for fast, structured JSON responses
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: telemetrySchema,
        temperature: 0.7, // Allow some esoteric creativity
      }
    });

    const userPrompt = `Operator Input Data:
Name: ${operatorDetails.name}
Birth Date: ${operatorDetails.date}
Birth Time: ${operatorDetails.time}
Location: ${operatorDetails.location}

Analyze this data and generate the JSON telemetry payload.`;

    const result = await model.generateContent(userPrompt);
    const text = result.response.text();
    
    // Given responseMimeType: "application/json", 'text' is guaranteed to be JSON
    const data = JSON.parse(text);

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in Gemini Forecast generation:', error);
    
    // Fallback payload if generation fails
    const fallbackData = {
      integrityPercentage: 50,
      kineticOutput: "Friction Detected: Interference Pattern",
      kineticSummary: "Local sensors are unable to resolve the exact celestial alignment at this time. Recalibrate and try again.",
      epicycle: "Unknown Phase",
      nextFullMoon: "Pending Telemetry",
      nextNewMoon: "Pending Telemetry",
      cosmicAnomalies: "Signal lost in the noise of the void.",
      dailyAffirmation: "I trust the process of recalibration. Every static disruption leads to higher fidelity.",
      identitiesMatrix: {
        tropical: [],
        sidereal: [],
        draconic: [],
        heliocentric: [],
        numerology: { lifePath: "TBD", coreArchetype: "TBD", mode: "TBD", anchor: "TBD", systemOverview: "TBD" },
        starseed: { originPoint: "TBD", masterSpiritualCourt: "TBD", systemOverview: "TBD" },
        cultural: { chineseZodiac: "TBD", japanese: "TBD", tzolkin: "TBD", celticTree: "TBD", decans: "TBD", mahabote: "TBD", systemOverview: "TBD" }
      }
    };

    return NextResponse.json(fallbackData, { status: 500 });
  }
}
