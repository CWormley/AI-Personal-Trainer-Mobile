#!/usr/bin/env node

/**
 * ============================================================================
 * Swagger Documentation Auto-Regeneration Watcher
 * ============================================================================
 * 
 * Development utility that monitors file changes and triggers automatic
 * regeneration of Swagger/OpenAPI documentation when route or schema
 * files are modified.
 * 
 * Purpose:
 * - Watch Prisma schema and route files for changes
 * - Automatically trigger documentation regeneration via API endpoint
 * - Provide visual feedback in console for developer workflow
 * - Avoid regeneration spam with debouncing (1 second debounce)
 * 
 * Usage:
 * $ npm run swagger:watch
 * 
 * Environment:
 * - PORT: API server port (default: 5000)
 * - API_BASE_URL: Override server URL (optional)
 * 
 * Watched Files:
 * - prisma/schema.prisma - Database model changes
 * - routes/**\/*.js - API endpoint changes
 * - db/**\/*.js - Database service changes
 * 
 * @module service/swagger/watcher.js
 * @requires chokidar - File watching library
 * @requires node-fetch - HTTP client for regeneration requests
 */

import chokidar from 'chokidar';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__dirname); // Go up one level from swagger/ to service/

// ============================================================================
// Configuration
// ============================================================================

/** API server port */
const PORT = process.env.PORT || 5000;

/** Server base URL for regeneration endpoint */
const SERVER_URL = process.env.API_BASE_URL || `http://localhost:${PORT}`;

/** Endpoint to trigger documentation regeneration */
const REGENERATE_ENDPOINT = `${SERVER_URL}/api-docs/regenerate`;

// ============================================================================
// File Watching Configuration
// ============================================================================

// Files to watch for changes
const watchPaths = [
  path.join(__dirname, 'prisma/schema.prisma'),
  path.join(__dirname, 'routes/**/*.js'),
  path.join(__dirname, 'db/**/*.js'),
];

console.log('🔍 Watching for changes to auto-regenerate Swagger documentation...');
console.log('📁 Watching paths:');
watchPaths.forEach(p => console.log(`   - ${p}`));
console.log(`🌐 Server URL: ${SERVER_URL}/api-docs\n`);

// ============================================================================
// File Watcher Setup
// ============================================================================

// Create file watcher
const watcher = chokidar.watch(watchPaths, {
  ignored: /node_modules/,
  persistent: true,
  ignoreInitial: true
});

// ============================================================================
// Debouncing & Regeneration
// ============================================================================

// Debounce function to avoid too many regenerations
let regenerateTimeout;

/**
 * Debounce regeneration to prevent excessive API calls
 * Waits 1 second after last file change before regenerating
 * 
 * @param {string} filePath - Path of the changed file
 */
function debounceRegenerate(filePath) {
  clearTimeout(regenerateTimeout);
  regenerateTimeout = setTimeout(() => {
    regenerateSwaggerDocs(filePath);
  }, 1000); // Wait 1 second after last change
}

// Function to trigger documentation regeneration
async function regenerateSwaggerDocs(changedFile) {

  try {
    console.log(`📝 File changed: ${path.relative(__dirname, changedFile)}`);
    console.log('🔄 Regenerating Swagger documentation...');
    
    const response = await fetch(REGENERATE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Documentation regenerated successfully');
      console.log(`🌐 View updated docs at: ${SERVER_URL}/api-docs\n`);
    } else {
      console.error('❌ Failed to regenerate documentation:', response.statusText);
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('⚠️  Server not running. Start the server with: npm run dev');
    } else {
      console.error('❌ Error regenerating documentation:', error.message);
    }
  }
}

// Watch for file changes
watcher
  .on('change', debounceRegenerate)
  .on('add', debounceRegenerate)
  .on('unlink', debounceRegenerate)
  .on('ready', () => {
    console.log('👀 Watching for changes... (Press Ctrl+C to stop)');
  })
  .on('error', error => {
    console.error('❌ Watcher error:', error);
  });

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Stopping file watcher...');
  watcher.close();
  process.exit(0);
});
