export const colors = {
  // Backgrounds
  background: '#0D0D0F',
  surface: '#1A1A2E',
  surfaceElevated: '#16213E',
  card: '#1F1F3A',

  // Brand
  primary: '#E50914',
  primaryLight: '#FF3F47',
  primaryDark: '#B0070F',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0B0',
  textMuted: '#666680',
  textInverse: '#0D0D0F',

  // Accent
  accent: '#FFD700',
  accentGreen: '#4CAF50',
  accentBlue: '#2196F3',

  // UI
  border: '#2A2A4A',
  divider: '#1E1E3A',
  overlay: 'rgba(0,0,0,0.7)',
  overlayLight: 'rgba(0,0,0,0.4)',
  shimmerBase: '#1A1A2E',
  shimmerHighlight: '#2A2A4E',

  // Status
  error: '#CF6679',
  warning: '#FFB74D',
  success: '#4CAF50',

  // Transparent
  transparent: 'transparent',
} as const;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
  massive: 64,
} as const;

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
} as const;

export const typography = {
  fontSizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 22,
    xxxl: 28,
    display: 36,
  },
  fontWeights: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
    extraBold: '800' as const,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
} as const;

export const CARD_WIDTH = 140;
export const CARD_HEIGHT = 210;
export const GRID_COLUMNS = 2;
export const HERO_HEIGHT = 500;
export const TAB_BAR_HEIGHT = 60;
