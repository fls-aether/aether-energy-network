export const SCENT_MAPPINGS: Record<string, string> = {
  "Aries": "Frankincense & Cinnamon",
  "Taurus": "Vetiver & Patchouli",
  "Gemini": "Peppermint & Lavender",
  "Cancer": "Chamomile & Jasmine",
  "Leo": "Sweet Orange & Rosemary",
  "Virgo": "Sandalwood & Fennel",
  "Libra": "Rose & Geranium",
  "Scorpio": "Myrrh & Black Pepper",
  "Sagittarius": "Clove & Nutmeg",
  "Capricorn": "Cedarwood & Cypress",
  "Aquarius": "Eucalyptus & Pine",
  "Pisces": "Ylang Ylang & Lotus",
};

export function getGroundingScent(sunSign: string | undefined): string {
  if (!sunSign) return "Purified Water (Neutral Base)";
  // Capitalize first letter to match dictionary keys
  const normalizedSign = sunSign.charAt(0).toUpperCase() + sunSign.slice(1).toLowerCase();
  return SCENT_MAPPINGS[normalizedSign] || "Palo Santo (Universal Alignment)";
}
