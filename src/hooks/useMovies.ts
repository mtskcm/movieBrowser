import { useCallback, useEffect, useRef, useState } from 'react';
import { getPopularMovies, getNowPlaying, getGenres } from '../api/tmdb';
import { Movie, MovieListResponse } from '../types/movie';
import { Genre } from '../types/genre';

interface UseMoviesState {
  nowPlaying: Movie[];
  popular: Movie[];
  genres: Genre[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
}

export function useMovies(): UseMoviesState {
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const isMounted = useRef(true);

  const fetchInitial = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [nowPlayingData, popularData, genresData] = await Promise.all([
        getNowPlaying(),
        getPopularMovies(1),
        getGenres(),
      ]);
      if (!isMounted.current) return;
      setNowPlaying(nowPlayingData.results);
      setPopular(popularData.results);
      setTotalPages(popularData.total_pages);
      setCurrentPage(1);
      setGenres(genresData);
    } catch (err) {
      if (!isMounted.current) return;
      setError('Failed to load movies. Please try again.');
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || currentPage >= totalPages) return;
    const nextPage = currentPage + 1;
    setIsLoadingMore(true);
    try {
      const data: MovieListResponse = await getPopularMovies(nextPage);
      if (!isMounted.current) return;
      setPopular((prev) => [...prev, ...data.results]);
      setCurrentPage(nextPage);
      setTotalPages(data.total_pages);
    } catch (err) {
      // silently fail on pagination errors
    } finally {
      if (isMounted.current) setIsLoadingMore(false);
    }
  }, [isLoadingMore, currentPage, totalPages]);

  useEffect(() => {
    isMounted.current = true;
    fetchInitial();
    return () => {
      isMounted.current = false;
    };
  }, [fetchInitial]);

  return {
    nowPlaying,
    popular,
    genres,
    isLoading,
    isLoadingMore,
    error,
    currentPage,
    totalPages,
    hasMore: currentPage < totalPages,
    loadMore,
    refresh: fetchInitial,
  };
}
