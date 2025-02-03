// Mock for @react-native/js-polyfills/error-guard.js
module.exports = {
  ErrorUtils: {
    setGlobalHandler: jest.fn(),
    getGlobalHandler: jest.fn(),
  },
};
