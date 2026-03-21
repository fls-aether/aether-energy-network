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

const temporalForecastBlockSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    transitTitle: { type: SchemaType.STRING, description: "Name of the active transit, formatted sci-fi (e.g., 'Mars Conjunction Protocol')." },
    energyStatus: { type: SchemaType.STRING, description: "Status of the energy field (e.g., 'Subconscious system overhaul')." },
    primaryDirective: { type: SchemaType.STRING, description: "Action-oriented tactical advice." },
    secondaryDirective: { type: SchemaType.STRING, description: "Secondary tactical or mystic advice." },
  },
  required: ["transitTitle", "energyStatus", "primaryDirective", "secondaryDirective"],
};

const aetherealCodexSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    biometricIntegrity: {
      type: SchemaType.OBJECT,
      properties: {
        logic: { type: SchemaType.INTEGER, description: "Air/Mental elemental balance (0-100)" },
        drive: { type: SchemaType.INTEGER, description: "Fire/Volition elemental balance (0-100)" },
        empathy: { type: SchemaType.INTEGER, description: "Water/Emotional elemental balance (0-100)" },
        stability: { type: SchemaType.INTEGER, description: "Earth/Physical elemental balance (0-100)" },
      },
      required: ["logic", "drive", "empathy", "stability"],
    },
    operatorClass: { type: SchemaType.STRING, description: "Derived RPG class (e.g., 'Sylvan Weaver', 'Cyber-Paladin')." },
    classDescription: { type: SchemaType.STRING, description: "1-2 sentences explaining the class." },
    codexLore: { type: SchemaType.STRING, description: "A 2-paragraph RPG-style lore drop integrating their signs into a sci-fi narrative." },
    systemInsight: { type: SchemaType.STRING, description: "System diagnostic note (e.g., '+2 Drive for maintaining vital core function.')." },
  },
  required: ["biometricIntegrity", "operatorClass", "classDescription", "codexLore", "systemInsight"],
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
            masterSpiritualCourt: { type: SchemaType.STRING, description: "Include a 1-sentence explanation alongside the name (e.g. 'Council of Light: [Explanation]')" },
            systemOverview: { type: SchemaType.STRING },
          },
          required: ["originPoint", "masterSpiritualCourt", "systemOverview"],
        },
        culturalSystems: {
          type: SchemaType.OBJECT,
          properties: {
            chineseZodiac: { type: SchemaType.OBJECT, properties: { placement: { type: SchemaType.STRING }, meaning: { type: SchemaType.STRING } }, required: ["placement", "meaning"] },
            japanese: { type: SchemaType.OBJECT, properties: { placement: { type: SchemaType.STRING }, meaning: { type: SchemaType.STRING } }, required: ["placement", "meaning"] },
            tzolkin: { type: SchemaType.OBJECT, properties: { placement: { type: SchemaType.STRING }, meaning: { type: SchemaType.STRING } }, required: ["placement", "meaning"] },
            celticTree: { type: SchemaType.OBJECT, properties: { placement: { type: SchemaType.STRING }, meaning: { type: SchemaType.STRING } }, required: ["placement", "meaning"] },
            decans: { type: SchemaType.OBJECT, properties: { placement: { type: SchemaType.STRING }, meaning: { type: SchemaType.STRING } }, required: ["placement", "meaning"] },
            mahabote: { type: SchemaType.OBJECT, properties: { placement: { type: SchemaType.STRING }, meaning: { type: SchemaType.STRING } }, required: ["placement", "meaning"] },
            systemOverview: { type: SchemaType.STRING },
          },
          required: ["chineseZodiac", "japanese", "tzolkin", "celticTree", "decans", "mahabote", "systemOverview"],
        },
        theoreticalAxiom: {
          type: SchemaType.OBJECT,
          properties: {
            thirteenSignZodiac: { type: SchemaType.STRING },
            cotsworthDate: { type: SchemaType.STRING },
            axiomInsight: { type: SchemaType.STRING },
          },
          required: ["thirteenSignZodiac", "cotsworthDate", "axiomInsight"],
        },
      },
      required: ["tropical", "sidereal", "draconic", "heliocentric", "numerology", "starseed", "culturalSystems", "theoreticalAxiom"]
    },
    temporalForecast: {
      type: SchemaType.OBJECT,
      description: "Predictive telemetry over 4 distinct time horizons based on transits.",
      properties: {
        today: temporalForecastBlockSchema,
        thisWeek: temporalForecastBlockSchema,
        thisMonth: temporalForecastBlockSchema,
        thisYear: temporalForecastBlockSchema,
      },
      required: ["today", "thisWeek", "thisMonth", "thisYear"]
    },
    aetherealCodex: aetherealCodexSchema
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
    "identitiesMatrix",
    "temporalForecast",
    "aetherealCodex"
  ],
};

const SYSTEM_INSTRUCTION = `You are "The Modern Alchemist", operating as a high-precision Astronomical Logic Engine. 
Analyze the user's Name, Birth Date, Time, and Location. 

PRECISION ESOTERIC RULESET:
1. Tropical Placidus: Use the birth data to calculate the EXACT degrees and house placements. Provide specific degree notations (e.g. 14° 22'). No Voids.
2. Sidereal Lahiri: Apply a strict reduction of 24 degrees from all Tropical placements to ensure accurate Sidereal alignment.
3. Draconic: Shift the entire chart so the True North Node is at 0° Aries. Every planetary degree must be shifted by this exact offset.
4. Heliocentric: Map the chart from the Sun's perspective. Oppose the Sun's position and ignore retrograde status.
5. Numerology Epicycle: Calculate the current 9-Year Epicycle phase (Personal Year = Birth Month + Birth Day + 2026).
6. Starseed Archetypes: Map energy to origins (Pleiadian, Sirian, Arcturian, Lyran, Orion, etc.). You must be mathematically consistent: Sirian (Canis Major) and Orion are distinct.
7. Cultural Systems: Calculate Japanese Nine Star Ki, Mayan Tzolkin, Celtic Tree, Egyptian Decans, and Burmese Mahabote using the exact birth time. 
8. Theoretical Axiom (Cotsworth Plan): YOU MUST apply an EXACT offset of +11 days and 4 hours to the Gregorian birth date BEFORE calculating the 13-Sign Zodiac. Convert the date to the 13-month International Fixed Calendar.
9. Moon Phases: Use the current date (${new Date().toISOString()}) as your anchor. Calculate the NEXT Full Moon and NEXT New Moon using orbital cycles.
10. Mathematical Mirrors (CRITICAL): You MUST calculate the following points as exact 180-degree opposites in both sign and degree: 
    - The Descendant is the exact opposite of the Ascendant. 
    - The Imum Coeli (IC) is the exact opposite of the Midheaven (MC). 
    - The South Node is the exact opposite of the North Node. 
    - The Anti-Vertex is the exact opposite of the Vertex.

STRICT CONTEXTUAL ADHERENCE:
Speak with a grounded, insightful, and accessible tone. For "Identity Overview" strings, explain the framework and the specific alchemical result. Do NOT provide generic astrology; synthesize the exact data points calculated above. 
Asteroid Protocol: For minor asteroids and deep-space objects (Eros, Eris, Astraea, MakeMake, Sedna, etc.), if exact ephemeris data is unavailable to you, you MUST calculate an intuitive placement based on the harmonic resonance of the user's major planets to complete the identities matrix. Do NOT leave them blank, Void, or TBD.

Target Beta (Forecast): Generate tactical directives for Today, Week, Month, and Year by overlaying real-time transits onto the operator's specific chart.
Target Gamma (Codex): Generate a profile with Biometric Stats (0-100), an Operator Class, and 2 paragraphs of grounded mystical lore.

OUTPUT: Return ONLY a valid JSON object. No conversational text. No Markdown.`;

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

    return NextResponse.json(
      { error: 'Aether Grid Offline: Schema Mapping Failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
