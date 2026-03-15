import React from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  withSpring,
  useAnimatedRef,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Sharing from 'expo-sharing';

import { CastCard } from '../components/CastCard';
import { GenreChip } from '../components/GenreChip';
import { MovieCard } from '../components/MovieCard';
import { RatingStars } from '../components/RatingStars';
import { DetailSkeleton } from '../components/MovieSkeleton';
import { useMovieDetail } from '../hooks/useMovieDetail';
import { useFavorites } from '../hooks/useFavorites';
import { Movie } from '../types/movie';
import { DetailScreenRouteProp, RootStackNavigationProp } from '../types/navigation';
import { getBackdropUrl, BACKDROP_PLACEHOLDER_BLURHASH } from '../utils/imageUtils';
import { formatDate, formatRuntime } from '../utils/dateUtils';
import { formatRating, getRatingColor } from '../utils/ratingUtils';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HERO_HEIGHT = 420;

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export const DetailScreen: React.FC = () => {
  const route = useRoute<DetailScreenRouteProp>();
  const navigation = useNavigation<RootStackNavigationProp>();
  const { movieId } = route.params;

  const { movie, cast, similar, isLoading, error, refresh } = useMovieDetail(movieId);
  const { isFavorite, toggleFavorite } = useFavorites();

  const scrollY = useSharedValue(0);
  const favoriteScale = useSharedValue(1);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const heroStyle = useAnimatedStyle(() => {
    const translateY = interpolate(scrollY.value, [0, HERO_HEIGHT], [0, HERO_HEIGHT * 0.4], {
      extrapolateLeft: Extrapolation.CLAMP,
      extrapolateRight: Extrapolation.CLAMP,
    });
    return { transform: [{ translateY }] };
  });

  const favoriteStyle = useAnimatedStyle(() => ({
    transform: [{ scale: favoriteScale.value }],
  }));

  const handleToggleFavorite = () => {
    if (!movie) return;
    const movieAsMovie: Movie = {
      ...movie,
      genre_ids: movie.genres.map((g) => g.id),
    };
    toggleFavorite(movieAsMovie);
    favoriteScale.value = withSpring(1.3, { damping: 5 }, () => {
      favoriteScale.value = withSpring(1, { damping: 8 });
    });
  };

  const handleShare = async () => {
    if (!movie) return;
    try {
      await Share.share({
        message: `Check out "${movie.title}" (${formatDate(movie.release_date)}) — rated ${formatRating(movie.vote_average)}/10 on TMDB!`,
        title: movie.title,
      });
    } catch {
      // user dismissed share sheet
    }
  };

  const handleSimilarPress = (m: Movie) => {
    navigation.push('Detail', { movieId: m.id, movieTitle: m.title });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <DetailSkeleton />
        <SafeAreaView edges={['top']} style={styles.backButtonContainer}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </Pressable>
        </SafeAreaView>
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorEmoji}>😕</Text>
        <Text style={styles.errorText}>{error ?? 'Movie not found'}</Text>
        <Text style={styles.retryText} onPress={refresh}>
          Tap to retry
        </Text>
      </View>
    );
  }

  const backdropUrl = getBackdropUrl(movie.backdrop_path, 'large');
  const isFav = isFavorite(movie.id);

  return (
    <View style={styles.container}>
      <AnimatedScrollView
        style={styles.scroll}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Backdrop with parallax */}
        <View style={styles.heroContainer}>
          <Animated.View style={[styles.heroImageWrap, heroStyle]}>
            <Image
              source={backdropUrl ? { uri: backdropUrl } : null}
              style={styles.heroImage}
              placeholder={BACKDROP_PLACEHOLDER_BLURHASH}
              contentFit="cover"
              transition={400}
            />
          </Animated.View>
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.5)', colors.background]}
            style={StyleSheet.absoluteFill}
          />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title & actions */}
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={3}>
              {movie.title}
            </Text>
            <View style={styles.actions}>
              <Animated.View style={favoriteStyle}>
                <Pressable onPress={handleToggleFavorite} style={styles.actionButton} testID="favorite-button">
                  <Text style={[styles.actionIcon, isFav && styles.actionIconActive]}>
                    {isFav ? '❤️' : '🤍'}
                  </Text>
                </Pressable>
              </Animated.View>
              <Pressable onPress={handleShare} style={styles.actionButton} testID="share-button">
                <Text style={styles.actionIcon}>📤</Text>
              </Pressable>
            </View>
          </View>

          {/* Tagline */}
          {movie.tagline ? (
            <Text style={styles.tagline}>"{movie.tagline}"</Text>
          ) : null}

          {/* Meta row */}
          <View style={styles.metaRow}>
            <View style={[styles.ratingBadge, { backgroundColor: getRatingColor(movie.vote_average) + '33' }]}>
              <Text style={[styles.ratingValue, { color: getRatingColor(movie.vote_average) }]}>
                ★ {formatRating(movie.vote_average)}
              </Text>
            </View>
            <Text style={styles.metaDivider}>·</Text>
            <Text style={styles.metaText}>{formatDate(movie.release_date)}</Text>
            {movie.runtime ? (
              <>
                <Text style={styles.metaDivider}>·</Text>
                <Text style={styles.metaText}>{formatRuntime(movie.runtime)}</Text>
              </>
            ) : null}
          </View>

          <RatingStars voteAverage={movie.vote_average} size="md" showNumber={false} />

          {/* Genres */}
          {movie.genres.length > 0 && (
            <View style={styles.genresRow}>
              {movie.genres.map((genre) => (
                <View key={genre.id} style={styles.genreTag}>
                  <Text style={styles.genreText}>{genre.name}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.overview}>{movie.overview || 'No overview available.'}</Text>
          </View>

          {/* Cast */}
          {cast.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Cast</Text>
              <FlatList
                data={cast}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.castList}
                renderItem={({ item }) => <CastCard cast={item} />}
              />
            </View>
          )}

          {/* Similar */}
          {similar.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>You Might Also Like</Text>
              <FlatList
                data={similar}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.castList}
                renderItem={({ item, index }) => (
                  <MovieCard movie={item} onPress={handleSimilarPress} index={index} />
                )}
              />
            </View>
          )}

          <View style={styles.bottomPad} />
        </View>
      </AnimatedScrollView>

      {/* Back button overlaid */}
      <SafeAreaView edges={['top']} style={styles.backButtonContainer} pointerEvents="box-none">
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  heroContainer: {
    width: SCREEN_WIDTH,
    height: HERO_HEIGHT,
    overflow: 'hidden',
  },
  heroImageWrap: {
    ...StyleSheet.absoluteFillObject,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    paddingHorizontal: spacing.lg,
    marginTop: -spacing.xxxl,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  title: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.bold,
    lineHeight: typography.fontSizes.xxl * 1.25,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: 18,
  },
  actionIconActive: {
    // color applied per icon emoji
  },
  tagline: {
    color: colors.textMuted,
    fontSize: typography.fontSizes.md,
    fontStyle: 'italic',
    marginBottom: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  ratingBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.sm,
  },
  ratingValue: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.bold,
  },
  metaDivider: {
    color: colors.textMuted,
  },
  metaText: {
    color: colors.textSecondary,
    fontSize: typography.fontSizes.sm,
  },
  genresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  genreTag: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  genreText: {
    color: colors.textSecondary,
    fontSize: typography.fontSizes.xs,
  },
  section: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    marginBottom: spacing.md,
  },
  overview: {
    color: colors.textSecondary,
    fontSize: typography.fontSizes.md,
    lineHeight: 24,
  },
  castList: {
    paddingRight: spacing.lg,
  },
  bottomPad: {
    height: spacing.massive,
  },
  backButtonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  backButton: {
    marginLeft: spacing.lg,
    marginTop: spacing.sm,
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: typography.fontWeights.bold,
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
});
