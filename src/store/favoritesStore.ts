import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Movie } from '../types/movie';

interface FavoritesState {
  favorites: Movie[];
  addFavorite: (movie: Movie) => void;
  removeFavorite: (movieId: number) => void;
  isFavorite: (movieId: number) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (movie: Movie) => {
        const { favorites } = get();
        if (!favorites.some((f) => f.id === movie.id)) {
          set({ favorites: [movie, ...favorites] });
        }
      },

      removeFavorite: (movieId: number) => {
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== movieId),
        }));
      },

      isFavorite: (movieId: number) => {
        return get().favorites.some((f) => f.id === movieId);
      },

      clearFavorites: () => {
        set({ favorites: [] });
      },
    }),
    {
      name: 'movie-browser-favorites',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
