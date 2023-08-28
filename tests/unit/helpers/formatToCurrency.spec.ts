import { formatToCurrency } from '@/helpers/formatters/formatToCurrency';


describe('Test formatToCurrency helper', () => {
  describe('- check number change', () => {
    it('returned number with default fraction = 2', () => {
      expect(formatToCurrency(0)).toBe('$0.00');
      expect(formatToCurrency(0.0)).toBe('$0.00');

      expect(formatToCurrency(9.5)).toBe('$9.50');
      expect(formatToCurrency(163)).toBe('$163.00');
      expect(formatToCurrency(-9.5)).toBe('-$9.50');

      expect(formatToCurrency(2.54656776875)).toBe('$2.55');
      expect(formatToCurrency(3105.1044906778)).toBe('$3,105.10');
      expect(formatToCurrency(-2.54656776875)).toBe('-$2.55');

      expect(formatToCurrency(1e-5)).toBe('$0.00');
    });
  });

  describe('- check number change and fraction digits', () => {
    it('returned number with different fractions', () => {
      expect(formatToCurrency(0, 4)).toBe('$0.00');
      expect(formatToCurrency(0.0, 2)).toBe('$0.00');

      expect(formatToCurrency(9.5, 0)).toBe('$10');
      expect(formatToCurrency(9.5, 3)).toBe('$9.50');

      expect(formatToCurrency(163, 0)).toBe('$163');
      expect(formatToCurrency(163, 3)).toBe('$163.00');

      expect(formatToCurrency(2.54656776875, 4)).toBe('$2.5466');
      expect(formatToCurrency(3105.1044906778, 3)).toBe('$3,105.104');

      expect(formatToCurrency(1e-5, 3)).toBe('$0.00');
    });
  });

  describe('- check number change and fraction digits and compact', () => {
    it('returned number with compact true', () => {
      expect(formatToCurrency(3112.852652768127, 2, true)).toBe('$3.11K');
      expect(formatToCurrency(3112.852652768127, 2, false)).toBe('$3,112.85');

      expect(formatToCurrency(3112.852652768127, 4, true)).toBe('$3.1129K');

      expect(formatToCurrency(0.0, 2, true)).toBe('$0.00');

      expect(formatToCurrency(3112.852652768127, 0, true)).toBe('$3K');

      expect(formatToCurrency(10000000, 0, true)).toBe('$10M');
    });
  });
});
