/**
 * ============================================================================
 * Reminder Management Routes
 * ============================================================================
 * 
 * API endpoints for managing user reminders and task notifications.
 * 
 * Features:
 * - Create recurring and one-time reminders
 * - Retrieve reminders by status (completed/pending)
 * - Get upcoming reminders for notifications
 * - Update reminder status
 * - Delete reminders
 * - Support for recurring patterns (daily, weekly, monthly)
 * 
 * @module service/routes/reminders.js
 */

import express from 'express';
import { reminderService } from '../db/index.js';

const router = express.Router();

// ============================================================================
// Routes
// ============================================================================

/**
 * GET /api/reminders/user/:userId
 * Retrieve reminders for a user with optional completion filter
 * 
 * @param {string} req.params.userId - User ID
 * @param {boolean} req.query.includeCompleted - Include completed reminders (default: false)
 * 
 * @returns {Array} Array of reminders
 * @status {200} Reminders retrieved successfully
 * @status {500} Server error
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const includeCompleted = req.query.includeCompleted === 'true';
    
    const reminders = await reminderService.getByUser(userId, includeCompleted);
    res.json({ success: true, data: reminders });
  } catch (error) {
    console.error('Error fetching reminders:', error);
    res.status(500).json({ error: 'Failed to fetch reminders', success: false });
  }
});

/**
 * GET /api/reminders/upcoming/:userId
 * Retrieve upcoming reminders for push notifications
 * 
 * @param {string} req.params.userId - User ID
 * @param {number} req.query.days - Days ahead to check (default: 7)
 * 
 * @returns {Array} Array of upcoming reminders
 * @status {200} Reminders retrieved successfully
 * @status {500} Server error
 */
router.get('/upcoming/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const days = parseInt(req.query.days) || 7;
    
    const reminders = await reminderService.getUpcoming(userId, days);
    res.json({ success: true, data: reminders });
  } catch (error) {
    console.error('Error fetching upcoming reminders:', error);
    res.status(500).json({ error: 'Failed to fetch upcoming reminders', success: false });
  }
});

/**
 * POST /api/reminders
 * Create a new reminder
 * 
 * @param {Object} req.body - Request body
 * @param {string} req.body.userId - User ID (required)
 * @param {string} req.body.title - Reminder title (required)
 * @param {Date} req.body.dueDate - When reminder is due (required)
 * @param {string} req.body.repeatType - Repeat pattern: 'none', 'daily', 'weekly', 'monthly'
 * @param {Date} req.body.repeatUntil - When to stop repeating
 * @param {number} req.body.interval - Interval for repeating
 * 
 * @returns {Object} Created reminder object
 * @status {201} Reminder created successfully
 * @status {400} Validation error
 * @status {500} Server error
 */
router.post('/', async (req, res) => {
  try {
    const { userId, title, dueDate, repeatType, repeatUntil, interval } = req.body;
    
    if (!userId || !title || !dueDate) {
      return res.status(400).json({ 
        error: 'userId, title, and dueDate are required',
        success: false 
      });
    }
    
    const reminder = await reminderService.create({
      userId,
      title,
      dueDate,
      repeatType,
      repeatUntil,
      interval,
    });
    
    res.status(201).json({ success: true, data: reminder });
  } catch (error) {
    console.error('Error creating reminder:', error);
    res.status(500).json({ error: 'Failed to create reminder' });
  }
});

// PATCH /api/reminders/:id/complete - Mark reminder as completed
router.patch('/:id/complete', async (req, res) => {
  try {
    const reminder = await reminderService.markCompleted(req.params.id);
    res.json({ success: true, data: reminder });
  } catch (error) {
    console.error('Error completing reminder:', error);
    res.status(500).json({ error: 'Failed to complete reminder' });
  }
});

// PUT /api/reminders/:id - Update reminder
router.put('/:id', async (req, res) => {
  try {
    const { title, dueDate, repeatType, repeatUntil, interval } = req.body;
    
    const reminder = await reminderService.update(req.params.id, {
      title,
      dueDate,
      repeatType,
      repeatUntil,
      interval,
    });
    
    res.json({ success: true, data: reminder });
  } catch (error) {
    console.error('Error updating reminder:', error);
    res.status(500).json({ error: 'Failed to update reminder' });
  }
});

// DELETE /api/reminders/:id - Delete reminder
router.delete('/:id', async (req, res) => {
  try {
    await reminderService.delete(req.params.id);
    res.json({ success: true, message: 'Reminder deleted successfully' });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    res.status(500).json({ error: 'Failed to delete reminder' });
  }
});

export default router;
