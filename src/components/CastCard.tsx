import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { CastMember } from '../types/cast';
import { getProfileUrl, POSTER_PLACEHOLDER_BLURHASH } from '../utils/imageUtils';
import { colors, spacing, borderRadius, typography } from '../constants/theme';

interface CastCardProps {
  cast: CastMember;
}

export const CastCard: React.FC<CastCardProps> = ({ cast }) => {
  const profileUrl = getProfileUrl(cast.profile_path, 'medium');

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={profileUrl ? { uri: profileUrl } : null}
          style={styles.image}
          placeholder={POSTER_PLACEHOLDER_BLURHASH}
          contentFit="cover"
          transition={300}
        />
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {cast.name}
      </Text>
      <Text style={styles.character} numberOfLines={2}>
        {cast.character}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 80,
    marginRight: spacing.md,
    alignItems: 'center',
  },
  imageContainer: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    marginBottom: spacing.xs,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  name: {
    color: colors.textPrimary,
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.semiBold,
    textAlign: 'center',
    lineHeight: 14,
  },
  character: {
    color: colors.textMuted,
    fontSize: typography.fontSizes.xs,
    textAlign: 'center',
    marginTop: spacing.xxs,
    lineHeight: 13,
  },
});
