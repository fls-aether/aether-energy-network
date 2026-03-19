import { prisma } from '@/lib/prisma';

/**
 * Fetches a custom Modern Alchemist definition from the Neon Database.
 * @param key The unique key (e.g., 'Aries', 'Sun', 'LifePath1')
 * @returns The description string, or null if not found.
 */
export async function getAlchemistDefinition(key: string): Promise<string | null> {
    try {
        const entry = await prisma.lexiconEntry.findUnique({
            where: { key: key },
        })

        // If we found it, return your custom description. Otherwise, return null.
        return entry ? entry.description : null

    } catch (error) {
        console.error(`[Aether Matrix] Failed to retrieve Lexicon entry for key: ${key}`, error)
        return null
    }
}