import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Assuming this is your standard Prisma client export

export async function GET(request: Request) {
    try {
        // 1. Grab the URL parameters (e.g., /api/lexicon?keys=Sun,Aries,LifePath1)
        const { searchParams } = new URL(request.url);
        const keysParam = searchParams.get('keys');

        if (!keysParam) {
            return NextResponse.json({ error: "No lexicon keys provided" }, { status: 400 });
        }

        // 2. Split the comma-separated string into an array
        const keys = keysParam.split(',').map(k => k.trim());

        // 3. Query the Neon Database for all matching Lexicon Entries
        const entries = await prisma.lexiconEntry.findMany({
            where: {
                key: { in: keys }
            }
        });

        // 4. Format the raw database rows into a clean, easy-to-read dictionary object for the frontend
        type LexiconDictionary = Record<string, { title: string; description: string; category: string }>;
        type LexiconRow = { key: string; title: string; description: string; category: string };

        const lexiconMap = entries.reduce((acc: LexiconDictionary, entry: LexiconRow) => {
            acc[entry.key] = {
                title: entry.title,
                description: entry.description,
                category: entry.category
            };
            return acc;
        }, {} as LexiconDictionary);

        // 5. Return the payload
        return NextResponse.json({ lexicon: lexiconMap }, { status: 200 });

    } catch (error) {
        console.error("[Aether Matrix] Lexicon API Error:", error);
        return NextResponse.json({ error: "Failed to retrieve data from the Aether Matrix" }, { status: 500 });
    }
}