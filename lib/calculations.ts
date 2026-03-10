// lib/calculations.ts

export interface TelemetryStats {
  logic: number;
  drive: number;
  empathy: number;
  stability: number;
}

/**
 * Derives LitRPG biometric stats (0-100) from the operator's intake variables.
 */
export function calculateStats(
  name: string,
  dateString: string, // Expected format: MM/DD/YYYY
  timeString: string,
  location: string
): TelemetryStats {
  const parts = dateString.split('/');
  
  // Default fallbacks if parsing fails
  let month = 1;
  let day = 1;
  let year = 2000;

  if (parts.length === 3) {
    month = parseInt(parts[0], 10) || 1;
    day = parseInt(parts[1], 10) || 1;
    year = parseInt(parts[2], 10) || 2000;
  }

  // Logic: Name length combined with day of birth.
  const nameVal = name.replace(/\s+/g, '').length;
  // Bounded between 10 and 100
  const logicRaw = ((nameVal * 3) + (day * 2)) % 100;
  const logic = Math.max(10, logicRaw === 0 ? 80 : logicRaw);

  // Drive: Mock "Mars Intensity" heavily weighted by birth month.
  // Bounded between 30 and 100
  const driveRaw = ((month * 8) + 20) % 100;
  const drive = Math.max(30, driveRaw === 0 ? 65 : driveRaw);

  // Empathy: Lunar Phase approximation (peak empathy at month 6/Cancer)
  // Bounded between 20 and 100
  const distanceToPeak = Math.abs(month - 6);
  const empathyRaw = 100 - (distanceToPeak * 10);
  const empathy = Math.max(20, Math.min(100, empathyRaw));

  // Stability: Earth century resonance based on birth year.
  // Bounded between 15 and 95
  const stabilityRaw = (year % 100) + 15;
  const stability = Math.max(15, Math.min(95, stabilityRaw));

  return {
    logic,
    drive,
    empathy,
    stability
  };
}
