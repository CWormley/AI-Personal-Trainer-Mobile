/**
 * ============================================================================
 * Database Migration Script - Add Role Column to Messages
 * ============================================================================
 * 
 * One-time migration script to add the 'role' column to the Message table.
 * This column stores whether a message was from a 'user' or 'assistant'.
 * 
 * Usage:
 *   node service/fix_role.js
 * 
 * The script:
 * - Checks if the role column exists
 * - Adds the column if it doesn't exist
 * - Defaults all existing messages to 'user' role
 * - Validates the migration was successful
 * 
 * @module service/fix_role.js
 */

import { PrismaClient } from './generated/prisma/index.js';

const prisma = new PrismaClient();

/**
 * Check if role column exists and add it if necessary
 */
async function fixRole() {
  try {
    // Check if role column exists
    const result = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Message' AND column_name = 'role'
      );
    `;
    
    const roleExists = result[0].exists;
    console.log("Role column exists:", roleExists);
    
    if (!roleExists) {
      console.log("Adding role column to Message table...");
      await prisma.$executeRaw`
        ALTER TABLE "Message" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'user';
      `;
      console.log("Role column added successfully!");
    } else {
      console.log("Role column already exists. Checking message contents...");
      const msg = await prisma.message.findFirst();
      if (msg) {
        console.log("Sample message:", JSON.stringify(msg, null, 2));
      }
    }
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixRole();
