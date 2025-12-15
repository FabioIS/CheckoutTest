import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';
import { CardInput } from '../src/components/CardInput/CardInput';

describe('CardInput Component', () => {
  const defaultProps = {
    label: 'Test Label',
    value: '',
    onChangeText: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders correctly with required props', () => {
      render(<CardInput {...defaultProps} />);

      expect(screen.getByText('Test Label')).toBeTruthy();
      expect(screen.getByDisplayValue('')).toBeTruthy();
    });

    it('renders with initial value', () => {
      render(<CardInput {...defaultProps} value="Test Value" />);

      expect(screen.getByDisplayValue('Test Value')).toBeTruthy();
    });

    it('renders with placeholder', () => {
      render(<CardInput {...defaultProps} placeholder="Enter text" />);

      expect(screen.getByPlaceholderText('Enter text')).toBeTruthy();
    });

    it('renders with icon when provided', () => {
      const iconTestId = 'test-icon';
      const TestIcon = () => <Text testID={iconTestId}>Icon</Text>;

      render(<CardInput {...defaultProps} icon={<TestIcon />} />);

      expect(screen.getByTestId(iconTestId)).toBeTruthy();
    });

    it('does not render icon when not provided', () => {
      render(<CardInput {...defaultProps} />);

      expect(screen.queryByText('Icon')).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('shows error message when showError is true and error exists', () => {
      render(<CardInput {...defaultProps} error="This field is required" showError={true} />);

      expect(screen.getByText('This field is required')).toBeTruthy();
    });

    it('does not show error message when showError is false', () => {
      render(<CardInput {...defaultProps} error="This field is required" showError={false} />);

      expect(screen.queryByText('This field is required')).toBeNull();
    });

    it('does not show error message when error is empty', () => {
      render(<CardInput {...defaultProps} error="" showError={true} />);

      expect(screen.queryByText('This field is required')).toBeNull();
    });

    it('does not show error message by default', () => {
      render(<CardInput {...defaultProps} />);

      expect(screen.queryByText('This field is required')).toBeNull();
    });
  });

  describe('User Interactions', () => {
    it('calls onChangeText when text input changes', () => {
      const mockOnChangeText = jest.fn();
      render(<CardInput {...defaultProps} onChangeText={mockOnChangeText} />);

      const textInput = screen.getByDisplayValue('');
      fireEvent.changeText(textInput, 'new text');

      expect(mockOnChangeText).toHaveBeenCalledWith('new text');
      expect(mockOnChangeText).toHaveBeenCalledTimes(1);
    });

    it('calls onBlur when text input loses focus', () => {
      const mockOnBlur = jest.fn();
      render(<CardInput {...defaultProps} onBlur={mockOnBlur} />);

      const textInput = screen.getByDisplayValue('');
      fireEvent(textInput, 'focus');
      fireEvent(textInput, 'blur');

      expect(mockOnBlur).toHaveBeenCalledTimes(1);
    });

    it('does not throw error when onBlur is not provided', () => {
      render(<CardInput {...defaultProps} />);

      const textInput = screen.getByDisplayValue('');

      expect(() => {
        fireEvent(textInput, 'focus');
        fireEvent(textInput, 'blur');
      }).not.toThrow();
    });

    it('handles focus and blur events correctly', () => {
      render(<CardInput {...defaultProps} />);

      const textInput = screen.getByDisplayValue('');

      fireEvent(textInput, 'focus');

      fireEvent(textInput, 'blur');
    });
  });

  describe('TextInput Props', () => {
    it('passes through additional TextInput props', () => {
      render(
        <CardInput
          {...defaultProps}
          keyboardType="number-pad"
          maxLength={16}
          secureTextEntry={true}
          autoCapitalize="none"
        />
      );

      const textInput = screen.getByDisplayValue('');

      expect(textInput.props.keyboardType).toBe('number-pad');
      expect(textInput.props.maxLength).toBe(16);
      expect(textInput.props.secureTextEntry).toBe(true);
      expect(textInput.props.autoCapitalize).toBe('none');
    });

    it('applies testID prop correctly', () => {
      render(<CardInput {...defaultProps} testID="card-input" />);

      expect(screen.getByTestId('card-input')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('has proper accessibility label', () => {
      render(<CardInput {...defaultProps} accessibilityLabel="Card number input" />);

      const textInput = screen.getByLabelText('Card number input');
      expect(textInput).toBeTruthy();
    });

    it('has accessible error message when error is shown', () => {
      render(<CardInput {...defaultProps} error="Invalid card number" showError={true} />);

      expect(screen.getByText('Invalid card number')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty string value', () => {
      render(<CardInput {...defaultProps} value="" />);

      expect(screen.getByDisplayValue('')).toBeTruthy();
    });

    it('handles undefined error prop', () => {
      render(<CardInput {...defaultProps} error={undefined} showError={true} />);


      expect(screen.queryByText('undefined')).toBeNull();
    });

    it('handles multiple rapid text changes', () => {
      const mockOnChangeText = jest.fn();
      render(<CardInput {...defaultProps} onChangeText={mockOnChangeText} />);

      const textInput = screen.getByDisplayValue('');

      fireEvent.changeText(textInput, '1');
      fireEvent.changeText(textInput, '12');
      fireEvent.changeText(textInput, '123');

      expect(mockOnChangeText).toHaveBeenCalledTimes(3);
      expect(mockOnChangeText).toHaveBeenNthCalledWith(1, '1');
      expect(mockOnChangeText).toHaveBeenNthCalledWith(2, '12');
      expect(mockOnChangeText).toHaveBeenNthCalledWith(3, '123');
    });
  });
});
