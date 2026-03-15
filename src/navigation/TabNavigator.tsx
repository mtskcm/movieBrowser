import React from 'react';
import { StyleSheet, Text, View, Pressable, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeScreen } from '../screens/HomeScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { TabParamList } from '../types/navigation';
import { colors, spacing, typography, TAB_BAR_HEIGHT } from '../constants/theme';
import { useFavoritesStore } from '../store/favoritesStore';

const Tab = createBottomTabNavigator<TabParamList>();

const TABS: { name: keyof TabParamList; icon: string; activeIcon: string; label: string }[] = [
  { name: 'Home', icon: '🏠', activeIcon: '🏠', label: 'Home' },
  { name: 'Search', icon: '🔍', activeIcon: '🔍', label: 'Search' },
  { name: 'Favorites', icon: '🤍', activeIcon: '❤️', label: 'Favorites' },
];

interface TabBarButtonProps {
  icon: string;
  activeIcon: string;
  label: string;
  isFocused: boolean;
  onPress: () => void;
  badgeCount?: number;
}

const TabBarButton: React.FC<TabBarButtonProps> = ({
  icon,
  activeIcon,
  label,
  isFocused,
  onPress,
  badgeCount,
}) => {
  const scale = useSharedValue(isFocused ? 1.1 : 1);
  const translateY = useSharedValue(isFocused ? -2 : 0);

  React.useEffect(() => {
    scale.value = withSpring(isFocused ? 1.15 : 1, { damping: 12 });
    translateY.value = withSpring(isFocused ? -3 : 0, { damping: 12 });
  }, [isFocused]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  return (
    <Pressable onPress={onPress} style={styles.tabButton}>
      <Animated.View style={[styles.tabIconWrap, animStyle]}>
        <Text style={styles.tabIcon}>{isFocused ? activeIcon : icon}</Text>
        {badgeCount != null && badgeCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeCount > 99 ? '99+' : badgeCount}</Text>
          </View>
        )}
      </Animated.View>
      <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>{label}</Text>
    </Pressable>
  );
};

const CustomTabBar: React.FC<any> = ({ state, navigation }) => {
  const insets = useSafeAreaInsets();
  const favCount = useFavoritesStore((s) => s.favorites.length);

  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom }]}>
      {state.routes.map((route: any, index: number) => {
        const tab = TABS[index];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TabBarButton
            key={route.key}
            icon={tab.icon}
            activeIcon={tab.activeIcon}
            label={tab.label}
            isFocused={isFocused}
            onPress={onPress}
            badgeCount={route.name === 'Favorites' ? favCount : undefined}
          />
        );
      })}
    </View>
  );
};

export const TabNavigator: React.FC = () => (
  <Tab.Navigator
    tabBar={(props) => <CustomTabBar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Search" component={SearchScreen} />
    <Tab.Screen name="Favorites" component={FavoritesScreen} />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: TAB_BAR_HEIGHT + 20,
    alignItems: 'center',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.sm,
    gap: spacing.xxs,
  },
  tabIconWrap: {
    position: 'relative',
  },
  tabIcon: {
    fontSize: 22,
  },
  tabLabel: {
    color: colors.textMuted,
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.medium,
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: typography.fontWeights.bold,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: colors.primary,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: colors.textPrimary,
    fontSize: 9,
    fontWeight: typography.fontWeights.bold,
  },
});
