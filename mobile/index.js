/**
 * ============================================================================
 * Mobile App Entry Point
 * ============================================================================
 * 
 * Registers the React Native app component with the OS.
 * This is the first file that gets executed when the app starts.
 * 
 * @module mobile/index.js
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Register the app component with the native host
AppRegistry.registerComponent('main', () => App);
AppRegistry.registerComponent(appName, () => App);
