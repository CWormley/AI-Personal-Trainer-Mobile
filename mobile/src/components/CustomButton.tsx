/**
 * ============================================================================
 * Custom Button Component
 * ============================================================================
 * 
 * Reusable button component with multiple variants (primary, secondary, danger)
 * and disabled state styling.
 * 
 * @module mobile/src/components/CustomButton
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

// ============================================================================
// Types
// ============================================================================

/**
 * Props for CustomButton component
 */
interface CustomButtonProps {
  /** Button label text */
  title: string;
  /** Callback function when button is pressed */
  onPress: () => void;
  /** Button style variant */
  variant?: 'primary' | 'secondary' | 'danger';
  /** Whether button is disabled */
  disabled?: boolean;
}

// ============================================================================
// Component
// ============================================================================

/**
 * CustomButton component with configurable styling
 * 
 * Variants:
 * - primary: Blue background with white text (default)
 * - secondary: Transparent with blue border and text
 * - danger: Red background with white text
 * 
 * @param props - Component props
 * @returns CustomButton component
 */
const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
}) => {
  /**
   * Determine button style based on variant
   */
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return [styles.button, styles.secondaryButton];
      case 'danger':
        return [styles.button, styles.dangerButton];
      default:
        return [styles.button, styles.primaryButton];
    }
  };

  /**
   * Determine text style based on variant
   */
  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return [styles.buttonText, styles.secondaryButtonText];
      default:
        return [styles.buttonText, styles.primaryButtonText];
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.7}
    >
      <Text style={[getTextStyle(), disabled && styles.disabledText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  // Base button styling
  button: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginVertical: 8,
  },
  
  // Primary variant (blue background)
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  
  // Secondary variant (transparent with border)
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  
  // Danger variant (red background)
  dangerButton: {
    backgroundColor: '#FF3B30',
  },
  
  // Disabled state
  disabledButton: {
    backgroundColor: '#ccc',
  },
  
  // Text styling
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Primary text color
  primaryButtonText: {
    color: '#fff',
  },
  
  // Secondary text color
  secondaryButtonText: {
    color: '#007AFF',
  },
  
  // Disabled text color
  disabledText: {
    color: '#999',
  },
});

export default CustomButton;
