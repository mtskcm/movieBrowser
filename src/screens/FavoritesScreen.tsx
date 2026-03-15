import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
  FadeOut,
  Layout,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { useFavorites } from '../hooks/useFavorites';
import { Movie } from '../types/movie';
import { FavoritesScreenNavigationProp } from '../types/navigation';
import { getPosterUrl, POSTER_PLACEHOLDER_BLURHASH } from '../utils/imageUtils';
import { getYear } from '../utils/dateUtils';
import { formatRating } from '../utils/ratingUtils';
import { colors, spacing, borderRadius, typography } from '../constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface FavoriteItemProps {
  movie: Movie;
  onPress: (movie: Movie) => void;
  onRemove: (id: number) => void;
  index: number;
}

const FavoriteItem: React.FC<FavoriteItemProps> = ({ movie, onPress, onRemove, index }) => {
  const scale = useSharedValue(1);
  const posterUrl = getPosterUrl(movie.poster_path, 'medium');

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleRemove = () => {
    scale.value = withSpring(0, { damping: 10 }, () => {
      // removal triggers re-render
    });
    onRemove(movie.id);
  };

  return (
    <Animated.View
      entering={FadeIn.delay(index * 60).duration(350)}
      exiting={FadeOut.duration(250)}
      layout={Layout.springify()}
      style={styles.itemWrapper}
    >
      <AnimatedPressable
        onPress={() => onPress(movie)}
        onPressIn={() => { scale.value = withSpring(0.97, { damping: 10 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 10 }); }}
        style={[styles.item, cardStyle]}
        testID="favorite-item"
      >
        <View style={styles.posterWrap}>
          <Image
            source={posterUrl ? { uri: posterUrl } : null}
            style={styles.poster}
            placeholder={POSTER_PLACEHOLDER_BLURHASH}
            contentFit="cover"
            transition={300}
          />
        </View>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>{movie.title}</Text>
          <Text style={styles.year}>{getYear(movie.release_date)}</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.rating}>★ {formatRating(movie.vote_average)}</Text>
          </View>
          {movie.overview ? (
            <Text style={styles.overview} numberOfLines={3}>{movie.overview}</Text>
          ) : null}
        </View>
        <Pressable
          onPress={handleRemove}
          style={styles.removeButton}
          hitSlop={8}
          testID="remove-favorite-button"
        >
          <Text style={styles.removeIcon}>✕</Text>
        </Pressable>
      </AnimatedPressable>
    </Animated.View>
  );
};

export const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const { favorites, removeFavorite } = useFavorites();

  const handleMoviePress = (movie: Movie) => {
    navigation.navigate('Detail', { movieId: movie.id, movieTitle: movie.title });
  };

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Favorites</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🎬</Text>
          <Text style={styles.emptyTitle}>No favorites yet</Text>
          <Text style={styles.emptySubtitle}>
            Tap the heart icon on any movie to save it here for later
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Favorites</Text>
        <Text style={styles.headerCount}>{favorites.length} movies</Text>
      </View>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <FavoriteItem
            movie={item}
            onPress={handleMoviePress}
            onRemove={removeFavorite}
            index={index}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.bold,
  },
  headerCount: {
    color: colors.textMuted,
    fontSize: typography.fontSizes.sm,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  itemWrapper: {
    marginBottom: spacing.md,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    gap: spacing.md,
    padding: spacing.sm,
  },
  posterWrap: {
    width: 80,
    height: 120,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.semiBold,
    lineHeight: 22,
  },
  year: {
    color: colors.textMuted,
    fontSize: typography.fontSizes.sm,
  },
  ratingRow: {
    flexDirection: 'row',
  },
  rating: {
    color: colors.accent,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.semiBold,
  },
  overview: {
    color: colors.textSecondary,
    fontSize: typography.fontSizes.sm,
    lineHeight: 18,
  },
  removeButton: {
    padding: spacing.sm,
    alignSelf: 'flex-start',
  },
  removeIcon: {
    color: colors.textMuted,
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxxl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.bold,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  emptySubtitle: {
    color: colors.textSecondary,
    fontSize: typography.fontSizes.md,
    textAlign: 'center',
    lineHeight: 24,
  },
});
