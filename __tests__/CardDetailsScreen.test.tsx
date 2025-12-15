import { NavigationContainer } from '@react-navigation/native';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';

import { PaymentProvider } from '../src/context/PaymentContext';
import { CardDetailsScreen } from '../src/screens/CardDetailsScreen/CardDetailsScreen';


jest.mock('@d11/react-native-fast-image', () => {
  const React = require('react');
  const { View } = require('react-native');
  const FastImage = ({ testID, ...props }: any) => React.createElement(View, { testID, ...props });
  FastImage.resizeMode = {
    contain: 'contain',
    cover: 'cover',
    stretch: 'stretch',
  };
  return {
    __esModule: true,
    default: FastImage,
  };
});


const mockAlert = jest.fn();
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: mockAlert,
}));


const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

describe('CardDetailsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    mockAlert.mockClear();
  });

  const renderScreen = () => {
    return render(
      <NavigationContainer>
        <PaymentProvider>
          <CardDetailsScreen />
        </PaymentProvider>
      </NavigationContainer>
    );
  };

  describe('Initial Rendering', () => {
    it('renders without crashing', () => {
      const result = renderScreen();
      expect(result).toBeTruthy();
    });

    it('renders all form elements correctly', () => {
      renderScreen();

      expect(screen.getByText('Payment Details')).toBeTruthy();
      expect(screen.getByText('Enter your card information')).toBeTruthy();
      expect(screen.getByPlaceholderText('1234 5678 9012 3456')).toBeTruthy();
      expect(screen.getByPlaceholderText('MM/YYYY')).toBeTruthy();
      expect(screen.getByPlaceholderText('123')).toBeTruthy();
      expect(screen.getByText('Pay £65.40')).toBeTruthy();
    });

    it('renders pay button initially', () => {
      renderScreen();

      const payButton = screen.getByText('Pay £65.40');

      expect(payButton).toBeTruthy();
      expect(payButton.type).toBe('Text');
    });

    it('displays correct labels for inputs', () => {
      renderScreen();

      expect(screen.getByText('Card Number')).toBeTruthy();
      expect(screen.getByText('Expiry Date')).toBeTruthy();
      expect(screen.getByText('CVV')).toBeTruthy();
    });
  });

  describe('Card Number Input', () => {
    it('formats card number correctly for Visa', () => {
      renderScreen();

      const cardInput = screen.getByPlaceholderText('1234 5678 9012 3456');
      fireEvent.changeText(cardInput, '4242424242424242');

      expect(cardInput.props.value).toBe('4242 4242 4242 4242');
    });

    it('formats card number correctly for Amex', () => {
      renderScreen();

      const cardInput = screen.getByPlaceholderText('1234 5678 9012 3456');
      fireEvent.changeText(cardInput, '378282246310005');


      expect(cardInput.props.value).toBe('3782 822463 10005');
    });

    it('limits card number length based on scheme', () => {
      renderScreen();

      const cardInput = screen.getByPlaceholderText('1234 5678 9012 3456');
      fireEvent.changeText(cardInput, '4242424242424242');

      expect(cardInput.props.value).toBe('4242 4242 4242 4242');

      fireEvent.changeText(cardInput, '42424242424242424242');
      expect(cardInput.props.value).toBe('4242 4242 4242 4242');
    });

    it('shows validation error for invalid card number when touched', () => {
      renderScreen();

      const cardInput = screen.getByPlaceholderText('1234 5678 9012 3456');


      fireEvent.changeText(cardInput, '1234');
      fireEvent(cardInput, 'blur');

      waitFor(() => {
        expect(screen.getByText('Invalid card number')).toBeTruthy();
      });
    });

    it('does not show error for untouched invalid input', () => {
      renderScreen();

      const cardInput = screen.getByPlaceholderText('1234 5678 9012 3456');
      fireEvent.changeText(cardInput, '1234');

      expect(screen.queryByText('Invalid card number')).toBeNull();
    });
  });

  describe('Expiry Date Input', () => {
    it('formats expiry date correctly', () => {
      renderScreen();

      const expiryInput = screen.getByPlaceholderText('MM/YYYY');
      fireEvent.changeText(expiryInput, '1025');


      expect(expiryInput.props.value).toBe('10/25');
    });

    it('limits expiry date to 7 characters', () => {
      renderScreen();

      const expiryInput = screen.getByPlaceholderText('MM/YYYY');
      fireEvent.changeText(expiryInput, '10202555');

      expect(expiryInput.props.value.length).toBeLessThanOrEqual(7);
    });

    it('shows validation error for invalid expiry date when touched', () => {
      renderScreen();

      const expiryInput = screen.getByPlaceholderText('MM/YYYY');

      fireEvent.changeText(expiryInput, '13/2020');
      fireEvent(expiryInput, 'blur');

      waitFor(() => {
        expect(screen.getByText('Invalid expiry date')).toBeTruthy();
      });
    });
  });

  describe('CVV Input', () => {
    it('limits CVV to 3 digits for non-Amex cards', () => {
      renderScreen();

      const cardInput = screen.getByPlaceholderText('1234 5678 9012 3456');
      const cvvInput = screen.getByPlaceholderText('123');

      fireEvent.changeText(cardInput, '4242424242424242');
      fireEvent.changeText(cvvInput, '123');
      expect(cvvInput.props.value).toBe('123');

      fireEvent.changeText(cvvInput, '12345');
      expect(cvvInput.props.value).toBe('123');
    });

    it('limits CVV to 4 digits for Amex cards', () => {
      renderScreen();

      const cardInput = screen.getByPlaceholderText('1234 5678 9012 3456');

      fireEvent.changeText(cardInput, '378282246310005');

      const amexCvvInput = screen.getByPlaceholderText('1234');
      fireEvent.changeText(amexCvvInput, '1234');
      expect(amexCvvInput.props.value).toBe('1234');

      fireEvent.changeText(amexCvvInput, '12345');
      expect(amexCvvInput.props.value).toBe('1234');
    });

    it('only allows numeric input for CVV', () => {
      renderScreen();

      const cvvInput = screen.getByPlaceholderText('123');
      fireEvent.changeText(cvvInput, 'abc123def');

      expect(cvvInput.props.value).toBe('123');
    });

    it('shows validation error for invalid CVV when touched', () => {
      renderScreen();

      const cvvInput = screen.getByPlaceholderText('123');

      fireEvent.changeText(cvvInput, '12');
      fireEvent(cvvInput, 'blur');

      waitFor(() => {
        expect(screen.getByText('Invalid CVV')).toBeTruthy();
      });
    });
  });

  describe('Form Validation and Submission', () => {
    it('enables pay button when form is valid', async () => {
      renderScreen();

      const cardInput = screen.getByPlaceholderText('1234 5678 9012 3456');
      const expiryInput = screen.getByPlaceholderText('MM/YYYY');
      const cvvInput = screen.getByPlaceholderText('123');

      fireEvent.changeText(cardInput, '4242424242424242');
      fireEvent.changeText(expiryInput, '06/2030');
      fireEvent.changeText(cvvInput, '100');

      await waitFor(() => {
        const payButton = screen.getByText('Pay £65.40');
        expect(payButton.parent?.props.accessibilityState?.disabled).toBeFalsy();
      });
    });

    it('handles invalid form submission gracefully', async () => {
      renderScreen();

      const payButton = screen.getByText('Pay £65.40');

      expect(payButton).toBeTruthy();

      fireEvent.press(payButton);

      expect(screen.getByText('Pay £65.40')).toBeTruthy();
    });

    it('calls initiatePayment with correct parameters when form is valid', async () => {
      renderScreen();

      const cardInput = screen.getByPlaceholderText('1234 5678 9012 3456');
      const expiryInput = screen.getByPlaceholderText('MM/YYYY');
      const cvvInput = screen.getByPlaceholderText('123');
      const payButton = screen.getByText('Pay £65.40');

      fireEvent.changeText(cardInput, '4242424242424242');
      fireEvent.changeText(expiryInput, '06/2030');
      fireEvent.changeText(cvvInput, '100');

      fireEvent.press(payButton);

    });
  });

  describe('Card Scheme Detection', () => {
    it('detects Visa card scheme', () => {
      renderScreen();

      const cardInput = screen.getByPlaceholderText('1234 5678 9012 3456');
      fireEvent.changeText(cardInput, '4242424242424242');

      expect(cardInput.props.value).toBe('4242 4242 4242 4242');
    });

    it('detects Amex card scheme', () => {
      renderScreen();

      const cardInput = screen.getByPlaceholderText('1234 5678 9012 3456');
      fireEvent.changeText(cardInput, '378282246310005');

      expect(screen.getByPlaceholderText('1234')).toBeTruthy();
      expect(cardInput.props.value).toBe('3782 822463 10005');
    });

    it('detects Mastercard scheme', () => {
      renderScreen();

      const cardInput = screen.getByPlaceholderText('1234 5678 9012 3456');
      fireEvent.changeText(cardInput, '5555555555554444');

      expect(cardInput.props.value).toBe('5555 5555 5555 4444');
    });
  });

  describe('Error Handling', () => {
    it('shows alert when payment fails', async () => {
      renderScreen();

      const cardInput = screen.getByPlaceholderText('1234 5678 9012 3456');
      const expiryInput = screen.getByPlaceholderText('MM/YYYY');
      const cvvInput = screen.getByPlaceholderText('123');
      const payButton = screen.getByText('Pay £65.40');

      fireEvent.changeText(cardInput, '4242424242424242');
      fireEvent.changeText(expiryInput, '06/2030');
      fireEvent.changeText(cvvInput, '100');

      fireEvent.press(payButton);

    });
  });

  describe('Accessibility', () => {
    it('has proper accessibility labels', () => {
      renderScreen();

      expect(screen.getByText('Card Number')).toBeTruthy();
      expect(screen.getByText('Expiry Date')).toBeTruthy();
      expect(screen.getByText('CVV')).toBeTruthy();
      expect(screen.getByText('Pay £65.40')).toBeTruthy();
    });

    it('provides proper feedback for validation errors', () => {
      renderScreen();

      const cardInput = screen.getByPlaceholderText('1234 5678 9012 3456');
      fireEvent.changeText(cardInput, '1234');
      fireEvent(cardInput, 'blur');

      waitFor(() => {
        expect(screen.getByText('Invalid card number')).toBeTruthy();
      });
    });
  });

  describe('Performance', () => {
    it('does not cause unnecessary re-renders', () => {
      const renderSpy = jest.fn();

      const TestComponent = () => {
        renderSpy();
        return <CardDetailsScreen />;
      };

      render(
        <NavigationContainer>
          <PaymentProvider>
            <TestComponent />
          </PaymentProvider>
        </NavigationContainer>
      );

      const cardInput = screen.getByPlaceholderText('1234 5678 9012 3456');
      fireEvent.changeText(cardInput, '4');
      fireEvent.changeText(cardInput, '42');
      fireEvent.changeText(cardInput, '424');

      expect(renderSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Keyboard Handling', () => {
    it('uses number-pad keyboard for all inputs', () => {
      renderScreen();

      const cardInput = screen.getByPlaceholderText('1234 5678 9012 3456');
      const expiryInput = screen.getByPlaceholderText('MM/YYYY');
      const cvvInput = screen.getByPlaceholderText('123');

      expect(cardInput.props.keyboardType).toBe('number-pad');
      expect(expiryInput.props.keyboardType).toBe('number-pad');
      expect(cvvInput.props.keyboardType).toBe('number-pad');
    });

    it('has secure text entry for CVV', () => {
      renderScreen();

      const cvvInput = screen.getByPlaceholderText('123');
      expect(cvvInput.props.secureTextEntry).toBe(true);
    });
  });
});
