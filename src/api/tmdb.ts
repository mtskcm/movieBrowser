import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { TMDB_BASE_URL, API_TIMEOUT_MS } from '../constants/api';
import { MovieListResponse, MovieDetail } from '../types/movie';
import { CreditsResponse } from '../types/cast';
import { Genre, GenreListResponse } from '../types/genre';
import { ENDPOINTS } from './endpoints';

// ─── Axios Instance ──────────────────────────────────────────────────────────

const tmdbClient: AxiosInstance = axios.create({
  baseURL: TMDB_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Request Interceptor: inject Bearer token ────────────────────────────────

tmdbClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = process.env.EXPO_PUBLIC_TMDB_API_KEY;
    if (!token) {
      console.warn('[TMDB] EXPO_PUBLIC_TMDB_API_KEY is not set. Please check your .env file.');
    }
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ─── Response Interceptor: error logging + data transform ────────────────────

tmdbClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      console.error(
        `[TMDB] API Error ${error.response.status}: ${error.config?.url}`,
        error.response.data
      );
    } else if (error.request) {
      console.error('[TMDB] Network Error: No response received', error.message);
    } else {
      console.error('[TMDB] Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// ─── API Functions ────────────────────────────────────────────────────────────

/**
 * Fetch a paginated list of popular movies.
 */
export async function getPopularMovies(page: number = 1): Promise<MovieListResponse> {
  const response = await tmdbClient.get<MovieListResponse>(ENDPOINTS.POPULAR, {
    params: { page },
  });
  return response.data;
}

/**
 * Fetch movies currently playing in theatres.
 */
export async function getNowPlaying(): Promise<MovieListResponse> {
  const response = await tmdbClient.get<MovieListResponse>(ENDPOINTS.NOW_PLAYING);
  return response.data;
}

/**
 * Search for movies by query string with optional pagination.
 */
export async function searchMovies(query: string, page: number = 1): Promise<MovieListResponse> {
  const response = await tmdbClient.get<MovieListResponse>(ENDPOINTS.SEARCH_MOVIES, {
    params: { query, page, include_adult: false },
  });
  return response.data;
}

/**
 * Fetch full detail for a single movie by its TMDB id.
 */
export async function getMovieDetail(id: number): Promise<MovieDetail> {
  const response = await tmdbClient.get<MovieDetail>(ENDPOINTS.MOVIE_DETAIL(id));
  return response.data;
}

/**
 * Fetch cast & crew credits for a movie.
 */
export async function getMovieCredits(id: number): Promise<CreditsResponse> {
  const response = await tmdbClient.get<CreditsResponse>(ENDPOINTS.MOVIE_CREDITS(id));
  return response.data;
}

/**
 * Fetch a list of movies similar to the given movie id.
 */
export async function getSimilarMovies(id: number): Promise<MovieListResponse> {
  const response = await tmdbClient.get<MovieListResponse>(ENDPOINTS.MOVIE_SIMILAR(id));
  return response.data;
}

/**
 * Fetch the official list of TMDB movie genres.
 */
export async function getGenres(): Promise<Genre[]> {
  const response = await tmdbClient.get<GenreListResponse>(ENDPOINTS.GENRE_LIST);
  return response.data.genres;
}

export { tmdbClient };
