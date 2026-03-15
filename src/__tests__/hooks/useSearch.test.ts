import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useSearch } from '../../hooks/useSearch';

// Mock the API module
jest.mock('../../api/tmdb', () => ({
  searchMovies: jest.fn(),
}));

// Mock debounce to be instant in tests
jest.mock('../../hooks/useDebounce', () => ({
  useDebounce: (value: string) => value,
}));

const mockSearchMovies = require('../../api/tmdb').searchMovies as jest.MockedFunction<
  typeof import('../../api/tmdb').searchMovies
>;

const MOCK_RESULTS = {
  page: 1,
  results: [
    {
      id: 1,
      title: 'Inception',
      overview: '',
      poster_path: null,
      backdrop_path: null,
      release_date: '2010-07-16',
      vote_average: 8.3,
      vote_count: 30000,
      popularity: 90,
      genre_ids: [],
      adult: false,
      original_language: 'en',
      original_title: 'Inception',
      video: false,
    },
  ],
  total_pages: 3,
  total_results: 50,
};

describe('useSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('starts with empty state', () => {
    const { result } = renderHook(() => useSearch());
    expect(result.current.query).toBe('');
    expect(result.current.results).toHaveLength(0);
    expect(result.current.isLoading).toBe(false);
  });

  it('does not search for empty query', async () => {
    const { result } = renderHook(() => useSearch());
    act(() => result.current.setQuery(''));
    await waitFor(() => {
      expect(mockSearchMovies).not.toHaveBeenCalled();
    });
  });

  it('calls searchMovies when query is set', async () => {
    mockSearchMovies.mockResolvedValueOnce(MOCK_RESULTS);
    const { result } = renderHook(() => useSearch());

    act(() => result.current.setQuery('inception'));

    await waitFor(() => {
      expect(mockSearchMovies).toHaveBeenCalledWith('inception', 1);
    });
  });

  it('updates results after search', async () => {
    mockSearchMovies.mockResolvedValueOnce(MOCK_RESULTS);
    const { result } = renderHook(() => useSearch());

    act(() => result.current.setQuery('inception'));

    await waitFor(() => {
      expect(result.current.results).toHaveLength(1);
      expect(result.current.results[0].title).toBe('Inception');
    });
  });

  it('sets hasMore correctly', async () => {
    mockSearchMovies.mockResolvedValueOnce(MOCK_RESULTS);
    const { result } = renderHook(() => useSearch());

    act(() => result.current.setQuery('test'));

    await waitFor(() => {
      expect(result.current.hasMore).toBe(true);
    });
  });

  it('clearSearch resets state', async () => {
    mockSearchMovies.mockResolvedValueOnce(MOCK_RESULTS);
    const { result } = renderHook(() => useSearch());

    act(() => result.current.setQuery('test'));
    await waitFor(() => expect(result.current.results).toHaveLength(1));

    act(() => result.current.clearSearch());
    expect(result.current.query).toBe('');
    expect(result.current.results).toHaveLength(0);
  });

  it('handles API error gracefully', async () => {
    mockSearchMovies.mockRejectedValueOnce(new Error('API failure'));
    const { result } = renderHook(() => useSearch());

    act(() => result.current.setQuery('error test'));

    await waitFor(() => {
      expect(result.current.error).toBe('Search failed. Please try again.');
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('loadMore fetches next page and appends results', async () => {
    const page2 = { ...MOCK_RESULTS, page: 2, results: [{ ...MOCK_RESULTS.results[0], id: 2, title: 'Interstellar' }] };
    mockSearchMovies.mockResolvedValueOnce(MOCK_RESULTS).mockResolvedValueOnce(page2);

    const { result } = renderHook(() => useSearch());
    act(() => result.current.setQuery('nolan'));
    await waitFor(() => expect(result.current.results).toHaveLength(1));

    act(() => result.current.loadMore());
    await waitFor(() => expect(result.current.results).toHaveLength(2));
    expect(mockSearchMovies).toHaveBeenCalledTimes(2);
  });

  it('loadMore is a no-op when no more pages', async () => {
    const singlePage = { ...MOCK_RESULTS, total_pages: 1 };
    mockSearchMovies.mockResolvedValueOnce(singlePage);

    const { result } = renderHook(() => useSearch());
    act(() => result.current.setQuery('test'));
    await waitFor(() => expect(result.current.hasMore).toBe(false));

    act(() => result.current.loadMore());
    // should NOT trigger a second API call
    expect(mockSearchMovies).toHaveBeenCalledTimes(1);
  });
});
