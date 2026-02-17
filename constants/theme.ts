/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  // Brand Identity
  primary: '#CCFF00',  // The "Offside" Neon Green
  background: '#0D0D0D', // Deep Black Background
  
  // UI Elements
  card: '#1F1F1F',     // Slightly lighter black for Cards
  border: 'rgba(255, 255, 255, 0.1)', // Thin borders
  
  // Text
  text: '#FFFFFF',     // Main White Text
  textMuted: '#A1A1A1', // Secondary Gray Text
  
  // Actions / States
  redCard: '#FF3B30',  // Danger / Red Card
  blue: '#0047AB',     // Link / Info (or Chelsea Blue)
  success: '#34C759',  // Success Green
  
  // Tab Bar
  tabInactive: '#555555',
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
