/**
 * Extract the 4-digit year from a TMDB date string (YYYY-MM-DD).
 * Returns an empty string if the date is missing or malformed.
 */
export function getYear(dateString: string | null | undefined): string {
  if (!dateString) return '';
  const year = dateString.split('-')[0];
  return year && year.length === 4 ? year : '';
}

/**
 * Format a TMDB date string into a readable locale string.
 * e.g. "2024-05-24" → "May 24, 2024"
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'Unknown';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Unknown';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return 'Unknown';
  }
}

/**
 * Convert minutes to a "Xh Ym" display string.
 * e.g. 148 → "2h 28m"
 */
export function formatRuntime(minutes: number | null | undefined): string {
  if (!minutes || minutes <= 0) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}
