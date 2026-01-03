/**
 * ============================================================================
 * Authentication Routes
 * ============================================================================
 * 
 * Handles user authentication including:
 * - User registration
 * - User login
 * - User logout
 * - Token validation
 * - JWT token generation and verification
 * 
 * All endpoints return standardized JSON responses with success flag and data.
 * 
 * @module service/routes/auth.js
 */

import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userService } from '../db/index.js';

const router = express.Router();

// ============================================================================
// Constants
// ============================================================================

/** Number of salt rounds for bcrypt password hashing (higher = more secure but slower) */
const SALT_ROUNDS = 12;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generate a JWT token for a user
 * 
 * @param {string} userId - The user's unique ID
 * @returns {string} JWT token string
 */
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

// ============================================================================
// Routes
// ============================================================================

/**
 * POST /api/auth/register
 * Register a new user account
 * 
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - User email (required)
 * @param {string} req.body.password - User password, min 6 chars (required)
 * @param {string} req.body.name - User's full name (optional)
 * 
 * @returns {Object} User data and JWT token
 * @status {201} User created successfully
 * @status {400} Validation error (missing fields, password too short)
 * @status {409} Email already registered
 * @status {500} Server error
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // ====================================================================
    // Input Validation
    // ====================================================================
    
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required',
        success: false 
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters long',
        success: false 
      });
    }
    
    // ====================================================================
    // Check for Duplicate Email
    // ====================================================================
    
    const existingUser = await userService.getByEmail(email);
    if (existingUser) {
      return res.status(409).json({ 
        error: 'User with this email already exists',
        success: false 
      });
    }
    
    // ====================================================================
    // Hash Password & Create User
    // ====================================================================
    
    // Hash password with bcrypt for secure storage
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    
    // Create user in database
    const user = await userService.create({ 
      email, 
      name, 
      passwordHash 
    });
    
    // ====================================================================
    // Generate Token & Return Response
    // ====================================================================
    
    const token = generateToken(user.id);
    const { passwordHash: _, ...userWithoutPassword } = user;
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ 
      error: 'Failed to register user',
      success: false 
    });
  }
});

/**
 * POST /api/auth/login
 * Authenticate user with email and password
 * 
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - User email (required)
 * @param {string} req.body.password - User password (required)
 * 
 * @returns {Object} User data and JWT token
 * @status {200} Login successful
 * @status {400} Validation error
 * @status {401} Invalid credentials
 * @status {500} Server error
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // ====================================================================
    // Input Validation
    // ====================================================================
    
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required',
        success: false 
      });
    }
    
    // ====================================================================
    // Find User by Email
    // ====================================================================
    
    const user = await userService.getByEmail(email);
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid email or password',
        success: false 
      });
    }
    
    // ====================================================================
    // Verify Password
    // ====================================================================
    
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Invalid email or password',
        success: false 
      });
    }
    
    // ====================================================================
    // Generate Token & Return Response
    // ====================================================================
    
    const token = generateToken(user.id);
    const { passwordHash: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ 
      error: 'Failed to login user',
      success: false 
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout user (server-side logout, client removes token)
 * 
 * @returns {Object} Success message
 * @status {200} Logout successful
 */
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful. Please remove the token from client storage.'
  });
});

/**
 * GET /api/auth/me
 * Get current authenticated user's profile
 * Requires valid JWT token in Authorization header
 * 
 * @param {string} req.headers.authorization - Bearer token (required)
 * 
 * @returns {Object} Current user profile data
 * @status {200} User found
 * @status {401} Token missing or invalid
 * @status {403} Token expired
 * @status {404} User not found
 * @status {500} Server error
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await userService.getById(req.userId);
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        success: false 
      });
    }
    
    // Return user data without password hash
    const { passwordHash: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user profile',
      success: false 
    });
  }
});

// ============================================================================
// Middleware
// ============================================================================

/**
 * Middleware to authenticate JWT token
 * Extracts token from Authorization header and verifies it
 * Populates req.userId and req.user if valid
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export function authenticateToken(req, res, next) {
  // Extract token from "Bearer TOKEN" format
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      error: 'Access token required',
      success: false 
    });
  }
  
  // Verify JWT token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ 
        error: 'Invalid or expired token',
        success: false 
      });
    }
    
    // Attach user ID to request for use in routes
    req.userId = decoded.userId;
    req.user = { id: decoded.userId };
    next();
  });
}

export default router;