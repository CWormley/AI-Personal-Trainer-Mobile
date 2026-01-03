/**
 * ============================================================================
 * Loading Screen
 * ============================================================================
 * 
 * Simple loading indicator screen displayed while checking authentication
 * or loading initial app data.
 * 
 * @module mobile/src/screens/LoadingScreen
 */

import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

// ============================================================================
// Component
// ============================================================================

/**
 * Loading screen shown while checking authentication status
 * 
 * @returns Loading screen component with spinner and text
 */
const LoadingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Spinning activity indicator */}
      <ActivityIndicator size="large" color="#007AFF" />
      
      {/* Loading text */}
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
};

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  // Main container - centered flex layout
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  
  // Loading text styling
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});

export default LoadingScreen;
