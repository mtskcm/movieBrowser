import { renderHook, act } from '@testing-library/react-native';
import { useFavorites } from '../../hooks/useFavorites';
import { useFavoritesStore } from '../../store/favoritesStore';
import { Movie } from '../../types/movie';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

const MOCK_MOVIE: Movie = {
  id: 42,
  title: 'Test Movie',
  overview: 'Overview',
  poster_path: '/poster.jpg',
  backdrop_path: '/backdrop.jpg',
  release_date: '2023-01-01',
  vote_average: 7.0,
  vote_count: 5000,
  popularity: 80,
  genre_ids: [28],
  adult: false,
  original_language: 'en',
  original_title: 'Test Movie',
  video: false,
};

describe('useFavorites', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useFavoritesStore());
    act(() => result.current.clearFavorites());
  });

  it('provides empty favorites initially', () => {
    const { result } = renderHook(() => useFavorites());
    expect(result.current.favorites).toHaveLength(0);
  });

  it('addFavorite adds movie', () => {
    const { result } = renderHook(() => useFavorites());
    act(() => result.current.addFavorite(MOCK_MOVIE));
    expect(result.current.favorites).toHaveLength(1);
  });

  it('removeFavorite removes movie', () => {
    const { result } = renderHook(() => useFavorites());
    act(() => {
      result.current.addFavorite(MOCK_MOVIE);
      result.current.removeFavorite(MOCK_MOVIE.id);
    });
    expect(result.current.favorites).toHaveLength(0);
  });

  it('isFavorite returns correct boolean', () => {
    const { result } = renderHook(() => useFavorites());
    expect(result.current.isFavorite(42)).toBe(false);
    act(() => result.current.addFavorite(MOCK_MOVIE));
    expect(result.current.isFavorite(42)).toBe(true);
  });

  it('toggleFavorite adds when not favorite', () => {
    const { result } = renderHook(() => useFavorites());
    act(() => result.current.toggleFavorite(MOCK_MOVIE));
    expect(result.current.isFavorite(42)).toBe(true);
  });

  it('toggleFavorite removes when already favorite', () => {
    const { result } = renderHook(() => useFavorites());
    act(() => {
      result.current.addFavorite(MOCK_MOVIE);
      result.current.toggleFavorite(MOCK_MOVIE);
    });
    expect(result.current.isFavorite(42)).toBe(false);
  });

  it('clearFavorites removes all', () => {
    const { result } = renderHook(() => useFavorites());
    act(() => {
      result.current.addFavorite(MOCK_MOVIE);
      result.current.clearFavorites();
    });
    expect(result.current.favorites).toHaveLength(0);
  });
});
