import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  FadeIn,
} from 'react-native-reanimated';
import { Movie } from '../types/movie';
import { getPosterUrl, POSTER_PLACEHOLDER_BLURHASH } from '../utils/imageUtils';
import { getYear } from '../utils/dateUtils';
import { formatRating } from '../utils/ratingUtils';
import {
  colors,
  spacing,
  borderRadius,
  typography,
  CARD_WIDTH,
  CARD_HEIGHT,
} from '../constants/theme';

interface MovieCardProps {
  movie: Movie;
  onPress: (movie: Movie) => void;
  index?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onPress, index = 0 }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    const delay = index * 50;
    opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
    translateY.value = withDelay(delay, withSpring(0, { damping: 15 }));
  }, [index, opacity, translateY]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 10, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 200 });
  };

  const posterUrl = getPosterUrl(movie.poster_path, 'medium');

  return (
    <AnimatedPressable
      onPress={() => onPress(movie)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.container, cardStyle]}
      testID="movie-card"
    >
      <View style={styles.imageContainer}>
        <Image
          source={posterUrl ? { uri: posterUrl } : null}
          style={styles.poster}
          placeholder={POSTER_PLACEHOLDER_BLURHASH}
          contentFit="cover"
          transition={300}
        />
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>★ {formatRating(movie.vote_average)}</Text>
        </View>
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {movie.title}
      </Text>
      <Text style={styles.year}>{getYear(movie.release_date)}</Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginRight: spacing.md,
  },
  imageContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  poster: {
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
});
