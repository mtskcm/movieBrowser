import React from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';
import { Movie } from '../types/movie';
import { getPosterUrl, POSTER_PLACEHOLDER_BLURHASH } from '../utils/imageUtils';
import { getYear } from '../utils/dateUtils';
import { formatRating } from '../utils/ratingUtils';
import { colors, spacing, borderRadius, typography } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const NUM_COLUMNS = 2;
const ITEM_MARGIN = spacing.md;
const ITEM_WIDTH = (SCREEN_WIDTH - spacing.lg * 2 - ITEM_MARGIN) / NUM_COLUMNS;
const ITEM_HEIGHT = ITEM_WIDTH * 1.5;

interface GridItemProps {
  movie: Movie;
  onPress: (movie: Movie) => void;
  index: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const GridItem: React.FC<GridItemProps> = ({ movie, onPress, index }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(24);

  React.useEffect(() => {
    const delay = (index % 10) * 50;
    opacity.value = withDelay(delay, withTiming(1, { duration: 350 }));
    translateY.value = withDelay(delay, withSpring(0, { damping: 14 }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const posterUrl = getPosterUrl(movie.poster_path, 'medium');

  return (
    <AnimatedPressable
      onPress={() => onPress(movie)}
      onPressIn={() => { scale.value = withSpring(0.95, { damping: 10 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 10 }); }}
      style={[styles.item, animStyle]}
      testID="grid-movie-card"
    >
      <View style={styles.imageWrap}>
        <Image
          source={posterUrl ? { uri: posterUrl } : null}
          style={styles.image}
          placeholder={POSTER_PLACEHOLDER_BLURHASH}
          contentFit="cover"
          transition={300}
        />
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>★ {formatRating(movie.vote_average)}</Text>
        </View>
      </View>
      <Text style={styles.title} numberOfLines={2}>{movie.title}</Text>
      <Text style={styles.year}>{getYear(movie.release_date)}</Text>
    </AnimatedPressable>
  );
};

interface MovieGridProps {
  movies: Movie[];
  onMoviePress: (movie: Movie) => void;
  onEndReached?: () => void;
  isLoadingMore?: boolean;
  ListHeaderComponent?: React.ReactElement;
}

export const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  onMoviePress,
  onEndReached,
  isLoadingMore,
  ListHeaderComponent,
}) => {
  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  };

  return (
    <FlatList
      data={movies}
      keyExtractor={(item) => item.id.toString()}
      numColumns={NUM_COLUMNS}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.container}
      renderItem={({ item, index }) => (
        <GridItem movie={item} onPress={onMoviePress} index={index} />
      )}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      ListHeaderComponent={ListHeaderComponent}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: ITEM_MARGIN,
  },
  item: {
    width: ITEM_WIDTH,
  },
  imageWrap: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.sm,
  },
  ratingText: {
    color: colors.accent,
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.semiBold,
    marginTop: spacing.sm,
    lineHeight: 18,
  },
  year: {
    color: colors.textMuted,
    fontSize: typography.fontSizes.xs,
    marginTop: spacing.xxs,
  },
  footer: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
});
