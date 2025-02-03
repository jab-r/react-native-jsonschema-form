import '@testing-library/react-native';
import { StyleSheet } from 'react-native';

// Mock react-native modules that aren't available in the test environment
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Platform: {
      ...RN.Platform,
      OS: 'ios',
      select: jest.fn(obj => obj.ios),
    },
    // Mock StyleSheet for snapshot testing
    StyleSheet: {
      ...RN.StyleSheet,
      create: (styles: Record<string, any>) => styles,
    },
  };
});

// Mock react-native-web-ui-components
jest.mock('react-native-web-ui-components', () => ({
  Row: 'View',
  Radiobox: 'View',
}));

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Add custom matchers
expect.extend({
  toBeVisible(received) {
    const pass = received !== null && received.props.style.display !== 'none';
    return {
      pass,
      message: () => `expected ${received} to be visible`,
    };
  },
});

// Add global type for custom matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeVisible(): R;
    }
  }
}
