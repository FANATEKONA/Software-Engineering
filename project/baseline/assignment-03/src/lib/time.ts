/** Converts integer minutes after midnight to an HH:MM string. Handles 1440 → "24:00". */
export function minutesToLabel(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** Parses an HH:MM string into integer minutes. Returns null if the string is malformed. */
export function timeInputToMinutes(value: string): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return h * 60 + m;
}

/** Formats a minute range as "HH:MM–HH:MM". */
export function formatRange(start: number, end: number): string {
  return `${minutesToLabel(start)}–${minutesToLabel(end)}`;
}
