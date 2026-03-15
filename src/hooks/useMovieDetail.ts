import { useCallback, useEffect, useRef, useState } from 'react';
import { getMovieDetail, getMovieCredits, getSimilarMovies } from '../api/tmdb';
import { MovieDetail } from '../types/movie';
import { CastMember } from '../types/cast';
import { Movie } from '../types/movie';

interface UseMovieDetailState {
  movie: MovieDetail | null;
  cast: CastMember[];
  similar: Movie[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useMovieDetail(movieId: number): UseMovieDetailState {
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [similar, setSimilar] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  const fetchDetail = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [movieData, creditsData, similarData] = await Promise.all([
        getMovieDetail(movieId),
        getMovieCredits(movieId),
        getSimilarMovies(movieId),
      ]);
      if (!isMounted.current) return;
      setMovie(movieData);
      // Show top 15 cast members sorted by order
      setCast(
        creditsData.cast
          .filter((c) => c.profile_path)
          .sort((a, b) => a.order - b.order)
          .slice(0, 15)
      );
      setSimilar(similarData.results.slice(0, 10));
    } catch (err) {
      if (!isMounted.current) return;
      setError('Failed to load movie details. Please try again.');
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  }, [movieId]);

  useEffect(() => {
    isMounted.current = true;
    fetchDetail();
    return () => {
      isMounted.current = false;
    };
  }, [fetchDetail]);

  return { movie, cast, similar, isLoading, error, refresh: fetchDetail };
}
