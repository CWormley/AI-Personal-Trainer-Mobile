/**
 * ============================================================================
 * AI Memory Management Routes
 * ============================================================================
 * 
 * API endpoints for managing user context and long-term memory for the AI coach.
 * 
 * Features:
 * - Store and retrieve user profile summary
 * - Manage user goals and preferences
 * - Update AI memory with new learnings
 * - Support for embedding integration with vector store (Qdrant)
 * 
 * The AI memory system allows the coach to:
 * - Remember past conversations
 * - Track user preferences and communication style
 * - Store actionable goals for follow-up
 * 
 * @module service/routes/ai-memory.js
 */

import express from 'express';
import { aiMemoryService } from '../db/index.js';

const router = express.Router();

// ============================================================================
// Routes
// ============================================================================

/**
 * GET /api/ai-memory/:userId
 * Retrieve AI memory and user context for a specific user
 * 
 * @param {string} req.params.userId - User ID
 * 
 * @returns {Object} User memory including summary, goals, and preferences
 * @status {200} Memory retrieved successfully
 * @status {404} Memory not found for user
 * @status {500} Server error
 */
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const memory = await aiMemoryService.getByUser(userId);
    
    if (!memory) {
      return res.status(404).json({ 
        error: 'AI memory not found for this user',
        success: false 
      });
    }
    
    res.json({ success: true, data: memory });
  } catch (error) {
    console.error('Error fetching AI memory:', error);
    res.status(500).json({ error: 'Failed to fetch AI memory', success: false });
  }
});

/**
 * POST /api/ai-memory/:userId
 * Create or update AI memory for a user
 * 
 * @param {string} req.params.userId - User ID
 * @param {Object} req.body - Memory data to store
 * @param {string} req.body.summary - User profile summary (e.g., "Active, goal-oriented")
 * @param {Array} req.body.goals - User goals (e.g., ["fitness", "learning"])
 * @param {Object} req.body.preferences - Communication preferences
 * 
 * @returns {Object} Stored memory object
 * @status {200} Memory updated successfully
 * @status {400} Validation error
 * @status {404} User not found
 * @status {500} Server error
 */
router.post('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { summary, goals, preferences } = req.body;
    
    const memory = await aiMemoryService.upsert(userId, {
      summary,
      goals,
      preferences,
    });
    
    res.json({ success: true, data: memory });
  } catch (error) {
    console.error('Error updating AI memory:', error);
    
    // Handle specific error cases
    if (error.message.includes('User with ID') && error.message.includes('not found')) {
      return res.status(404).json({ error: 'User not found', success: false });
    }
    
    if (error.code === 'P2003') {
      return res.status(400).json({ 
        error: 'Invalid user ID - user does not exist',
        success: false 
      });
    }
    
    res.status(500).json({ error: 'Failed to update AI memory', success: false });
  }
});

// PATCH /api/ai-memory/:userId/goals - Update user goals
router.patch('/:userId/goals', async (req, res) => {
  try {
    const { userId } = req.params;
    const goals = req.body; // Accept the entire body as goals JSON
    
    if (!goals || Object.keys(goals).length === 0) {
      return res.status(400).json({ error: 'Goals data is required' });
    }
    
    const memory = await aiMemoryService.updateGoals(userId, goals);
    res.json({ success: true, data: memory });
  } catch (error) {
    console.error('Error updating goals:', error);
    
    // Handle specific error cases
    if (error.message.includes('User with ID') && error.message.includes('not found')) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Invalid user ID - user does not exist' });
    }
    
    res.status(500).json({ error: 'Failed to update goals' });
  }
});

// PATCH /api/ai-memory/:userId/preferences - Update user preferences
router.patch('/:userId/preferences', async (req, res) => {
  try {
    const { userId } = req.params;
    const preferences = req.body; // Accept the entire body as preferences JSON
    
    if (!preferences || Object.keys(preferences).length === 0) {
      return res.status(400).json({ error: 'Preferences data is required' });
    }
    
    const memory = await aiMemoryService.updatePreferences(userId, preferences);
    res.json({ success: true, data: memory });
  } catch (error) {
    console.error('Error updating preferences:', error);
    
    // Handle specific error cases
    if (error.message.includes('User with ID') && error.message.includes('not found')) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Invalid user ID - user does not exist' });
    }
    
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// DELETE /api/ai-memory/:userId - Delete AI memory
router.delete('/:userId', async (req, res) => {
  try {
    await aiMemoryService.delete(req.params.userId);
    res.json({ success: true, message: 'AI memory deleted successfully' });
  } catch (error) {
    console.error('Error deleting AI memory:', error);
    res.status(500).json({ error: 'Failed to delete AI memory' });
  }
});

export default router;
