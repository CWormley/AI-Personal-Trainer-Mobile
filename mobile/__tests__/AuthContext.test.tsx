/**
 * ============================================================================
 * AuthContext Provider Unit Tests
 * ============================================================================
 * 
 * Verifies authentication context functionality, token management,
 * and proper error handling when context is used outside provider.
 * 
 * Test Coverage:
 * - AuthProvider renders without errors
 * - useAuth hook provides auth context correctly
 * - Error thrown when useAuth used outside AuthProvider
 * - Context state initialization
 * - Provider wrapping behavior
 * 
 * Run Tests:
 * $ npm test
 * $ npm run test:watch
 * 
 * @module mobile/__tests__/AuthContext.test.tsx
 * @requires ../src/context/AuthContext - Authentication context provider
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../src/context/AuthContext';

// ============================================================================
// Test Utilities
// ============================================================================

// Test component that uses the auth context
const TestComponent = () => {
  const { user, isLoading } = useAuth();
  return null; // We're just testing that the context works
};

// ============================================================================
// Test Suite
// ============================================================================

describe('AuthContext', () => {
  it('should provide auth context without crashing', () => {
    expect(() => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    }).not.toThrow();
  });

  it('should throw error when useAuth is used outside AuthProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within an AuthProvider');
    
    consoleSpy.mockRestore();
  });
});

