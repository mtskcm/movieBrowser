import { TMDB_IMAGE_BASE_URL, IMAGE_SIZES } from '../constants/api';

/**
 * Build a full TMDB image URL from a path and size.
 * Returns null when path is null/undefined (no poster available).
 */
export function getPosterUrl(
  posterPath: string | null | undefined,
  size: keyof typeof IMAGE_SIZES.poster = 'medium'
): string | null {
  if (!posterPath) return null;
  return `${TMDB_IMAGE_BASE_URL}${IMAGE_SIZES.poster[size]}${posterPath}`;
}

/**
 * Build a full TMDB backdrop URL from a path and size.
 */
export function getBackdropUrl(
  backdropPath: string | null | undefined,
  size: keyof typeof IMAGE_SIZES.backdrop = 'large'
): string | null {
  if (!backdropPath) return null;
  return `${TMDB_IMAGE_BASE_URL}${IMAGE_SIZES.backdrop[size]}${backdropPath}`;
}

/**
 * Build a full TMDB profile image URL for cast/crew.
 */
export function getProfileUrl(
  profilePath: string | null | undefined,
  size: keyof typeof IMAGE_SIZES.profile = 'medium'
): string | null {
  if (!profilePath) return null;
  return `${TMDB_IMAGE_BASE_URL}${IMAGE_SIZES.profile[size]}${profilePath}`;
}

/**
 * A static blurhash placeholder used while images are loading.
 * Generated from a generic dark gradient.
 */
export const POSTER_PLACEHOLDER_BLURHASH = 'L02}pB00_400fQ_4M{xu_4-;M{00';
export const BACKDROP_PLACEHOLDER_BLURHASH = 'L02}pB00_400fQ_4M{xu_4-;M{00';
