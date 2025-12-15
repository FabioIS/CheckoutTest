import { CardScheme } from '../src/types/payment.types';
import {
  cleanCardNumber,
  formatCardNumber,
  formatExpiryDate,
  parseExpiryDate,
} from '../src/utils/cardFormatting';

describe('cardFormatting utilities', () => {
  describe('cleanCardNumber', () => {
    it('should remove all spaces from card number', () => {
      expect(cleanCardNumber('4242 4242 4242 4242')).toBe('4242424242424242');
      expect(cleanCardNumber('3782 822463 10005')).toBe('378282246310005');
      expect(cleanCardNumber('  4242  4242  4242  4242  ')).toBe('4242424242424242');
    });

    it('should handle empty string', () => {
      expect(cleanCardNumber('')).toBe('');
    });

    it('should handle string with no spaces', () => {
      expect(cleanCardNumber('4242424242424242')).toBe('4242424242424242');
    });

    it('should handle multiple consecutive spaces', () => {
      expect(cleanCardNumber('4242   4242   4242   4242')).toBe('4242424242424242');
    });
  });

  describe('formatCardNumber', () => {
    describe('Visa/Mastercard formatting', () => {
      it('should format Visa card numbers in groups of 4', () => {
        expect(formatCardNumber('4242424242424242', CardScheme.visa)).toBe('4242 4242 4242 4242');
        expect(formatCardNumber('5555555555554444', CardScheme.mastercard)).toBe(
          '5555 5555 5555 4444'
        );
      });

      it('should handle partial card numbers', () => {
        expect(formatCardNumber('4242', CardScheme.visa)).toBe('4242');
        expect(formatCardNumber('42424242', CardScheme.visa)).toBe('4242 4242');
        expect(formatCardNumber('424242424242', CardScheme.visa)).toBe('4242 4242 4242');
      });

      it('should remove existing spaces before formatting', () => {
        expect(formatCardNumber('4242 4242 4242 4242', CardScheme.visa)).toBe(
          '4242 4242 4242 4242'
        );
      });
    });

    describe('Amex formatting', () => {
      it('should format Amex card numbers correctly (4-6-5)', () => {
        expect(formatCardNumber('378282246310005', CardScheme.amex)).toBe('3782 822463 10005');
        expect(formatCardNumber('371449635398431', CardScheme.amex)).toBe('3714 496353 98431');
      });

      it('should handle partial Amex card numbers', () => {
        expect(formatCardNumber('3782', CardScheme.amex)).toBe('3782');
        expect(formatCardNumber('3782822463', CardScheme.amex)).toBe('3782822463');
        expect(formatCardNumber('378282246310005', CardScheme.amex)).toBe('3782 822463 10005');
      });

      it('should remove existing spaces before formatting Amex', () => {
        expect(formatCardNumber('3782 822463 10005', CardScheme.amex)).toBe('3782 822463 10005');
      });
    });

    describe('Unknown scheme formatting', () => {
      it('should default to Visa/Mastercard format for unknown schemes', () => {
        expect(formatCardNumber('1234567890123456', CardScheme.unknown)).toBe(
          '1234 5678 9012 3456'
        );
      });
    });

    describe('Edge cases', () => {
      it('should handle empty string', () => {
        expect(formatCardNumber('', CardScheme.visa)).toBe('');
        expect(formatCardNumber('', CardScheme.amex)).toBe('');
      });

      it('should handle single digits', () => {
        expect(formatCardNumber('4', CardScheme.visa)).toBe('4');
        expect(formatCardNumber('3', CardScheme.amex)).toBe('3');
      });
    });
  });

  describe('formatExpiryDate', () => {
    describe('MM/YYYY format input', () => {
      it('should handle already formatted input', () => {
        expect(formatExpiryDate('12/2025')).toBe('12/2025');
        expect(formatExpiryDate('01/2024')).toBe('01/2024');
      });

      it('should handle partial year in formatted input', () => {
        expect(formatExpiryDate('12/20')).toBe('12/20');
        expect(formatExpiryDate('12/')).toBe('12/');
      });

      it('should handle incomplete month in formatted input', () => {
        expect(formatExpiryDate('1/2025')).toBe('1');
      });

      it('should remove non-digits from formatted input', () => {
        expect(formatExpiryDate('1a2/b2c0d2e5')).toBe('12/2025');
        expect(formatExpiryDate('01/abcd2025')).toBe('01/2025');
      });
    });

    describe('Raw digit input', () => {
      it('should format raw digits to MM/YYYY', () => {
        expect(formatExpiryDate('122025')).toBe('12/2025');
        expect(formatExpiryDate('012024')).toBe('01/2024');
      });

      it('should handle partial input', () => {
        expect(formatExpiryDate('1')).toBe('1');
        expect(formatExpiryDate('12')).toBe('12');
        expect(formatExpiryDate('123')).toBe('12/3');
        expect(formatExpiryDate('1225')).toBe('12/25');
      });

      it('should limit year to 4 digits', () => {
        expect(formatExpiryDate('12202512345')).toBe('12/2025');
      });

      it('should remove non-digits from raw input', () => {
        expect(formatExpiryDate('1a2b2c0d2e5f')).toBe('12/2025');
      });
    });

    describe('Edge cases', () => {
      it('should handle empty string', () => {
        expect(formatExpiryDate('')).toBe('');
      });

      it('should handle only non-digit characters', () => {
        expect(formatExpiryDate('abcd')).toBe('');
      });

      it('should handle month longer than 2 digits', () => {
        expect(formatExpiryDate('1234567')).toBe('12/3456');
      });
    });
  });

  describe('parseExpiryDate', () => {
    it('should parse valid formatted expiry dates', () => {
      expect(parseExpiryDate('12/2025')).toEqual({ month: '12', year: '2025' });
      expect(parseExpiryDate('01/2024')).toEqual({ month: '01', year: '2024' });
    });

    it('should handle partial dates', () => {
      expect(parseExpiryDate('12/')).toEqual({ month: '12', year: '' });
      expect(parseExpiryDate('12')).toEqual({ month: '12', year: '' });
    });

    it('should handle empty parts', () => {
      expect(parseExpiryDate('/2025')).toEqual({ month: '', year: '2025' });
      expect(parseExpiryDate('/')).toEqual({ month: '', year: '' });
    });

    it('should handle empty string', () => {
      expect(parseExpiryDate('')).toEqual({ month: '', year: '' });
    });

    it('should handle malformed input', () => {
      expect(parseExpiryDate('invalid')).toEqual({ month: 'invalid', year: '' });
    });

    it('should handle multiple slashes', () => {
      expect(parseExpiryDate('12/20/25')).toEqual({ month: '12', year: '20' });
    });
  });
});
