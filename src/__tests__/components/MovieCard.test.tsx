import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MovieCard } from '../../components/MovieCard';
import { Movie } from '../../types/movie';

// Mock expo-image
jest.mock('expo-image', () => ({
  Image: 'Image',
}));

// Mock reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

const MOCK_MOVIE: Movie = {
  id: 10,
  title: 'The Matrix',
  overview: 'A computer hacker learns about the true nature of his reality.',
  poster_path: '/matrix.jpg',
  backdrop_path: '/matrix_bg.jpg',
  release_date: '1999-03-31',
  vote_average: 8.7,
  vote_count: 24000,
  popularity: 97,
  genre_ids: [28, 878],
  adult: false,
  original_language: 'en',
  original_title: 'The Matrix',
  video: false,
};

describe('MovieCard', () => {
  it('renders movie title', () => {
    const { getByText } = render(
      <MovieCard movie={MOCK_MOVIE} onPress={jest.fn()} />
    );
    expect(getByText('The Matrix')).toBeTruthy();
  });

  it('renders release year', () => {
    const { getByText } = render(
      <MovieCard movie={MOCK_MOVIE} onPress={jest.fn()} />
    );
    expect(getByText('1999')).toBeTruthy();
  });

  it('renders rating badge', () => {
    const { getByText } = render(
      <MovieCard movie={MOCK_MOVIE} onPress={jest.fn()} />
    );
    expect(getByText('★ 8.7')).toBeTruthy();
  });

  it('calls onPress with movie when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <MovieCard movie={MOCK_MOVIE} onPress={onPress} />
    );
    fireEvent.press(getByTestId('movie-card'));
    expect(onPress).toHaveBeenCalledWith(MOCK_MOVIE);
  });

  it('does not throw when poster_path is null', () => {
    const movieNoPoster = { ...MOCK_MOVIE, poster_path: null };
    expect(() =>
      render(<MovieCard movie={movieNoPoster} onPress={jest.fn()} />)
    ).not.toThrow();
  });
});
