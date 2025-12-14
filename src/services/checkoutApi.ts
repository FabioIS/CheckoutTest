import {
  CHECKOUT_PUBLIC_KEY,
  CHECKOUT_SECRET_KEY,
  FAILURE_URL,
  PAYMENT_AMOUNT,
  PAYMENT_CURRENCY,
  PAYMENT_URL,
  SUCCESS_URL,
  TOKENIZE_URL,
} from '../constants/checkout.constants';
import {
  PaymentRequest,
  PaymentResponse,
  TokenizeCardRequest,
  TokenizeCardResponse,
} from '../types/payment.types';

export const tokenizeCard = async (
  cardNumber: string,
  expiryMonth: string,
  expiryYear: string,
  cvv: string
): Promise<TokenizeCardResponse> => {
  const requestBody: TokenizeCardRequest = {
    type: 'card',
    number: cardNumber,
    expiry_month: expiryMonth,
    expiry_year: expiryYear,
    cvv: cvv,
  };

  try {
    const response = await fetch(TOKENIZE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${CHECKOUT_PUBLIC_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Tokenization failed: ${errorData.message || response.statusText}`);
    }

    const data: TokenizeCardResponse = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const processPayment = async (token: string): Promise<PaymentResponse> => {
  const requestBody: PaymentRequest = {
    source: {
      type: 'token',
      token: token,
    },
    amount: PAYMENT_AMOUNT,
    currency: PAYMENT_CURRENCY,
    '3ds': {
      enabled: true,
    },
    success_url: SUCCESS_URL,
    failure_url: FAILURE_URL,
  };
  try {
    const response = await fetch(PAYMENT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${CHECKOUT_SECRET_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Payment processing failed: ${errorData.message || response.statusText}`);
    }

    const data: PaymentResponse = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
