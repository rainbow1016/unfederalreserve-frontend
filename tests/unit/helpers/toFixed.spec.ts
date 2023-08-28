import { toFixed } from '@/helpers/toFixed';


describe('Test toFixed helper', () => {
  describe('- with string value', () => {
    it('returned cut ceil without fixed value', () => {
      expect(toFixed('99999999')).toBe('99999999');
      expect(toFixed('-9999999')).toBe('-9999999');

      expect(toFixed('00000000')).toBe('0');
      expect(toFixed('0')).toBe('0');

      expect(toFixed('11.11111')).toBe('11');
      expect(toFixed('-1.11111')).toBe('-1');
      expect(toFixed('55.00000')).toBe('55');
      expect(toFixed('0.000000')).toBe('0');
    });

    it('returned decimal part with fixed value without round', () => {
      expect(toFixed('999999', 2)).toBe('999999.00');
      expect(toFixed('-99999', 4)).toBe('-99999.0000');

      expect(toFixed('99.9999', 2)).toBe('99.99');
      expect(toFixed('-9.9999', 2)).toBe('-9.99');

      expect(toFixed('22.009999', 2)).toBe('22.00');
      expect(toFixed('-2.009999', 2)).toBe('-2.00');

      expect(toFixed('1.1', 2)).toBe('1.10');
      expect(toFixed('-1.1', 2)).toBe('-1.10');
    });

    it('returned converted value from value with exponent', () => {
      expect(toFixed('1.222e+18', 2)).toBe('1.22e+18');
      expect(toFixed('1e-18', 2)).toBe('1.00e-18');
      expect(toFixed('-99999', 4)).toBe('-99999.0000');
    });
  });

  describe('- with number value', () => {
    it('returned cut ceil without fixed value', () => {
      expect(toFixed(99999999)).toBe('99999999');
      expect(toFixed(-9999999)).toBe('-9999999');

      expect(toFixed(0)).toBe('0');
      expect(toFixed(-0)).toBe('0');
      expect(toFixed(+0)).toBe('0');

      expect(toFixed(11.11111)).toBe('11');
      expect(toFixed(-1.11111)).toBe('-1');

      expect(toFixed(55.00000)).toBe('55');
      expect(toFixed(0.000000)).toBe('0');
    });

    it('returned decimal part with fixed value without round', () => {
      expect(toFixed(999999, 2)).toBe('999999.00');
      expect(toFixed(-99999, 3)).toBe('-99999.000');

      expect(toFixed('99.9999', 2)).toBe('99.99');
      expect(toFixed('-9.9999', 2)).toBe('-9.99');

      expect(toFixed('22.009999', 2)).toBe('22.00');
      expect(toFixed('-2.009999', 2)).toBe('-2.00');

      expect(toFixed(11.1, 2)).toBe('11.10');
      expect(toFixed(-1.1, 2)).toBe('-1.10');
    });

    it('returned cut ceil without round BIG value', () => {
      expect(toFixed(1.9e18)).toBe('1900000000000000000');
      expect(toFixed(-1.9e18, 2)).toBe('-1900000000000000000.00');
    });

    it('returned cut ceil without round SMALL value', () => {
      expect(toFixed(1e-5)).toBe('0');
      expect(toFixed(1e-5, 2)).toBe('0');
      expect(toFixed(1e-8, 5)).toBe('1.00000e-8');

      expect(toFixed(1.79e-10)).toBe('2e-10');
      expect(toFixed(1.22e-10, 3)).toBe('1.220e-10');
    });
  });
});
