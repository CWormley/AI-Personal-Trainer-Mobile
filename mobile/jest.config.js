/**
 * ============================================================================
 * Jest Test Configuration
 * ============================================================================
 * 
 * Configures Jest testing framework for React Native (Expo) project.
 * 
 * Features:
 * - React Native preset for compatible transformations
 * - Setup file for test environment initialization
 * - Module path aliasing for cleaner imports (@/ → src/)
 * - Transform ignore patterns for native modules
 * 
 * Preset: react-native
 * - Provides React Native-specific transformations and test environment
 * 
 * Setup Files:
 * - jest.setup.js: Initializes test environment, mocks globals
 * 
 * Module Name Mapper:
 * - @/*: Maps to src/* for shorter import paths in tests
 * - Example: import MyComponent from '@/components/MyComponent'
 * 
 * Transform Ignore Patterns:
 * - Excludes node_modules except for React Native and navigation libraries
 * - Ensures third-party React Native modules are properly transformed
 * 
 * Usage:
 * $ npm test
 * $ npm run test:watch
 * $ npm run test:coverage
 * 
 * @module mobile/jest.config.js
 * @see https://jestjs.io/docs/en/configuration
 * @see https://github.com/facebook/react-native/tree/main/packages/react-native-jestutils
 */

module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-navigation|@react-navigation|@react-native-community|react-native-gesture-handler|react-native-screens|react-native-safe-area-context|@react-native-async-storage)/)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

