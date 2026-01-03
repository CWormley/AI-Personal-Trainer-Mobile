/**
 * ============================================================================
 * Jest Test Environment Setup
 * ============================================================================
 * 
 * Configures the test environment for Jest by mocking native modules
 * and React Native dependencies that cannot be directly tested in Node.js.
 * 
 * Mocked Modules:
 * 1. AsyncStorage - Mock persistent storage (returns in-memory storage)
 * 2. react-native-gesture-handler - Mock gesture recognition
 * 3. react-native-screens - Mock screen navigation primitives
 * 4. react-native-safe-area-context - Mock safe area provider
 * 5. @react-navigation/native - Mock navigation utilities
 * 
 * Setup Steps:
 * - Creates mock implementations of native modules
 * - Sets up gesture handler root view with View component
 * - Provides safe area inset defaults (all zero for tests)
 * - Enables mock navigation context
 * 
 * Run Before Each Test Suite:
 * - Jest automatically loads this file
 * - All mocks are reset between test suites
 * 
 * Usage:
 * Tests can now import and use these modules without native dependencies
 * 
 * Example:
 * ```
 * import AsyncStorage from '@react-native-async-storage/async-storage';
 * // Now safe to use in tests - returns mock implementation
 * ```
 * 
 * @module mobile/jest.setup.js
 * @see https://jestjs.io/docs/configuration#setupfilesafterenv-array
 */

// ============================================================================
// AsyncStorage Mock
// ============================================================================

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// ============================================================================
// React Native Module Mocks
// ============================================================================

// Mock React Native modules
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    GestureHandlerRootView: View,
    State: {},
    PanGestureHandler: View,
    BaseButton: View,
    Directions: {},
  };
});

jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
  Screen: 'Screen',
  ScreenContainer: 'ScreenContainer',
}));

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children }) => children,
    useSafeAreaInsets: () => inset,
  };
});

// Mock navigation
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    NavigationContainer: ({ children }) => children,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      canGoBack: jest.fn(() => true),
    }),
    useFocusEffect: jest.fn(),
  };
});

jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: ({ children }) => children,
  }),
}));

// Additional mocks can be added here as needed
