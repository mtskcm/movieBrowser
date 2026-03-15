import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { useSharedValue } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { MovieCard } from '../components/MovieCard';
import { MovieGrid } from '../components/MovieGrid';
import { HeroSection } from '../components/HeroSection';
import { GenreChip } from '../components/GenreChip';
import { MovieCardSkeleton } from '../components/MovieSkeleton';
import { useMovies } from '../hooks/useMovies';
import { Movie } from '../types/movie';
import { HomeScreenNavigationProp } from '../types/navigation';
import { colors, spacing, typography } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { nowPlaying, popular, genres, isLoading, isLoadingMore, error, hasMore, loadMore, refresh } =
    useMovies();
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const scrollY = useSharedValue(0);

  const handleMoviePress = (movie: Movie) => {
    navigation.navigate('Detail', { movieId: movie.id, movieTitle: movie.title });
  };

  const filteredPopular = selectedGenreId
    ? popular.filter((m) => m.genre_ids.includes(selectedGenreId))
    : popular;

  const heroMovie = nowPlaying[0] ?? null;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.heroSkeleton} />
        <View style={styles.skeletonRow}>
          {Array.from({ length: 4 }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorEmoji}>😕</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.retryText} onPress={refresh}>
          Tap to retry
        </Text>
      </View>
    );
  }

  const PopularHeader = (
    <View>
      {/* Hero */}
      {heroMovie && (
        <HeroSection movie={heroMovie} onPress={handleMoviePress} scrollY={scrollY} />
      )}

      {/* Now Playing horizontal scroll */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Now Playing</Text>
        <FlatList
          data={nowPlaying}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          renderItem={({ item, index }) => (
            <MovieCard movie={item} onPress={handleMoviePress} index={index} />
          )}
        />
      </View>

      {/* Genre chips */}
      {genres.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse by Genre</Text>
          <FlatList
            data={[{ id: null, name: 'All' }, ...genres]}
            keyExtractor={(item) => String(item.id)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.genreList}
            renderItem={({ item }) => (
              <GenreChip
                label={item.name}
                selected={selectedGenreId === item.id}
                onPress={() => setSelectedGenreId(item.id as number | null)}
              />
            )}
          />
        </View>
      )}

      <Text style={[styles.sectionTitle, styles.popularTitle]}>Popular Movies</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <MovieGrid
        movies={filteredPopular}
        onMoviePress={handleMoviePress}
        onEndReached={hasMore ? loadMore : undefined}
        isLoadingMore={isLoadingMore}
        ListHeaderComponent={PopularHeader}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heroSkeleton: {
    width: SCREEN_WIDTH,
    height: 400,
    backgroundColor: colors.surface,
  },
  skeletonRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxxl,
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  errorText: {
    color: colors.textSecondary,
    fontSize: typography.fontSizes.lg,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  retryText: {
    color: colors.primary,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.semiBold,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  popularTitle: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  horizontalList: {
    paddingHorizontal: spacing.lg,
  },
  genreList: {
    paddingHorizontal: spacing.lg,
  },
});
