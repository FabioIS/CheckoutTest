import { createContext, useCallback, useContext, useReducer } from 'react';
import { processPayment, tokenizeCard } from '../services/checkoutApi';
import { PaymentResponseStatus, PaymentState, PaymentStatus } from '../types/payment.types';
import { cleanCardNumber } from '../utils/cardFormatting';

enum PaymentActions {
  START_TOKENIZING = 'START_TOKENIZING',
  PAYMENT_PENDING_3DS = 'PAYMENT_PENDING_3DS',
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  PAYMENT_ERROR = 'PAYMENT_ERROR',
  UPDATE_STATUS = 'UPDATE_STATUS',
  RESET = 'RESET',
}

interface PaymentContextValue {
  state: PaymentState;
  initiatePayment: (
    cardNumber: string,
    expiryMonth: string,
    expiryYear: string,
    cvv: string
  ) => Promise<void>;
  resetPayment: () => void;
  updateStatus: (status: PaymentStatus, error?: string) => void;
}

type PaymentAction =
  | { type: PaymentActions.START_TOKENIZING }
  | {
      type: PaymentActions.PAYMENT_PENDING_3DS;
      payload: { threeDSecureUrl: string; paymentId: string };
    }
  | { type: PaymentActions.PAYMENT_SUCCESS; payload: { paymentId?: string } }
  | { type: PaymentActions.PAYMENT_ERROR; payload: string }
  | {
      type: PaymentActions.UPDATE_STATUS;
      payload: { status: PaymentStatus; error?: string };
    }
  | { type: PaymentActions.RESET };

const initialState: PaymentState = {
  status: PaymentStatus.idle,
  threeDSecureUrl: null,
  error: null,
  paymentId: null,
};

const paymentReducer = (state: PaymentState, action: PaymentAction): PaymentState => {
  switch (action.type) {
    case PaymentActions.START_TOKENIZING:
      return {
        ...state,
        status: PaymentStatus.tokenizing,
        error: null,
      };
    case PaymentActions.PAYMENT_PENDING_3DS:
      return {
        ...state,
        status: PaymentStatus.pending3ds,
        threeDSecureUrl: action.payload.threeDSecureUrl,
        paymentId: action.payload.paymentId,
        error: null,
      };
    case PaymentActions.PAYMENT_SUCCESS:
      return {
        ...state,
        status: PaymentStatus.success,
        paymentId: action.payload.paymentId || null,
        error: null,
      };
    case PaymentActions.PAYMENT_ERROR:
      return {
        ...state,
        status: PaymentStatus.error,
        error: action.payload,
      };
    case PaymentActions.UPDATE_STATUS:
      return {
        ...state,
        status: action.payload.status,
        error: action.payload.error || null,
      };
    case PaymentActions.RESET:
      return initialState;
    default:
      return state;
  }
};

const PaymentContext = createContext<PaymentContextValue | undefined>(undefined);

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(paymentReducer, initialState);

  const initiatePayment = useCallback(
    async (cardNumber: string, expiryMonth: string, expiryYear: string, cvv: string) => {
      try {
        dispatch({ type: PaymentActions.START_TOKENIZING });

        const cleanNumber = cleanCardNumber(cardNumber);
        const tokenResponse = await tokenizeCard(cleanNumber, expiryMonth, expiryYear, cvv);

        const paymentResponse = await processPayment(tokenResponse.token);

        if (
          paymentResponse._links?.redirect?.href &&
          paymentResponse.status === PaymentResponseStatus.Pending
        ) {
          dispatch({
            type: PaymentActions.PAYMENT_PENDING_3DS,
            payload: {
              threeDSecureUrl: paymentResponse._links.redirect.href,
              paymentId: paymentResponse.id,
            },
          });
        } else {
          const errorMessage = `Payment failed with status: ${paymentResponse.status}. For this exercise, only 3D Secure payments are handled.`;
          dispatch({ type: PaymentActions.PAYMENT_ERROR, payload: errorMessage });
        }
      } catch (error: any) {
        dispatch({
          type: PaymentActions.PAYMENT_ERROR,
          payload: error.message || 'Payment failed',
        });
      }
    },
    []
  );

  const resetPayment = useCallback(() => {
    dispatch({ type: PaymentActions.RESET });
  }, []);

  const updateStatus = useCallback((status: PaymentStatus, error?: string) => {
    dispatch({ type: PaymentActions.UPDATE_STATUS, payload: { status, error } });
  }, []);

  const value: PaymentContextValue = {
    state,
    initiatePayment,
    resetPayment,
    updateStatus,
  };
  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
};

export const usePaymentContext = (): PaymentContextValue => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePaymentContext must be used within a PaymentProvider');
  }
  return context;
};
