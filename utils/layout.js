import { Platform, useWindowDimensions } from 'react-native';

export const WEB_MAX_WIDTH = 1100;

export function useLayoutWidth() {
  const { width } = useWindowDimensions();
  if (Platform.OS === 'web') {
    return Math.min(width, WEB_MAX_WIDTH);
  }
  return width;
}

export function useIsWebDesktop() {
  const { width } = useWindowDimensions();
  return Platform.OS === 'web' && width >= 768;
}
