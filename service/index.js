/**
 * ============================================================================
 * AI Personal Trainer Backend API Server
 * ============================================================================
 * 
 * Express.js server providing API endpoints for the AI Personal Trainer
 * mobile application. Includes authentication, chat, goals, reminders,
 * calendar, and AI memory management.
 * 
 * Environment Variables Required:
 * - PORT: Server port (default: 5000)
 * - DATABASE_URL: PostgreSQL connection string
 * - OPENAI_API_KEY: OpenAI API key for GPT models
 * - JWT_SECRET: Secret key for JWT token generation
 * 
 * @module service/index.js
 */

import 'dotenv/config';
import express from "express";
import cors from "cors";
import { disconnect } from "./db/index.js";
import { getSwaggerSpecs, createSwaggerMiddleware, swaggerUi, regenerateSwaggerDocs } from "./swagger.js";

// ============================================================================
// Route Imports
// ============================================================================

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import messageRoutes from "./routes/messages.js";
import reminderRoutes from "./routes/reminders.js";
import aiMemoryRoutes from "./routes/ai-memory.js";
import chatRoutes from "./routes/chat.js";
import goalRoutes from "./routes/goals.js";
import calendarRoutes from "./routes/calendar.js";

// ============================================================================
// Server Setup
// ============================================================================

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================================
// Middleware Configuration
// ============================================================================

/** Enable CORS for all routes */
app.use(cors());

/** Parse incoming JSON request bodies */
app.use(express.json());

// ============================================================================
// Routes
// ============================================================================

/**
 * Health check endpoint
 * Confirms the API server is running
 */
app.get("/", (req, res) => res.send("AI Life Coach API Server running ✅"));

/**
 * API Routes
 * Register in order of dependency to ensure proper middleware chain
 */
app.use("/api/auth", authRoutes);           // Authentication (login, register, logout)
app.use("/api/users", userRoutes);          // User profile management
app.use("/api/messages", messageRoutes);    // Message history
app.use("/api/reminders", reminderRoutes);  // Reminder management
app.use("/api/ai-memory", aiMemoryRoutes);  // User context and goals memory
app.use("/api/chat", chatRoutes);           // Chat with AI coach
app.use("/api/goals", goalRoutes);          // Goal management
app.use("/api/calendar", calendarRoutes);   // Calendar events

// ============================================================================
// Documentation Routes
// ============================================================================

/** Auto-updating Swagger middleware (after routes are registered) */
app.use(createSwaggerMiddleware(app));

/**
 * Swagger UI setup
 * Serves API documentation at /api-docs
 */
let swaggerSetup;

app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', async (req, res, next) => {
  try {
    // Always generate fresh specs to ensure routes are captured
    const specs = await getSwaggerSpecs(app);
    const setup = swaggerUi.setup(specs, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: "AI Life Coach API Documentation"
    });
    setup(req, res, next);
  } catch (error) {
    console.error('Error generating Swagger docs:', error);
    return res.status(500).send('Failed to generate API documentation');
  }
});

/**
 * Force regenerate API documentation
 * Useful during development when routes change
 */
app.post('/api-docs/regenerate', (req, res) => {
  regenerateSwaggerDocs();
  swaggerSetup = null; // Reset setup to force regeneration
  res.json({ success: true, message: 'Documentation will be regenerated on next request' });
});

// ============================================================================
// Error Handling Middleware
// ============================================================================

/**
 * Global error handler
 * Catches unhandled errors and returns standardized error response
 */
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message 
  });
});

/**
 * 404 handler
 * Catches requests to undefined routes
 */
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ============================================================================
// Graceful Shutdown
// ============================================================================

/**
 * Handle graceful shutdown
 * Closes database connections and exits cleanly
 */
const gracefulShutdown = async () => {
  console.log('Shutting down gracefully...');
  await disconnect();
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// ============================================================================
// Server Startup
// ============================================================================

app.listen(PORT, () => {
  console.log(`🚀 AI Life Coach API Server running on port ${PORT}`);
  console.log(`📖 API endpoints available at http://localhost:${PORT}/api`);
});

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log('Shutting down gracefully...');
  await disconnect();
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

app.listen(PORT, () => {
  console.log(`🚀 AI Life Coach API Server running on port ${PORT}`);
  console.log(`📖 API endpoints available at http://localhost:${PORT}/api`);
});