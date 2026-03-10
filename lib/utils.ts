import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSyncCode(name: string, dateString: string, location: string): string {
  // Extract initials (up to 2 characters) from the name
  const nameParts = name.trim().split(/\s+/);
  let initials = "";
  if (nameParts.length >= 2) {
    initials = (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  } else if (nameParts.length === 1) {
    initials = nameParts[0].substring(0, 2).toUpperCase();
  }
  if (!initials) initials = "XX";

  // Process Date: Expected "MM/DD/YYYY" -> "MMDDYY"
  const dateParts = dateString.split('/');
  let dateChunk = "000000";
  if (dateParts.length === 3) {
    const month = dateParts[0].padStart(2, '0');
    const day = dateParts[1].padStart(2, '0');
    const year = dateParts[2].slice(-2).padStart(2, '0');
    dateChunk = `${month}${day}${year}`;
  } else {
    // If not standard, just strip and pad
    dateChunk = dateString.replace(/[^0-9]/g, '').slice(0, 6).padEnd(6, '0');
  }

  // Process Location: First 3 letters
  const locChunk = location.replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase().padEnd(3, 'X');

  return `${initials}-${dateChunk}-${locChunk}`;
}
