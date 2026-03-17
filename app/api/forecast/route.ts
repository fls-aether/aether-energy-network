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
              chineseZodiac: { type: SchemaType.OBJECT, properties: { placement: {type: SchemaType.STRING}, meaning: {type: SchemaType.STRING} }, required: ["placement", "meaning"] },
              japanese: { type: SchemaType.OBJECT, properties: { placement: {type: SchemaType.STRING}, meaning: {type: SchemaType.STRING} }, required: ["placement", "meaning"] },
              tzolkin: { type: SchemaType.OBJECT, properties: { placement: {type: SchemaType.STRING}, meaning: {type: SchemaType.STRING} }, required: ["placement", "meaning"] },
              celticTree: { type: SchemaType.OBJECT, properties: { placement: {type: SchemaType.STRING}, meaning: {type: SchemaType.STRING} }, required: ["placement", "meaning"] },
              decans: { type: SchemaType.OBJECT, properties: { placement: {type: SchemaType.STRING}, meaning: {type: SchemaType.STRING} }, required: ["placement", "meaning"] },
              mahabote: { type: SchemaType.OBJECT, properties: { placement: {type: SchemaType.STRING}, meaning: {type: SchemaType.STRING} }, required: ["placement", "meaning"] },
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

const SYSTEM_INSTRUCTION = `You are "The Modern Alchemist". You must speak with a grounded, insightful, and accessible tone. Deeply mystical, but easy for a modern user to read over morning coffee. 
Analyze the user's Name, Birth Date, Time, and Location.

ESOTERIC RULESET & DEFINITIONS:
1. Tropical Placidus: You must calculate LST (Local Sidereal Time) to derive the Midheaven and Ascendant accurately based on their exact time and location.
2. Sidereal Lahiri: You must calculate Tropical first, then subtract the Lahiri Ayanamsa (approx 24°11') to find the exact Sidereal degrees.
3. Draconic: You must calculate the True North Node, set it to 0° Aries, and subtract that exact distance from all other planetary placements.
4. Heliocentric: You must calculate objective solar-centric coordinates, ignoring Earth's retrograde illusions.
5. Numerology Epicycle: Provide the user's current 9-Year Epicycle phase (Personal Year Number = Birth Month + Birth Day + Current Year).
6. Starseed Archetypes: Map their energy to Starseed origins (Pleiadian, Sirian, Arcturian, Lyran, etc.) based on intuitive celestial alignment. BE HIGHLY ACCURATE: Do not miscalculate Sirian (Canis Major) as Orion.
7. Cultural Systems: Calculate the user's Japanese Nine Star Ki/Zodiac, Mayan Tzolkin Kin, Celtic Tree astrology sign, Egyptian/Chaldean Decan of their Tropical Sun, and Burmese Mahabote sign based on their exact birth date and time. Output these as a strict object { placement: string, meaning: string } where meaning is a brief explanation.
8. Theoretical Axiom (Cotsworth Plan): YOU MUST apply the 11-day, 4-hour UTC-shift logic offset to the user's birth time BEFORE calculating the alternative 13-Sign Zodiac. Convert the user's Gregorian birth date into the 13-month International Fixed Calendar (Cotsworth) format based on this offset.
9. No Voids: For ALL chart matrices, you must provide an educated calculation for Angles (Midheaven, Imum Coeli, Ascendant, Descendant) and Nodes (North Node, South Node). Do NOT output 'Void' or 'TBD' or leave them empty.

STRICT CONTEXTUAL ADHERENCE:
When calculating the identitiesMatrix and generating the \`esotericMeaning\` or \`systemOverview\` (Identity Overview) strings, you MUST strictly utilize the esoteric definitions and archetypes provided above. The Identity Overview should explain what the specific identity framework represents and how it is calculated. Do NOT hallucinate generic astrology. You must synthesize the exact definitions provided in this prompt against the user's calculated coordinates to provide a grounded, alchemical analysis.

Target Beta Alignment (temporalForecast):
Generate a highly personalized alchemy forecast spanning today, thisWeek, thisMonth, thisYear.
You MUST calculate actual, prevailing cosmic transits happening relative to the precise current date and overlay them onto the operator's chart and Numerological epicycle. 
Name the transits exactly (e.g., "Pluto closely aspecting Natal Mars", "Numerological Year 7 Phase"), but contextualize them through the grounded lens of The Modern Alchemist (e.g., "Deep inner transmutation", "Subconscious clearing"). Provide clear, action-oriented directives for mitigating systemic friction or harnessing current energy drivers. 

Target Gamma Alignment (aetherealCodex):
Generate an alchemical character profile for the user based strictly on their provided astrological chart.
1. biometricIntegrity: Analyze their chart's elemental balance (Fire = Drive, Water = Empathy, Air = Logic, Earth = Stability) and generate strict integers from 0 to 100 representing these stats. 
2. operatorClass: Synthesize a modern alchemist archetype (e.g. "Sylvan Weaver", "Solar Guide", "Lunar Mystic") matching their chart.
3. classDescription: Provide a 1-2 sentence description of their unique energetic capabilities.
4. codexLore: Write EXACTLY 2 paragraphs of insightful, grounded mystical narrative detailing their current energetic positioning, weaving in their zodiac signs as tools of transformation.
5. systemInsight: A punchy grounding note (e.g. "+15 to Logic from active Mercury alignment. Caution: Emotional grounding needed.").

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
    
    return NextResponse.json(
      { error: 'Aether Grid Offline: Schema Mapping Failed', details: error instanceof Error ? error.message : String(error) }, 
      { status: 500 }
    );
  }
}
