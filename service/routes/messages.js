/**
 * ============================================================================
 * Message History Routes
 * ============================================================================
 * 
 * API endpoints for managing chat message history and conversation data.
 * 
 * Features:
 * - Retrieve user message history with pagination
 * - Get recent conversation context
 * - Store new messages in database
 * - Support for message role tracking (user/assistant)
 * 
 * @module service/routes/messages.js
 */

import express from 'express';
import { messageService } from '../db/index.js';

const router = express.Router();

// ============================================================================
// Routes
// ============================================================================

/**
 * GET /api/messages/user/:userId
 * Retrieve message history for a user with pagination
 * 
 * @param {string} req.params.userId - User ID
 * @param {number} req.query.limit - Max messages to return (default: 50)
 * 
 * @returns {Array} Array of messages in chronological order
 * @status {200} Messages retrieved successfully
 * @status {500} Server error
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    
    const messages = await messageService.getByUser(userId, limit);
    res.json({ success: true, data: messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages', success: false });
  }
});

/**
 * GET /api/messages/conversation/:userId
 * Retrieve recent conversation for context loading
 * 
 * @param {string} req.params.userId - User ID
 * @param {number} req.query.limit - Recent messages to load (default: 10)
 * 
 * @returns {Array} Recent messages in reverse chronological order
 * @status {200} Conversation retrieved successfully
 * @status {500} Server error
 */
router.get('/conversation/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    
    const messages = await messageService.getConversation(userId, limit);
    res.json({ success: true, data: messages });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ error: 'Failed to fetch conversation', success: false });
  }
});

/**
 * POST /api/messages
 * Create a new message in the conversation
 * 
 * @param {Object} req.body - Request body
 * @param {string} req.body.text - Message text content (required)
 * @param {string} req.body.userId - User ID (required)
 * @param {string} req.body.role - Sender role: 'user' or 'assistant' (optional)
 * 
 * @returns {Object} Created message object
 * @status {201} Message created successfully
 * @status {400} Validation error
 * @status {500} Server error
 */
router.post('/', async (req, res) => {
  try {
    const { text, userId } = req.body;
    
    if (!text || !userId) {
      return res.status(400).json({ 
        error: 'Text and userId are required',
        success: false 
      });
    }
    
    const message = await messageService.create({ text, userId });
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Failed to create message', success: false });
  }
});

export default router;

// DELETE /api/messages/:id - Delete message
router.delete('/:id', async (req, res) => {
  try {
    await messageService.delete(req.params.id);
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

export default router;
