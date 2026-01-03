/**
 * ============================================================================
 * Environment Variables Type Definitions
 * ============================================================================
 * 
 * Provides TypeScript type definitions for environment variables
 * loaded from .env file using react-native-dotenv.
 * 
 * @module mobile/src/types/env.d.ts
 */

declare module '@env' {
  /** Backend API service URL (e.g., http://localhost:5000) */
  export const SERVICE_URL: string;
}