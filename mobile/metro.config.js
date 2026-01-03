/**
 * ============================================================================
 * Metro Bundler Configuration
 * ============================================================================
 * 
 * Configures the Metro JavaScript bundler for React Native development.
 * Metro is responsible for bundling JavaScript code for React Native apps.
 * 
 * Documentation: https://reactnative.dev/docs/metro
 * 
 * @module mobile/metro.config.js
 * @type {import('@react-native/metro-config').MetroConfig}
 */

const { getDefaultConfig } = require('expo/metro-config');
const { mergeConfig } = require('@react-native/metro-config');

// ============================================================================
// Metro Configuration
// ============================================================================

const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
