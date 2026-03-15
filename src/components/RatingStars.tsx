import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { buildStarArray, formatRating } from '../utils/ratingUtils';
import { colors, spacing, typography } from '../constants/theme';

interface RatingStarsProps {
  voteAverage: number;
  showNumber?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_MAP = { sm: 10, md: 13, lg: 16 };

export const RatingStars: React.FC<RatingStarsProps> = ({
  voteAverage,
  showNumber = true,
  size = 'sm',
}) => {
  const stars = buildStarArray(voteAverage);
  const starSize = SIZE_MAP[size];

  return (
    <View style={styles.container}>
      <View style={styles.stars}>
        {stars.map((state, i) => (
          <Text
            key={i}
            style={[styles.star, { fontSize: starSize }]}
          >
            {state === 'full' ? '★' : state === 'half' ? '⭐' : '☆'}
          </Text>
        ))}
      </View>
      {showNumber && (
        <Text style={[styles.number, { fontSize: starSize - 1 }]}>
          {formatRating(voteAverage)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  stars: {
    flexDirection: 'row',
  },
  star: {
    color: colors.accent,
  },
  number: {
    color: colors.textSecondary,
    fontWeight: typography.fontWeights.medium,
  },
});
