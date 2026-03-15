// We need to mock the axios instance used by tmdb.ts
// Since tmdb.ts creates its own instance, we mock at module level
jest.mock('axios', () => {
  const actual = jest.requireActual('axios');
  const mockInstance = {
    get: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    defaults: { headers: {} },
  };
  return {
    ...actual,
    create: jest.fn(() => mockInstance),
    default: { ...actual.default, create: jest.fn(() => mockInstance) },
  };
});

const mockGet = jest.fn();

beforeEach(() => {
  jest.resetModules();
  mockGet.mockReset();
});

const MOCK_MOVIE = {
  id: 1,
  title: 'Test Movie',
  overview: 'Test overview',
  poster_path: '/poster.jpg',
  backdrop_path: '/backdrop.jpg',
  release_date: '2024-01-01',
  vote_average: 7.5,
  vote_count: 1000,
  popularity: 100,
  genre_ids: [28, 12],
  adult: false,
  original_language: 'en',
  original_title: 'Test Movie',
  video: false,
};

const MOCK_LIST_RESPONSE = {
  page: 1,
  results: [MOCK_MOVIE],
  total_pages: 10,
  total_results: 200,
};

describe('TMDB API functions', () => {
  let tmdbModule: typeof import('../../api/tmdb');
  let axiosInstance: any;

  beforeEach(async () => {
    // Reset modules so we can get a fresh instance
    jest.resetModules();

    // Setup our mock
    const axiosMock = require('axios');
    axiosInstance = {
      get: mockGet,
      interceptors: {
        request: { use: jest.fn((fn) => fn) },
        response: { use: jest.fn((fn) => fn) },
      },
    };
    axiosMock.create.mockReturnValue(axiosInstance);

    tmdbModule = require('../../api/tmdb');
  });

  describe('getPopularMovies', () => {
    it('calls /movie/popular with page param', async () => {
      mockGet.mockResolvedValueOnce({ data: MOCK_LIST_RESPONSE });
      const result = await tmdbModule.getPopularMovies(1);
      expect(mockGet).toHaveBeenCalledWith('/movie/popular', { params: { page: 1 } });
      expect(result).toEqual(MOCK_LIST_RESPONSE);
    });

    it('defaults to page 1', async () => {
      mockGet.mockResolvedValueOnce({ data: MOCK_LIST_RESPONSE });
      await tmdbModule.getPopularMovies();
      expect(mockGet).toHaveBeenCalledWith('/movie/popular', { params: { page: 1 } });
    });

    it('throws on API error', async () => {
      mockGet.mockRejectedValueOnce(new Error('Network error'));
      await expect(tmdbModule.getPopularMovies()).rejects.toThrow('Network error');
    });
  });

  describe('getNowPlaying', () => {
    it('calls /movie/now_playing', async () => {
      mockGet.mockResolvedValueOnce({ data: MOCK_LIST_RESPONSE });
      const result = await tmdbModule.getNowPlaying();
      expect(mockGet).toHaveBeenCalledWith('/movie/now_playing');
      expect(result).toEqual(MOCK_LIST_RESPONSE);
    });
  });

  describe('searchMovies', () => {
    it('calls /search/movie with query and page', async () => {
      mockGet.mockResolvedValueOnce({ data: MOCK_LIST_RESPONSE });
      const result = await tmdbModule.searchMovies('inception', 2);
      expect(mockGet).toHaveBeenCalledWith('/search/movie', {
        params: { query: 'inception', page: 2, include_adult: false },
      });
      expect(result).toEqual(MOCK_LIST_RESPONSE);
    });

    it('defaults to page 1', async () => {
      mockGet.mockResolvedValueOnce({ data: MOCK_LIST_RESPONSE });
      await tmdbModule.searchMovies('test');
      expect(mockGet).toHaveBeenCalledWith('/search/movie', {
        params: { query: 'test', page: 1, include_adult: false },
      });
    });
  });

  describe('getMovieDetail', () => {
    it('calls /movie/{id}', async () => {
      const detail = { ...MOCK_MOVIE, genres: [{ id: 28, name: 'Action' }], runtime: 120, tagline: 'Test' };
      mockGet.mockResolvedValueOnce({ data: detail });
      const result = await tmdbModule.getMovieDetail(123);
      expect(mockGet).toHaveBeenCalledWith('/movie/123');
      expect(result).toEqual(detail);
    });
  });

  describe('getMovieCredits', () => {
    it('calls /movie/{id}/credits', async () => {
      const credits = { id: 123, cast: [], crew: [] };
      mockGet.mockResolvedValueOnce({ data: credits });
      const result = await tmdbModule.getMovieCredits(123);
      expect(mockGet).toHaveBeenCalledWith('/movie/123/credits');
      expect(result).toEqual(credits);
    });
  });

  describe('getSimilarMovies', () => {
    it('calls /movie/{id}/similar', async () => {
      mockGet.mockResolvedValueOnce({ data: MOCK_LIST_RESPONSE });
      const result = await tmdbModule.getSimilarMovies(456);
      expect(mockGet).toHaveBeenCalledWith('/movie/456/similar');
      expect(result).toEqual(MOCK_LIST_RESPONSE);
    });
  });

  describe('getGenres', () => {
    it('calls /genre/movie/list and returns genres array', async () => {
      const genreResponse = { genres: [{ id: 28, name: 'Action' }] };
      mockGet.mockResolvedValueOnce({ data: genreResponse });
      const result = await tmdbModule.getGenres();
      expect(mockGet).toHaveBeenCalledWith('/genre/movie/list');
      expect(result).toEqual([{ id: 28, name: 'Action' }]);
    });
  });
});
