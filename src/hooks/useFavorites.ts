import { useCallback } from 'react';
import { useFavoritesStore } from '../store/favoritesStore';
import { Movie } from '../types/movie';

interface UseFavoritesReturn {
  favorites: Movie[];
  addFavorite: (movie: Movie) => void;
  removeFavorite: (movieId: number) => void;
  toggleFavorite: (movie: Movie) => void;
  isFavorite: (movieId: number) => boolean;
  clearFavorites: () => void;
}

export function useFavorites(): UseFavoritesReturn {
  const { favorites, addFavorite, removeFavorite, isFavorite, clearFavorites } =
    useFavoritesStore();

  const toggleFavorite = useCallback(
    (movie: Movie) => {
      if (isFavorite(movie.id)) {
        removeFavorite(movie.id);
      } else {
        addFavorite(movie);
      }
    },
    [isFavorite, addFavorite, removeFavorite]
  );

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
  };
}
