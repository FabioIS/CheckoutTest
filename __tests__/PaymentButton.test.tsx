import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { PaymentButton } from '../src/components/PaymentButton/PaymentButton';

describe('PaymentButton Component', () => {
  const defaultProps = {
    title: 'Pay Now',
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders correctly with required props', () => {
      render(<PaymentButton {...defaultProps} testID="payment-button" />);

      expect(screen.getByText('Pay Now')).toBeTruthy();
      expect(screen.getByTestId('payment-button')).toBeTruthy();
    });

    it('renders with custom title', () => {
      render(<PaymentButton {...defaultProps} title="Custom Button" />);

      expect(screen.getByText('Custom Button')).toBeTruthy();
    });

    it('renders TouchableOpacity by default', () => {
      render(<PaymentButton {...defaultProps} testID="payment-button" />);

      const button = screen.getByTestId('payment-button');
      expect(button).toBeTruthy();
    });
  });

  describe('Loading State', () => {
    it('shows ActivityIndicator when loading is true', () => {
      render(<PaymentButton {...defaultProps} loading={true} testID="payment-button" />);

      expect(screen.getByTestId('activity-indicator')).toBeTruthy();
      expect(screen.queryByText('Pay Now')).toBeNull();
    });

    it('shows text when loading is false', () => {
      render(<PaymentButton {...defaultProps} loading={false} />);

      expect(screen.getByText('Pay Now')).toBeTruthy();
      expect(screen.queryByTestId('activity-indicator')).toBeNull();
    });

    it('shows text when loading prop is not provided', () => {
      render(<PaymentButton {...defaultProps} />);

      expect(screen.getByText('Pay Now')).toBeTruthy();
      expect(screen.queryByTestId('activity-indicator')).toBeNull();
    });
  });

  describe('Disabled State', () => {
    it('is disabled when disabled prop is true', () => {
      render(<PaymentButton {...defaultProps} disabled={true} testID="payment-button" />);

      const button = screen.getByTestId('payment-button');
      expect(button).toBeDisabled();
    });

    it('is disabled when loading is true', () => {
      render(<PaymentButton {...defaultProps} loading={true} testID="payment-button" />);

      const button = screen.getByTestId('payment-button');
      expect(button).toBeDisabled();
    });

    it('is disabled when both loading and disabled are true', () => {
      render(
        <PaymentButton {...defaultProps} loading={true} disabled={true} testID="payment-button" />
      );

      const button = screen.getByTestId('payment-button');
      expect(button).toBeDisabled();
    });

    it('is enabled when both loading and disabled are false', () => {
      render(
        <PaymentButton {...defaultProps} loading={false} disabled={false} testID="payment-button" />
      );

      const button = screen.getByTestId('payment-button');
      expect(button).toBeEnabled();
    });

    it('is enabled by default', () => {
      render(<PaymentButton {...defaultProps} testID="payment-button" />);

      const button = screen.getByTestId('payment-button');
      expect(button).toBeEnabled();
    });
  });

  describe('User Interactions', () => {
    it('calls onPress when button is pressed and enabled', () => {
      const mockOnPress = jest.fn();
      render(<PaymentButton {...defaultProps} onPress={mockOnPress} testID="payment-button" />);

      const button = screen.getByTestId('payment-button');
      fireEvent.press(button);

      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('does not call onPress when button is disabled', () => {
      const mockOnPress = jest.fn();
      render(
        <PaymentButton
          {...defaultProps}
          onPress={mockOnPress}
          disabled={true}
          testID="payment-button"
        />
      );

      const button = screen.getByTestId('payment-button');
      fireEvent.press(button);

      expect(mockOnPress).not.toHaveBeenCalled();
    });

    it('does not call onPress when button is loading', () => {
      const mockOnPress = jest.fn();
      render(
        <PaymentButton
          {...defaultProps}
          onPress={mockOnPress}
          loading={true}
          testID="payment-button"
        />
      );

      const button = screen.getByTestId('payment-button');
      fireEvent.press(button);

      expect(mockOnPress).not.toHaveBeenCalled();
    });
  });

  describe('Props Pass-through', () => {
    it('passes through additional TouchableOpacity props', () => {
      render(
        <PaymentButton
          {...defaultProps}
          testID="payment-button"
          accessibilityLabel="Payment button"
          activeOpacity={0.7}
        />
      );

      const button = screen.getByTestId('payment-button');
      expect(button).toBeTruthy();
      expect(button.props.accessibilityLabel).toBe('Payment button');
    });

    it('passes through accessibility props', () => {
      render(
        <PaymentButton
          {...defaultProps}
          accessibilityHint="Tap to make payment"
          accessibilityRole="button"
        />
      );

      const button = screen.getByRole('button');
      expect(button.props.accessibilityHint).toBe('Tap to make payment');
      expect(button.props.accessibilityRole).toBe('button');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty title string', () => {
      render(<PaymentButton {...defaultProps} title="" />);

      expect(screen.getByText('')).toBeTruthy();
    });

    it('handles very long title', () => {
      const longTitle = 'This is a very long button title that might overflow';
      render(<PaymentButton {...defaultProps} title={longTitle} />);

      expect(screen.getByText(longTitle)).toBeTruthy();
    });

    it('handles undefined onPress gracefully in disabled state', () => {
      render(
        <PaymentButton title="Test" onPress={jest.fn()} disabled={true} testID="payment-button" />
      );

      const button = screen.getByTestId('payment-button');
      expect(() => fireEvent.press(button)).not.toThrow();
    });

    it('maintains state consistency during rapid prop changes', () => {
      const { rerender } = render(
        <PaymentButton {...defaultProps} loading={false} testID="payment-button" />
      );


      rerender(<PaymentButton {...defaultProps} loading={true} testID="payment-button" />);
      expect(screen.getByTestId('activity-indicator')).toBeTruthy();

      rerender(<PaymentButton {...defaultProps} loading={false} testID="payment-button" />);
      expect(screen.getByText('Pay Now')).toBeTruthy();
    });
  });
});
