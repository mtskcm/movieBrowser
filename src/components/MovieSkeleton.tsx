import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, CARD_WIDTH, CARD_HEIGHT } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SkeletonBoxProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: object;
}

const SkeletonBox: React.FC<SkeletonBoxProps> = ({
  width,
  height,
  borderRadius: br = borderRadius.md,
  style,
}) => {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.linear }),
      -1,
      false
    );
  }, [shimmer]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(shimmer.value, [0, 1], [-SCREEN_WIDTH, SCREEN_WIDTH]) }],
  }));

  return (
    <View
      style={[
        { width: width as number, height, borderRadius: br, overflow: 'hidden' },
        styles.box,
        style,
      ]}
    >
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <LinearGradient
          colors={[colors.shimmerBase, colors.shimmerHighlight, colors.shimmerBase]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};

export const MovieCardSkeleton: React.FC = () => (
  <View style={styles.card}>
    <SkeletonBox width={CARD_WIDTH} height={CARD_HEIGHT} borderRadius={borderRadius.lg} />
    <SkeletonBox width={CARD_WIDTH - 8} height={12} style={{ marginTop: spacing.sm }} />
    <SkeletonBox width={60} height={10} style={{ marginTop: spacing.xs }} />
  </View>
);

export const MovieRowSkeleton: React.FC = () => (
  <View style={styles.row}>
    <SkeletonBox width={100} height={150} borderRadius={borderRadius.lg} />
    <View style={styles.rowContent}>
      <SkeletonBox width={180} height={14} />
      <SkeletonBox width={100} height={11} style={{ marginTop: spacing.sm }} />
      <SkeletonBox width={80} height={11} style={{ marginTop: spacing.xs }} />
    </View>
  </View>
);

export const DetailSkeleton: React.FC = () => (
  <View style={styles.detail}>
    <SkeletonBox width="100%" height={450} borderRadius={0} />
    <View style={styles.detailContent}>
      <SkeletonBox width="80%" height={24} />
      <SkeletonBox width="50%" height={14} style={{ marginTop: spacing.md }} />
      <SkeletonBox width="100%" height={12} style={{ marginTop: spacing.lg }} />
      <SkeletonBox width="100%" height={12} style={{ marginTop: spacing.xs }} />
      <SkeletonBox width="70%" height={12} style={{ marginTop: spacing.xs }} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.shimmerBase,
  },
  card: {
    marginRight: spacing.md,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  rowContent: {
    flex: 1,
    gap: spacing.xs,
    paddingTop: spacing.sm,
  },
  detail: {
    flex: 1,
  },
  detailContent: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
});
