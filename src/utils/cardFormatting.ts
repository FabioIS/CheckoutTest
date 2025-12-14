import { CardScheme } from '../types/payment.types';

export const cleanCardNumber = (cardNumber: string): string => {
  return cardNumber.replace(/\s+/g, '');
};

export const formatCardNumber = (value: string, scheme: CardScheme): string => {
  const cleanValue = value.replace(/\s/g, '');

  if (scheme === CardScheme.amex) {
    // Amex format: 3782 822463 10005
    return cleanValue.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3').trim();
  }

  // Visa/Mastercard format: 4242 4242 4242 4242
  return cleanValue.replace(/(\d{4})/g, '$1 ').trim();
};

export const formatExpiryDate = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');

  if (cleanValue.length >= 2) {
    return `${cleanValue.slice(0, 2)}/${cleanValue.slice(2, 6)}`;
  }

  return cleanValue;
};

export const parseExpiryDate = (formattedValue: string): { month: string; year: string } => {
  const parts = formattedValue.split('/');
  return {
    month: parts[0] || '',
    year: parts[1] || '',
  };
};
