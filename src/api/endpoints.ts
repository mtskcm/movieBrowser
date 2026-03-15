export const ENDPOINTS = {
  // Movies
  POPULAR: '/movie/popular',
  NOW_PLAYING: '/movie/now_playing',
  TOP_RATED: '/movie/top_rated',
  UPCOMING: '/movie/upcoming',
  MOVIE_DETAIL: (id: number) => `/movie/${id}`,
  MOVIE_CREDITS: (id: number) => `/movie/${id}/credits`,
  MOVIE_SIMILAR: (id: number) => `/movie/${id}/similar`,
  MOVIE_VIDEOS: (id: number) => `/movie/${id}/videos`,

  // Search
  SEARCH_MOVIES: '/search/movie',

  // Genres
  GENRE_LIST: '/genre/movie/list',
} as const;
