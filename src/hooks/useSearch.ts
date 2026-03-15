import { useCallback, useEffect, useRef, useState } from 'react';
import { searchMovies } from '../api/tmdb';
import { Movie } from '../types/movie';
import { useDebounce } from './useDebounce';
import { SEARCH_DEBOUNCE_MS } from '../constants/api';

interface UseSearchState {
  query: string;
  setQuery: (q: string) => void;
  results: Movie[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  clearSearch: () => void;
}

export function useSearch(): UseSearchState {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const isMounted = useRef(true);

  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_MS);

  const performSearch = useCallback(async (searchQuery: string, page: number) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setCurrentPage(1);
      setTotalPages(1);
      return;
    }
    if (page === 1) setIsLoading(true);
    else setIsLoadingMore(true);
    setError(null);

    try {
      const data = await searchMovies(searchQuery, page);
      if (!isMounted.current) return;
      if (page === 1) {
        setResults(data.results);
      } else {
        setResults((prev) => [...prev, ...data.results]);
      }
      setCurrentPage(data.page);
      setTotalPages(data.total_pages);
    } catch (err) {
      if (!isMounted.current) return;
      setError('Search failed. Please try again.');
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    }
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    performSearch(debouncedQuery, 1);
  }, [debouncedQuery, performSearch]);

  const loadMore = useCallback(() => {
    if (isLoadingMore || currentPage >= totalPages) return;
    performSearch(debouncedQuery, currentPage + 1);
  }, [isLoadingMore, currentPage, totalPages, debouncedQuery, performSearch]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setCurrentPage(1);
    setTotalPages(1);
    setError(null);
  }, []);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return {
    query,
    setQuery,
    results,
    isLoading,
    isLoadingMore,
    error,
    hasMore: currentPage < totalPages,
    loadMore,
    clearSearch,
  };
}
