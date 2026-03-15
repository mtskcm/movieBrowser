import { act, renderHook } from '@testing-library/react-native';
import { useFavoritesStore } from '../../store/favoritesStore';
import { Movie } from '../../types/movie';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

const MOCK_MOVIE: Movie = {
  id: 1,
  title: 'Inception',
  overview: 'A thief who enters dreams',
  poster_path: '/inception.jpg',
  backdrop_path: '/backdrop.jpg',
  release_date: '2010-07-16',
  vote_average: 8.3,
  vote_count: 35000,
  popularity: 95,
  genre_ids: [28, 878],
  adult: false,
  original_language: 'en',
  original_title: 'Inception',
  video: false,
};

const MOCK_MOVIE_2: Movie = {
  ...MOCK_MOVIE,
  id: 2,
  title: 'The Dark Knight',
};

describe('favoritesStore', () => {
  beforeEach(() => {
    // Reset store between tests
    const { result } = renderHook(() => useFavoritesStore());
    act(() => result.current.clearFavorites());
  });

  it('starts with empty favorites', () => {
    const { result } = renderHook(() => useFavoritesStore());
    expect(result.current.favorites).toHaveLength(0);
  });

  it('adds a favorite', () => {
    const { result } = renderHook(() => useFavoritesStore());
    act(() => result.current.addFavorite(MOCK_MOVIE));
    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites[0].id).toBe(1);
  });

  it('does not add duplicate favorites', () => {
    const { result } = renderHook(() => useFavoritesStore());
    act(() => {
      result.current.addFavorite(MOCK_MOVIE);
      result.current.addFavorite(MOCK_MOVIE);
    });
    expect(result.current.favorites).toHaveLength(1);
  });

  it('removes a favorite', () => {
    const { result } = renderHook(() => useFavoritesStore());
    act(() => {
      result.current.addFavorite(MOCK_MOVIE);
      result.current.addFavorite(MOCK_MOVIE_2);
    });
    act(() => result.current.removeFavorite(1));
    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites[0].id).toBe(2);
  });

  it('isFavorite returns true for saved movie', () => {
    const { result } = renderHook(() => useFavoritesStore());
    act(() => result.current.addFavorite(MOCK_MOVIE));
    expect(result.current.isFavorite(1)).toBe(true);
  });

  it('isFavorite returns false for unsaved movie', () => {
    const { result } = renderHook(() => useFavoritesStore());
    expect(result.current.isFavorite(999)).toBe(false);
  });

  it('clearFavorites empties the list', () => {
    const { result } = renderHook(() => useFavoritesStore());
    act(() => {
      result.current.addFavorite(MOCK_MOVIE);
      result.current.addFavorite(MOCK_MOVIE_2);
    });
    act(() => result.current.clearFavorites());
    expect(result.current.favorites).toHaveLength(0);
  });

  it('prepends new favorites to the top', () => {
    const { result } = renderHook(() => useFavoritesStore());
    act(() => {
      result.current.addFavorite(MOCK_MOVIE);
      result.current.addFavorite(MOCK_MOVIE_2);
    });
    expect(result.current.favorites[0].id).toBe(2);
    expect(result.current.favorites[1].id).toBe(1);
  });
});
