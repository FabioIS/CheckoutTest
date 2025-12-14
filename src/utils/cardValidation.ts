import { CardScheme } from '../types/payment.types';
import { cleanCardNumber } from './cardFormatting';

/**
Visa: starts with 4
MasterCard:
  - 51–55 (first 2 digits)
  - 2221–2720 (first 4 digits).
American Express: 34 or 37
 */
export const detectCardScheme = (cardNumber: string): CardScheme => {
  const onlyDigits = cardNumber.replace(/\D/g, '');
  const firstDigit = onlyDigits[0];
  const firstTwo = onlyDigits.substring(0, 2);
  const firstFour = onlyDigits.substring(0, 4);

  switch (firstDigit) {
    case '4':
      return CardScheme.visa;
    case '3':
      return firstTwo === '34' || firstTwo === '37' ? CardScheme.amex : CardScheme.unknown;
    case '5':
      return /^5[1-5]/.test(onlyDigits) ? CardScheme.mastercard : CardScheme.unknown;
    case '2':
      return /^(222[1-9]|22[3-9]\d|2[3-6]\d{2}|27(0\d|1\d)|2720)/.test(firstFour)
        ? CardScheme.mastercard
        : CardScheme.unknown;
    default:
      return CardScheme.unknown;
  }
};

export const getCardMaxLength = (scheme: CardScheme): number => {
  return scheme === CardScheme.amex ? 15 : 16;
};

export const getCvvMaxLength = (scheme: CardScheme): number => {
  return scheme === CardScheme.amex ? 4 : 3;
};

export const luhnCheck = (cardNumber: string): boolean => {
  const cleanNumber = cardNumber.replace(/\s/g, '');

  if (!/^\d+$/.test(cleanNumber)) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

export const validateCardNumber = (cardNumber: string): boolean => {
  const cleanNumber = cleanCardNumber(cardNumber);
  const scheme = detectCardScheme(cleanNumber);
  const maxLength = getCardMaxLength(scheme);

  if (cleanNumber.length !== maxLength) {
    return false;
  }

  return luhnCheck(cleanNumber);
};

export const validateExpiryDate = (month: string, year: string): boolean => {
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);

  if (isNaN(monthNum) || isNaN(yearNum)) {
    return false;
  }

  if (monthNum < 1 || monthNum > 12) {
    return false;
  }

  // Require 4-digit year
  if (year.length !== 4) {
    return false;
  }

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  if (yearNum < currentYear) {
    return false;
  }

  if (yearNum === currentYear && monthNum < currentMonth) {
    return false;
  }

  return true;
};

export const validateCvv = (cvv: string, scheme: CardScheme): boolean => {
  const maxLength = getCvvMaxLength(scheme);
  return /^\d+$/.test(cvv) && cvv.length === maxLength;
};
