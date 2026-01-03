/**
 * ============================================================================
 * Babel Configuration
 * ============================================================================
 * 
 * Configures Babel transpiler for React Native (Expo) project.
 * 
 * Features:
 * - Uses Expo preset for React Native compatibility
 * - Loads environment variables from .env file
 * - Injects variables into JavaScript at build time
 * - Supports dynamic environment-based configuration
 * 
 * Presets:
 * - babel-preset-expo: Automatic target environment detection for React Native
 * 
 * Plugins:
 * - react-native-dotenv: Load .env variables (imported via @env)
 * 
 * Usage in Code:
 * ```
 * import { SERVICE_URL, DEBUG } from '@env';
 * ```
 * 
 * Required .env Variables:
 * - SERVICE_URL: Backend API endpoint
 * - DEBUG: Enable debug logging (optional)
 * 
 * @module mobile/babel.config.js
 * @see https://expo.dev/
 * @see https://github.com/goatandsheep/react-native-dotenv
 */

module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env',
      blacklist: null,
      whitelist: null,
      safe: false,
      allowUndefined: true
    }]
  ]
};

