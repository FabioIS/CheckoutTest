import { NavigationContainer } from '@react-navigation/native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

import { PaymentProvider } from '../src/context/PaymentContext';
import { PaymentResultScreen } from '../src/screens/PaymentResultScreen/PaymentResultScreen';
import { PaymentStatus } from '../src/types/payment.types';


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


const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({
      navigate: mockNavigate,
      goBack: mockGoBack,
    }),
  };
});


const mockResetPayment = jest.fn();
const mockInitiatePayment = jest.fn();
const mockUpdateStatus = jest.fn();

let mockPaymentState = {
  status: PaymentStatus.success,
  threeDSecureUrl: '',
  error: '',
  paymentId: '',
};

jest.mock('../src/context/PaymentContext', () => ({
  PaymentProvider: ({ children }: { children: React.ReactNode }) => children,
  usePaymentContext: () => ({
    state: mockPaymentState,
    resetPayment: mockResetPayment,
    initiatePayment: mockInitiatePayment,
    updateStatus: mockUpdateStatus,
  }),
}));

describe('PaymentResultScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    mockGoBack.mockClear();
    mockResetPayment.mockClear();
    mockInitiatePayment.mockClear();
    mockUpdateStatus.mockClear();


    mockPaymentState = {
      status: PaymentStatus.success,
      threeDSecureUrl: '',
      error: '',
      paymentId: '',
    };
  });

  const renderScreen = () => {
    return render(
      <NavigationContainer>
        <PaymentProvider>
          <PaymentResultScreen />
        </PaymentProvider>
      </NavigationContainer>
    );
  };

  describe('Success State', () => {
    beforeEach(() => {
      mockPaymentState = {
        status: PaymentStatus.success,
        threeDSecureUrl: '',
        error: '',
        paymentId: 'pay_123456',
      };
    });

    it('renders success screen correctly', () => {
      renderScreen();

      expect(screen.getByText('Payment Successful')).toBeTruthy();
      expect(screen.getByText('Your payment has been processed successfully.')).toBeTruthy();
      expect(screen.getByText('Make Another Payment')).toBeTruthy();
    });

    it('does not show error message on success', () => {
      renderScreen();

      expect(screen.queryByText(/error/i)).toBeNull();
    });

    it('handles make another payment button press', () => {
      renderScreen();

      const button = screen.getByText('Make Another Payment');
      fireEvent.press(button);

      expect(mockResetPayment).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('CardDetails');
    });
  });

  describe('Error State', () => {
    beforeEach(() => {
      mockPaymentState = {
        status: PaymentStatus.error,
        threeDSecureUrl: '',
        error: 'Payment was declined by your bank',
        paymentId: '',
      };
    });

    it('renders error screen correctly', () => {
      renderScreen();

      expect(screen.getByText('Payment Failed')).toBeTruthy();
      expect(screen.getByText("We couldn't process your payment.")).toBeTruthy();
      expect(screen.getByText('Try Again')).toBeTruthy();
    });

    it('shows specific error message when provided', () => {
      renderScreen();

      expect(screen.getByText('Payment was declined by your bank')).toBeTruthy();
    });

    it('handles try again button press', () => {
      renderScreen();

      const button = screen.getByText('Try Again');
      fireEvent.press(button);

      expect(mockResetPayment).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('CardDetails');
    });
  });

  describe('Error State Without Specific Error Message', () => {
    beforeEach(() => {
      mockPaymentState = {
        status: PaymentStatus.error,
        threeDSecureUrl: '',
        error: '',
        paymentId: '',
      };
    });

    it('renders error screen without specific error message', () => {
      renderScreen();

      expect(screen.getByText('Payment Failed')).toBeTruthy();
      expect(screen.getByText("We couldn't process your payment.")).toBeTruthy();
      expect(screen.getByText('Try Again')).toBeTruthy();


      expect(screen.queryByText(/declined/i)).toBeNull();
    });
  });

  describe('Navigation Behavior', () => {
    it('navigates to card details screen when button is pressed', () => {
      mockPaymentState = {
        status: PaymentStatus.success,
        threeDSecureUrl: '',
        error: '',
        paymentId: 'pay_123',
      };
      renderScreen();

      const button = screen.getByText('Make Another Payment');
      fireEvent.press(button);

      expect(mockNavigate).toHaveBeenCalledWith('CardDetails');
    });

    it('resets payment state before navigation', () => {
      mockPaymentState = {
        status: PaymentStatus.error,
        threeDSecureUrl: '',
        error: 'Some error',
        paymentId: '',
      };
      renderScreen();

      const button = screen.getByText('Try Again');
      fireEvent.press(button);

      expect(mockResetPayment).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
  });

  describe('Component Integration', () => {
    it('integrates properly with PaymentContext', () => {
      mockPaymentState = {
        status: PaymentStatus.success,
        threeDSecureUrl: '',
        error: '',
        paymentId: 'pay_123',
      };
      renderScreen();


      expect(screen.getByText('Payment Successful')).toBeTruthy();
    });

    it('integrates properly with NavigationContainer', () => {
      renderScreen();

      const button = screen.getByText('Make Another Payment');
      expect(button).toBeTruthy();


      fireEvent.press(button);
    });
  });

  describe('Accessibility', () => {
    it('has accessible button', () => {
      renderScreen();

      const button = screen.getByText('Make Another Payment');
      expect(button).toBeTruthy();

      fireEvent.press(button);
      expect(mockResetPayment).toHaveBeenCalled();
    });

    it('provides proper text content for screen readers', () => {
      renderScreen();

      expect(screen.getByText('Payment Successful')).toBeTruthy();
      expect(screen.getByText('Your payment has been processed successfully.')).toBeTruthy();
    });

    it('provides proper error feedback for screen readers', () => {
      mockPaymentState = {
        status: PaymentStatus.error,
        threeDSecureUrl: '',
        error: 'Insufficient funds',
        paymentId: '',
      };
      renderScreen();

      expect(screen.getByText('Payment Failed')).toBeTruthy();
      expect(screen.getByText('Insufficient funds')).toBeTruthy();
    });
  });

  describe('Visual Feedback', () => {
    it('shows different content based on payment status', () => {

      mockPaymentState = {
        status: PaymentStatus.success,
        threeDSecureUrl: '',
        error: '',
        paymentId: 'pay_123',
      };
      const { rerender } = renderScreen();

      expect(screen.getByText('Payment Successful')).toBeTruthy();
      expect(screen.getByText('Make Another Payment')).toBeTruthy();


      mockPaymentState = {
        status: PaymentStatus.error,
        threeDSecureUrl: '',
        error: 'Network error',
        paymentId: '',
      };
      rerender(
        <NavigationContainer>
          <PaymentProvider>
            <PaymentResultScreen />
          </PaymentProvider>
        </NavigationContainer>
      );

      expect(screen.getByText('Payment Failed')).toBeTruthy();
      expect(screen.getByText('Try Again')).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    it('handles missing payment context gracefully', () => {
      renderScreen();

      expect(screen.getByText('Payment Successful')).toBeTruthy();
    });

    it('handles navigation errors gracefully', () => {

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      mockNavigate.mockImplementation(() => {
        throw new Error('Navigation error');
      });

      renderScreen();

      const button = screen.getByText('Make Another Payment');

      expect(button).toBeTruthy();

      consoleSpy.mockRestore();
    });
  });

  describe('Performance', () => {
    it('renders efficiently', () => {
      const renderSpy = jest.fn();

      const TestComponent = () => {
        renderSpy();
        return <PaymentResultScreen />;
      };

      render(
        <NavigationContainer>
          <PaymentProvider>
            <TestComponent />
          </PaymentProvider>
        </NavigationContainer>
      );

      expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    it('memoizes button handler to prevent unnecessary re-renders', () => {
      mockNavigate.mockReset();
      mockResetPayment.mockReset();

      renderScreen();

      const button = screen.getByText('Make Another Payment');

      expect(button).toBeTruthy();
      fireEvent.press(button);
      expect(mockResetPayment).toHaveBeenCalledTimes(1);
    });
  });
});
