/**
 * ============================================================================
 * User Management Routes
 * ============================================================================
 * 
 * API endpoints for managing user profiles and data, including:
 * - Retrieve all users
 * - Get user by ID or email
 * - Create new user
 * - Update user profile
 * - Delete user account
 * 
 * All endpoints return standardized JSON responses with success flag.
 * 
 * @module service/routes/users.js
 */

import express from 'express';
import { userService } from '../db/index.js';

const router = express.Router();

// ============================================================================
// Routes
// ============================================================================

/**
 * GET /api/users
 * Retrieve all users (admin endpoint)
 * 
 * @returns {Array} List of all users
 * @status {200} Users retrieved successfully
 * @status {500} Server error
 */
router.get('/', async (req, res) => {
  try {
    const users = await userService.getAll();
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users', success: false });
  }
});

/**
 * GET /api/users/:id
 * Retrieve a user by their ID
 * 
 * @param {string} req.params.id - User ID
 * 
 * @returns {Object} User profile data
 * @status {200} User found
 * @status {404} User not found
 * @status {500} Server error
 */
router.get('/:id', async (req, res) => {
  try {
    const user = await userService.getById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        success: false 
      });
    }
    
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user',
      success: false 
    });
  }
});

/**
 * POST /api/users
 * Create a new user account
 * 
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - User email (required)
 * @param {string} req.body.name - User's full name (optional)
 * 
 * @returns {Object} Created user data
 * @status {201} User created successfully
 * @status {400} Validation error
 * @status {409} Email already registered
 * @status {500} Server error
 */
router.post('/', async (req, res) => {
  try {
    const { email, name } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        error: 'Email is required',
        success: false 
      });
    }
    
    // Check if user already exists
    const existingUser = await userService.getByEmail(email);
    if (existingUser) {
      return res.status(409).json({ 
        error: 'User with this email already exists',
        success: false 
      });
    }
    
    const user = await userService.create({ email, name });
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ 
      error: 'Failed to create user',
      success: false 
    });
  }
});

/**
 * PUT /api/users/:id
 * Update user profile information
 * 
 * @param {string} req.params.id - User ID
 * @param {Object} req.body - Fields to update
 * @param {string} req.body.name - Updated full name
 * 
 * @returns {Object} Updated user data
 * @status {200} User updated successfully
 * @status {404} User not found
 * @status {500} Server error
 */
router.put('/:id', async (req, res) => {
  try {
    const { name } = req.body;
    
    // First check if user exists
    const existingUser = await userService.getById(req.params.id);
    if (!existingUser) {
      return res.status(404).json({ 
        error: 'User not found',
        success: false 
      });
    }
    
    const user = await userService.update(req.params.id, { name });
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error updating user:', error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2025') {
      return res.status(404).json({ 
        error: 'User not found',
        success: false 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to update user',
      success: false 
    });
  }
});

/**
 * DELETE /api/users/:id
 * Delete a user account
 * 
 * @param {string} req.params.id - User ID
 * 
 * @returns {Object} Success message
 * @status {200} User deleted successfully
 * @status {404} User not found
 * @status {500} Server error
 */
router.delete('/:id', async (req, res) => {
  try {
    await userService.delete(req.params.id);
    res.json({ 
      success: true, 
      message: 'User deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ 
      error: 'Failed to delete user',
      success: false 
    });
  }
});

/**
 * GET /api/users/email/:email
 * Retrieve a user by email address
 * 
 * @param {string} req.params.email - User email
 * 
 * @returns {Object} User profile data
 * @status {200} User found
 * @status {404} User not found
 * @status {500} Server error
 */
router.get('/email/:email', async (req, res) => {
  try {
    const user = await userService.getByEmail(req.params.email);
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        success: false 
      });
    }
    
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error fetching user by email:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user',
      success: false 
    });
  }
});

export default router;
