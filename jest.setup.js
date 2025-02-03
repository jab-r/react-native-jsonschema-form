// Mock react-native-web-ui-components
jest.mock('react-native-web-ui-components', () => ({
  Row: 'View',
  Radiobox: 'View',
}));

// Mock react-native modules
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock react-native
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  // Mock StyleSheet
  RN.StyleSheet.create = styles => styles;

  // Mock Platform
  RN.Platform.select = jest.fn(obj => obj.ios || obj.default || {});
  RN.Platform.OS = 'ios';

  return RN;
});

// Mock window for web-specific code
global.window = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Mock console.error to avoid React Native warnings
global.console.error = (...args) => {
  if (args[0].includes('Warning:')) return;
  console.warn(...args);
};
