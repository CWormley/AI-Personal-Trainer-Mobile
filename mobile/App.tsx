/**
 * ============================================================================
 * Main Application Entry Point
 * ============================================================================
 * 
 * Root component of the AI Personal Trainer Mobile application.
 * Configures the app structure with:
 * - SafeArea handling for notches and bottom bars
 * - Authentication context provider
 * - Navigation setup
 * - Theme-aware status bar
 * 
 * @module App
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

/**
 * Root App component that sets up the application structure and providers
 * 
 * @returns The main application component with all providers configured
 */
function App() {
  // Detect if device is in dark mode for theme-aware status bar
  const isDarkMode = useColorScheme() === 'dark';

  return (
    // GestureHandlerRootView enables swipe navigation and gesture support
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* SafeAreaProvider handles notches, bottom bars, and safe areas */}
      <SafeAreaProvider>
        {/* Status bar styling - light in dark mode, dark in light mode */}
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        
        {/* Authentication context provides user state and auth methods */}
        <AuthProvider>
          {/* Navigation stack manages screen transitions */}
          <AppNavigator />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
