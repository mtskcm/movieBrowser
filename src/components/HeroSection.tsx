import React from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Movie } from '../types/movie';
import { getBackdropUrl, BACKDROP_PLACEHOLDER_BLURHASH } from '../utils/imageUtils';
import { formatRating } from '../utils/ratingUtils';
import { getYear } from '../utils/dateUtils';
import { colors, spacing, typography, HERO_HEIGHT } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface HeroSectionProps {
  movie: Movie;
  onPress: (movie: Movie) => void;
  scrollY: Animated.SharedValue<number>;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ movie, onPress, scrollY }) => {
  const backdropUrl = getBackdropUrl(movie.backdrop_path, 'large');

  const imageStyle = useAnimatedStyle(() => {
    const translateY = interpolate(scrollY.value, [0, HERO_HEIGHT], [0, HERO_HEIGHT * 0.4], {
      extrapolateLeft: Extrapolation.CLAMP,
      extrapolateRight: Extrapolation.CLAMP,
    });
    const scale = interpolate(scrollY.value, [-HERO_HEIGHT, 0], [1.5, 1], {
      extrapolateLeft: Extrapolation.CLAMP,
      extrapolateRight: Extrapolation.CLAMP,
    });
    return { transform: [{ translateY }, { scale }] };
  });

  return (
    <Pressable onPress={() => onPress(movie)} style={styles.container}>
      <Animated.View style={[styles.imageContainer, imageStyle]}>
        <Image
          source={backdropUrl ? { uri: backdropUrl } : null}
          style={styles.image}
          placeholder={BACKDROP_PLACEHOLDER_BLURHASH}
          contentFit="cover"
          transition={400}
        />
      </Animated.View>
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)', colors.background]}
        style={styles.gradient}
      />
      <View style={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>NOW PLAYING</Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>
        <View style={styles.meta}>
          <Text style={styles.metaText}>★ {formatRating(movie.vote_average)}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.metaText}>{getYear(movie.release_date)}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: HERO_HEIGHT,
    overflow: 'hidden',
  },
  imageContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    position: 'absolute',
    bottom: spacing.xxl,
    left: spacing.lg,
    right: spacing.lg,
  },
  badge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  badgeText: {
    color: colors.textPrimary,
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
    letterSpacing: 1,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.fontSizes.xxxl,
    fontWeight: typography.fontWeights.bold,
    lineHeight: typography.fontSizes.xxxl * 1.2,
    marginBottom: spacing.sm,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  metaText: {
    color: colors.textSecondary,
    fontSize: typography.fontSizes.md,
  },
  dot: {
    color: colors.textMuted,
  },
});
