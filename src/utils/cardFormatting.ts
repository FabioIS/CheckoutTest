import { CardScheme } from '../types/payment.types';

export const cleanCardNumber = (cardNumber: string): string => {
  return cardNumber.replace(/\s+/g, '');
};

export const formatCardNumber = (value: string, scheme: CardScheme): string => {
  const cleanValue = value.replace(/\s/g, '');

  if (scheme === CardScheme.amex) {
    return cleanValue.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3').trim();
  }

  // Visa/Mastercard format: 4242 4242 4242 4242
  return cleanValue.replace(/(\d{4})/g, '$1 ').trim();
};

export const formatExpiryDate = (value: string): string => {
  if (value.includes('/')) {
    const parts = value.split('/');
    const month = parts[0].replace(/\D/g, '').slice(0, 2);
    const year = parts[1] ? parts[1].replace(/\D/g, '').slice(0, 4) : '';

    if (month.length < 2) {
      return month;
    }

    return year ? `${month}/${year}` : `${month}/`;
  }

  const cleanValue = value.replace(/\D/g, '');

  if (cleanValue.length >= 3) {
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
