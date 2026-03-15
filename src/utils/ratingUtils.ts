const TOTAL_STARS = 5;
const MAX_VOTE = 10;

/**
 * Convert a TMDB vote_average (0–10) to a star count out of 5.
 * Rounds to the nearest 0.5.
 */
export function voteToStars(voteAverage: number): number {
  if (voteAverage < 0) return 0;
  if (voteAverage > MAX_VOTE) return TOTAL_STARS;
  const stars = (voteAverage / MAX_VOTE) * TOTAL_STARS;
  return Math.round(stars * 2) / 2; // round to nearest 0.5
}

/**
 * Format a TMDB vote_average for display.
 * e.g. 8.347 → "8.3"
 */
export function formatRating(voteAverage: number | null | undefined): string {
  if (voteAverage == null || isNaN(voteAverage)) return 'N/A';
  return voteAverage.toFixed(1);
}

/**
 * Get a color representing the rating quality.
 */
export function getRatingColor(voteAverage: number): string {
  if (voteAverage >= 7.5) return '#4CAF50'; // green
  if (voteAverage >= 6.0) return '#FFD700'; // gold
  if (voteAverage >= 4.0) return '#FF9800'; // orange
  return '#CF6679'; // red
}

/**
 * Build an array of star states for rendering.
 * e.g. stars=3.5 → ['full','full','full','half','empty']
 */
export type StarState = 'full' | 'half' | 'empty';

export function buildStarArray(voteAverage: number): StarState[] {
  const stars = voteToStars(voteAverage);
  return Array.from({ length: TOTAL_STARS }, (_, i) => {
    const pos = i + 1;
    if (stars >= pos) return 'full';
    if (stars >= pos - 0.5) return 'half';
    return 'empty';
  });
}

export { TOTAL_STARS };
