/**
 * ============================================================================
 * Application Navigation Stack
 * ============================================================================
 * 
 * Manages the navigation structure of the application with:
 * - Conditional authentication stack (SignIn/SignUp)
 * - Main application stack (Home/Chat/Profile)
 * - Type-safe route parameters
 * 
 * @module mobile/src/navigation/AppNavigator
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ChatScreen from '../screens/ChatScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import LoadingScreen from '../screens/LoadingScreen';

// ============================================================================
// Types
// ============================================================================

/**
 * Type-safe route parameters for the root navigation stack
 * Defines all possible screens and their parameters
 */
export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Chat: undefined;
  SignIn: undefined;
  SignUp: undefined;
};

// ============================================================================
// Navigation Stacks
// ============================================================================

const Stack = createStackNavigator<RootStackParamList>();

/**
 * Authentication Stack
 * Displayed when user is not authenticated
 * Includes: SignIn, SignUp screens
 * 
 * @returns Navigation stack for authentication screens
 */
const AuthStack = () => (
  <Stack.Navigator 
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="SignIn" component={SignInScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
  </Stack.Navigator>
);

/**
 * Application Stack
 * Displayed when user is authenticated
 * Includes: Home, Chat, Profile screens
 * 
 * @returns Navigation stack for authenticated screens
 */
const AppStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Chat" component={ChatScreen} />
  </Stack.Navigator>
);

// ============================================================================
// Main Navigator
// ============================================================================

/**
 * Root navigator that switches between Auth and App stacks based on user state
 * Shows loading screen while checking authentication status
 * 
 * @returns The complete navigation structure
 */
const AppNavigator: React.FC = () => {
  const { user, isLoading } = useAuth();

  // Show loading screen while checking authentication
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
