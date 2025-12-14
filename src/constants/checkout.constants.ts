import Config from 'react-native-config';

export const CHECKOUT_PUBLIC_KEY = 'pk_sbox_gnrjo6pl5azfmgdnrfrbbejo7ev';
export const CHECKOUT_SECRET_KEY = Config.CHECKOUT_SECRET_KEY || '';

export const CHECKOUT_BASE_URL = Config.CHECKOUT_BASE_URL || 'https://api.sandbox.checkout.com';
export const TOKENIZE_URL = `${CHECKOUT_BASE_URL}/tokens`;
export const PAYMENT_URL = `${CHECKOUT_BASE_URL}/payments`;

export const SUCCESS_URL = 'https://example.com/payments/success';
export const FAILURE_URL = 'https://example.com/payments/fail';

export const PAYMENT_AMOUNT = 6540; // Fix amount for testing purposes
export const PAYMENT_CURRENCY = 'GBP'; // Fix currency for testing purposes
