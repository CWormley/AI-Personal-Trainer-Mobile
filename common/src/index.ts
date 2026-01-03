/**
 * ============================================================================
 * Common Shared Types and Utilities
 * ============================================================================
 * 
 * This module provides shared TypeScript types and utility functions used
 * across the AI Personal Trainer Mobile application (mobile and service).
 * 
 * @module common/src/index
 */

// ============================================================================
// Types
// ============================================================================

/**
 * Represents a user in the system
 */
export interface User {
  id: string;
  name: string;
  email: string;
}

/**
 * Generic API response wrapper
 * 
 * @template T The type of data in the response
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ============================================================================
// Utilities
// ============================================================================

/**
 * Format a Date object to ISO date string (YYYY-MM-DD)
 * 
 * @param date - The Date object to format
 * @returns Formatted date string in YYYY-MM-DD format
 */
export const formatDate = (date: Date): string => {
  const datePart = date.toISOString().split('T')[0];
  return datePart!;
};
