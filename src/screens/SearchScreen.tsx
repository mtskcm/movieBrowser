import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { SearchBar } from '../components/SearchBar';
import { MovieRowSkeleton } from '../components/MovieSkeleton';
import { useSearch } from '../hooks/useSearch';
import { Movie } from '../types/movie';
import { SearchScreenNavigationProp } from '../types/navigation';
import { getPosterUrl, POSTER_PLACEHOLDER_BLURHASH } from '../utils/imageUtils';
import { getYear } from '../utils/dateUtils';
import { formatRating } from '../utils/ratingUtils';
import { colors, spacing, borderRadius, typography } from '../constants/theme';

const AnimatedView = Animated.createAnimatedComponent(View);

const SearchResultItem: React.FC<{ movie: Movie; onPress: (m: Movie) => void; index: number }> = ({
  movie,
  onPress,
  index,
}) => {
  const posterUrl = getPosterUrl(movie.poster_path, 'small');

  return (
    <Animated.View entering={FadeIn.delay(index * 40).duration(300)}>
      <Pressable
        onPress={() => onPress(movie)}
        style={({ pressed }) => [styles.resultItem, pressed && styles.resultItemPressed]}
        testID="search-result-item"
      >
        <View style={styles.resultPosterWrap}>
          <ExpoImage
            source={posterUrl ? { uri: posterUrl } : null}
            style={styles.resultPoster}
            placeholder={POSTER_PLACEHOLDER_BLURHASH}
            contentFit="cover"
            transition={300}
          />
        </View>
        <View style={styles.resultInfo}>
          <Text style={styles.resultTitle} numberOfLines={2}>
            {movie.title}
          </Text>
          <Text style={styles.resultYear}>{getYear(movie.release_date)}</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.ratingText}>★ {formatRating(movie.vote_average)}</Text>
            <Text style={styles.voteCount}>({movie.vote_count.toLocaleString()} votes)</Text>
          </View>
          {movie.overview ? (
            <Text style={styles.overview} numberOfLines={2}>
              {movie.overview}
            </Text>
          ) : null}
        </View>
      </Pressable>
    </Animated.View>
  );
};

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const { query, setQuery, results, isLoading, isLoadingMore, error, hasMore, loadMore, clearSearch } =
    useSearch();

  const handleMoviePress = (movie: Movie) => {
    navigation.navigate('Detail', { movieId: movie.id, movieTitle: movie.title });
  };

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View>
          {Array.from({ length: 6 }).map((_, i) => (
            <MovieRowSkeleton key={i} />
          ))}
        </View>
      );
    }
    if (query.trim() && !isLoading && results.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🎬</Text>
          <Text style={styles.emptyTitle}>No results found</Text>
          <Text style={styles.emptySubtitle}>
            Try a different title or check your spelling
          </Text>
        </View>
      );
    }
    if (!query.trim()) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={styles.emptyTitle}>Search for movies</Text>
          <Text style={styles.emptySubtitle}>
            Find any film from the TMDB database
          </Text>
        </View>
      );
    }
    return null;
  };

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.searchContainer}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onClear={clearSearch}
          autoFocus={false}
        />
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <SearchResultItem movie={item} onPress={handleMoviePress} index={index} />
        )}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={hasMore ? loadMore : undefined}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  resultItem: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  resultItemPressed: {
    backgroundColor: colors.surface,
  },
  resultPosterWrap: {
    width: 80,
    height: 120,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  resultPoster: {
    width: '100%',
    height: '100%',
  },
  resultInfo: {
    flex: 1,
    gap: spacing.xs,
    paddingTop: spacing.xxs,
  },
  resultTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.semiBold,
    lineHeight: 22,
  },
  resultYear: {
    color: colors.textMuted,
    fontSize: typography.fontSizes.sm,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  ratingText: {
    color: colors.accent,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.semiBold,
  },
  voteCount: {
    color: colors.textMuted,
    fontSize: typography.fontSizes.xs,
  },
  overview: {
    color: colors.textSecondary,
    fontSize: typography.fontSizes.sm,
    lineHeight: 18,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: spacing.xxxl,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    color: colors.textSecondary,
    fontSize: typography.fontSizes.md,
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  errorBanner: {
    backgroundColor: colors.error,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  errorText: {
    color: colors.textPrimary,
    fontSize: typography.fontSizes.sm,
    textAlign: 'center',
  },
});
