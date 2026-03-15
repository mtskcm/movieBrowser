import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  MainTabs: undefined;
  Detail: { movieId: number; movieTitle: string };
};

export type TabParamList = {
  Home: undefined;
  Search: undefined;
  Favorites: undefined;
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export type SearchScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Search'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export type FavoritesScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Favorites'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;
