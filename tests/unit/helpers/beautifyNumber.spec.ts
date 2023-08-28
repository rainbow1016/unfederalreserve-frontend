import { beautifyNumber } from '@/helpers/formatters/beautifyNumber';


describe('Test beautifyNumber helper', () => {
  describe('- check number change', () => {
    it('returned number with isCurrency false', () => {
      expect(beautifyNumber(0, false)).toBe('0');
      expect(beautifyNumber(0.00, false)).toBe('0');

      expect(beautifyNumber(0.01, false)).toBe('0.01');
      expect(beautifyNumber(-0.01, false)).toBe('-0.01');
      expect(beautifyNumber(10.96, false)).toBe('10.96');

      expect(beautifyNumber(1997.28, false)).toBe('2K');
      expect(beautifyNumber(33097.89, false)).toBe('33.1K');
      expect(beautifyNumber(-33097.89, false)).toBe('-33.1K');
      expect(beautifyNumber(162835.4, false)).toBe('162.84K');

      expect(beautifyNumber(344556565.553129, false)).toBe('344.56M');
      expect(beautifyNumber(2191417500.553129, false)).toBe('2.19B');

      expect(beautifyNumber(1e+8, false)).toBe('100M');
    });
  });

  describe('- check number change and currency', () => {
    it('returned number with isCurrency true', () => {
      expect(beautifyNumber(0, true)).toBe('$0.00');
      expect(beautifyNumber(0.00, true)).toBe('$0.00');

      expect(beautifyNumber(0.12, true)).toBe('$0.12');
      expect(beautifyNumber(-0.12, true)).toBe('-$0.12');
      expect(beautifyNumber(25.45, true)).toBe('$25.45');

      expect(beautifyNumber(2967.77512318594, true)).toBe('$2.97K');
      expect(beautifyNumber(-2967.77512318594, true)).toBe('-$2.97K');

      expect(beautifyNumber(1841.8576902319462, true)).toBe('$1.84K');
      expect(beautifyNumber(344556565.553129, true)).toBe('$344.56M');
      expect(beautifyNumber(2191417500.553129, true)).toBe('$2.19B');

      expect(beautifyNumber(1e+8, true)).toBe('$100.00M');
    });
  });
});
