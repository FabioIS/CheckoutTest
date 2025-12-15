import { CardScheme } from '../src/types/payment.types';
import {
  detectCardScheme,
  getCardMaxLength,
  getCvvMaxLength,
  luhnCheck,
  validateCardNumber,
  validateCvv,
  validateExpiryDate,
} from '../src/utils/cardValidation';

describe('cardValidation utilities', () => {
  describe('detectCardScheme', () => {
    describe('Visa detection', () => {
      it('should detect Visa cards starting with 4', () => {
        expect(detectCardScheme('4242424242424242')).toBe(CardScheme.visa);
        expect(detectCardScheme('4111111111111111')).toBe(CardScheme.visa);
        expect(detectCardScheme('4000000000000002')).toBe(CardScheme.visa);
      });

      it('should detect Visa with partial numbers', () => {
        expect(detectCardScheme('4')).toBe(CardScheme.visa);
        expect(detectCardScheme('42')).toBe(CardScheme.visa);
        expect(detectCardScheme('424242')).toBe(CardScheme.visa);
      });
    });

    describe('Mastercard detection', () => {
      it('should detect Mastercard 51-55 range', () => {
        expect(detectCardScheme('5105105105105100')).toBe(CardScheme.mastercard);
        expect(detectCardScheme('5555555555554444')).toBe(CardScheme.mastercard);
        expect(detectCardScheme('5200828282828210')).toBe(CardScheme.mastercard);
      });

      it('should detect Mastercard 2221-2720 range', () => {
        expect(detectCardScheme('2223000048400011')).toBe(CardScheme.mastercard);
        expect(detectCardScheme('2720991234567890')).toBe(CardScheme.mastercard);
      });

      it('should detect Mastercard with partial numbers', () => {
        expect(detectCardScheme('51')).toBe(CardScheme.mastercard);
        expect(detectCardScheme('52')).toBe(CardScheme.mastercard);
        expect(detectCardScheme('53')).toBe(CardScheme.mastercard);
        expect(detectCardScheme('54')).toBe(CardScheme.mastercard);
        expect(detectCardScheme('55')).toBe(CardScheme.mastercard);
        expect(detectCardScheme('222')).toBe(CardScheme.unknown);
        expect(detectCardScheme('2221')).toBe(CardScheme.mastercard);
        expect(detectCardScheme('2720')).toBe(CardScheme.mastercard);
      });
    });

    describe('American Express detection', () => {
      it('should detect Amex cards starting with 34 or 37', () => {
        expect(detectCardScheme('378282246310005')).toBe(CardScheme.amex);
        expect(detectCardScheme('371449635398431')).toBe(CardScheme.amex);
        expect(detectCardScheme('341111111111111')).toBe(CardScheme.amex);
      });

      it('should detect Amex with partial numbers', () => {
        expect(detectCardScheme('34')).toBe(CardScheme.amex);
        expect(detectCardScheme('37')).toBe(CardScheme.amex);
        expect(detectCardScheme('341')).toBe(CardScheme.amex);
        expect(detectCardScheme('371')).toBe(CardScheme.amex);
      });
    });

    describe('Unknown scheme detection', () => {
      it('should return unknown for unrecognized patterns', () => {
        expect(detectCardScheme('1234567890123456')).toBe(CardScheme.unknown);
        expect(detectCardScheme('6011111111111117')).toBe(CardScheme.unknown);
        expect(detectCardScheme('30569309025904')).toBe(CardScheme.unknown);
      });

      it('should return unknown for edge cases', () => {
        expect(detectCardScheme('')).toBe(CardScheme.unknown);
        expect(detectCardScheme('1')).toBe(CardScheme.unknown);
        expect(detectCardScheme('35')).toBe(CardScheme.unknown);
        expect(detectCardScheme('36')).toBe(CardScheme.unknown);
        expect(detectCardScheme('50')).toBe(CardScheme.unknown);
        expect(detectCardScheme('56')).toBe(CardScheme.unknown);
      });
    });
  });

  describe('getCardMaxLength', () => {
    it('should return 15 for Amex', () => {
      expect(getCardMaxLength(CardScheme.amex)).toBe(15);
    });

    it('should return 16 for Visa', () => {
      expect(getCardMaxLength(CardScheme.visa)).toBe(16);
    });

    it('should return 16 for Mastercard', () => {
      expect(getCardMaxLength(CardScheme.mastercard)).toBe(16);
    });

    it('should return 16 for unknown scheme', () => {
      expect(getCardMaxLength(CardScheme.unknown)).toBe(16);
    });
  });

  describe('getCvvMaxLength', () => {
    it('should return 4 for Amex', () => {
      expect(getCvvMaxLength(CardScheme.amex)).toBe(4);
    });

    it('should return 3 for Visa', () => {
      expect(getCvvMaxLength(CardScheme.visa)).toBe(3);
    });

    it('should return 3 for Mastercard', () => {
      expect(getCvvMaxLength(CardScheme.mastercard)).toBe(3);
    });

    it('should return 3 for unknown scheme', () => {
      expect(getCvvMaxLength(CardScheme.unknown)).toBe(3);
    });
  });

  describe('luhnCheck', () => {
    describe('Valid card numbers', () => {
      it('should validate correct card numbers', () => {
        expect(luhnCheck('4242424242424242')).toBe(true);
        expect(luhnCheck('5555555555554444')).toBe(true);
        expect(luhnCheck('378282246310005')).toBe(true);
        expect(luhnCheck('371449635398431')).toBe(true);
      });
    });

    describe('Invalid card numbers', () => {
      it('should reject incorrect card numbers', () => {
        expect(luhnCheck('4242424242424243')).toBe(false);
        expect(luhnCheck('5555555555554445')).toBe(false);
        expect(luhnCheck('378282246310006')).toBe(false);
        expect(luhnCheck('1234567890123456')).toBe(false);
      });
    });

    describe('Edge cases', () => {
      it('should handle empty string', () => {
        expect(luhnCheck('')).toBe(false);
      });

      it('should handle single digit', () => {
        expect(luhnCheck('0')).toBe(true);
        expect(luhnCheck('1')).toBe(false);
        expect(luhnCheck('2')).toBe(false);
        expect(luhnCheck('3')).toBe(false);
        expect(luhnCheck('4')).toBe(false);
      });

      it('should handle short numbers', () => {
        expect(luhnCheck('42')).toBe(true);
        expect(luhnCheck('43')).toBe(false);
      });

      it('should handle non-numeric strings', () => {
        expect(luhnCheck('abcd')).toBe(false);
      });
    });
  });

  describe('validateCardNumber', () => {
    describe('Valid card numbers', () => {
      it('should validate Visa cards', () => {
        expect(validateCardNumber('4242424242424242')).toBe(true);
        expect(validateCardNumber('4111111111111111')).toBe(true);
      });

      it('should validate Mastercard cards', () => {
        expect(validateCardNumber('5555555555554444')).toBe(true);
        expect(validateCardNumber('5105105105105100')).toBe(true);
        expect(validateCardNumber('2223000048400011')).toBe(true);
      });

      it('should validate Amex cards', () => {
        expect(validateCardNumber('378282246310005')).toBe(true);
        expect(validateCardNumber('371449635398431')).toBe(true);
      });
    });

    describe('Invalid length', () => {
      it('should reject Visa cards with wrong length', () => {
        expect(validateCardNumber('42424242424242')).toBe(false);
        expect(validateCardNumber('42424242424242424')).toBe(false);
      });

      it('should reject Mastercard cards with wrong length', () => {
        expect(validateCardNumber('55555555555544')).toBe(false);
        expect(validateCardNumber('55555555555544444')).toBe(false);
      });

      it('should reject Amex cards with wrong length', () => {
        expect(validateCardNumber('3782822463100')).toBe(false);
        expect(validateCardNumber('37828224631000555')).toBe(false);
      });
    });

    describe('Invalid checksum', () => {
      it('should reject cards failing Luhn check', () => {
        expect(validateCardNumber('4242424242424243')).toBe(false);
        expect(validateCardNumber('5555555555554445')).toBe(false);
        expect(validateCardNumber('378282246310006')).toBe(false);
      });
    });

    describe('Edge cases', () => {
      it('should handle empty string', () => {
        expect(validateCardNumber('')).toBe(false);
      });

      it('should handle non-numeric input', () => {
        expect(validateCardNumber('abcd')).toBe(false);
      });

      it('should handle unknown card schemes', () => {
        expect(validateCardNumber('1234567890123456')).toBe(false);
      });
    });
  });

  describe('validateExpiryDate', () => {
    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-15'));
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    describe('Valid expiry dates', () => {
      it('should validate future dates', () => {
        expect(validateExpiryDate('12', '2024')).toBe(true);
        expect(validateExpiryDate('01', '2025')).toBe(true);
        expect(validateExpiryDate('12', '2025')).toBe(true);
      });

      it('should validate current month', () => {
        expect(validateExpiryDate('01', '2024')).toBe(true);
      });

      describe('Invalid expiry dates', () => {
        it('should reject past dates', () => {
          expect(validateExpiryDate('12', '2023')).toBe(false);
          expect(validateExpiryDate('01', '2023')).toBe(false);
        });

        it('should reject invalid month values', () => {
          expect(validateExpiryDate('00', '2025')).toBe(false);
          expect(validateExpiryDate('13', '2025')).toBe(false);
          expect(validateExpiryDate('99', '2025')).toBe(false);
        });

        it('should reject invalid year values', () => {
          expect(validateExpiryDate('12', '202')).toBe(false);
          expect(validateExpiryDate('12', '20245')).toBe(false);
        });
      });

      describe('Edge cases', () => {
        it('should handle empty inputs', () => {
          expect(validateExpiryDate('', '')).toBe(false);
          expect(validateExpiryDate('12', '')).toBe(false);
          expect(validateExpiryDate('', '2025')).toBe(false);
        });

        it('should handle non-numeric inputs', () => {
          expect(validateExpiryDate('ab', '2025')).toBe(false);
          expect(validateExpiryDate('12', 'abcd')).toBe(false);
        });

        it('should handle boundary cases', () => {
          expect(validateExpiryDate('01', '2024')).toBe(true);
          expect(validateExpiryDate('02', '2024')).toBe(true);
        });
      });
    });

    describe('validateCvv', () => {
      describe('Valid CVV codes', () => {
        it('should validate 3-digit CVV for Visa', () => {
          expect(validateCvv('123', CardScheme.visa)).toBe(true);
          expect(validateCvv('000', CardScheme.visa)).toBe(true);
          expect(validateCvv('999', CardScheme.visa)).toBe(true);
        });

        it('should validate 3-digit CVV for Mastercard', () => {
          expect(validateCvv('123', CardScheme.mastercard)).toBe(true);
          expect(validateCvv('000', CardScheme.mastercard)).toBe(true);
          expect(validateCvv('999', CardScheme.mastercard)).toBe(true);
        });

        it('should validate 4-digit CVV for Amex', () => {
          expect(validateCvv('1234', CardScheme.amex)).toBe(true);
          expect(validateCvv('0000', CardScheme.amex)).toBe(true);
          expect(validateCvv('9999', CardScheme.amex)).toBe(true);
        });

        it('should validate 3-digit CVV for unknown scheme', () => {
          expect(validateCvv('123', CardScheme.unknown)).toBe(true);
        });
      });

      describe('Invalid CVV codes', () => {
        it('should reject wrong length for Visa', () => {
          expect(validateCvv('12', CardScheme.visa)).toBe(false);
          expect(validateCvv('1234', CardScheme.visa)).toBe(false);
        });

        it('should reject wrong length for Mastercard', () => {
          expect(validateCvv('12', CardScheme.mastercard)).toBe(false);
          expect(validateCvv('1234', CardScheme.mastercard)).toBe(false);
        });

        it('should reject wrong length for Amex', () => {
          expect(validateCvv('123', CardScheme.amex)).toBe(false);
          expect(validateCvv('12345', CardScheme.amex)).toBe(false);
        });

        it('should reject non-numeric CVV', () => {
          expect(validateCvv('abc', CardScheme.visa)).toBe(false);
          expect(validateCvv('12a', CardScheme.visa)).toBe(false);
          expect(validateCvv('abcd', CardScheme.amex)).toBe(false);
        });
      });

      describe('Edge cases', () => {
        it('should handle empty CVV', () => {
          expect(validateCvv('', CardScheme.visa)).toBe(false);
          expect(validateCvv('', CardScheme.amex)).toBe(false);
        });

        it('should handle mixed alphanumeric CVV', () => {
          expect(validateCvv('1a2', CardScheme.visa)).toBe(false);
          expect(validateCvv('1a2b', CardScheme.amex)).toBe(false);
        });

        it('should handle special characters', () => {
          expect(validateCvv('12-', CardScheme.visa)).toBe(false);
          expect(validateCvv('12#4', CardScheme.amex)).toBe(false);
        });
      });
    });
  });
});
