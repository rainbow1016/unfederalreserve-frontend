import { convertToUsd } from '@/helpers/formatters/convertToUsd';
import { utils } from 'ethers';

describe('Test convertToUsd helper', () => {
  describe('- with BigNumber value and price', () => {
    it('change value', () => {
      expect(convertToUsd(utils.parseUnits('1'), utils.parseUnits('389'))).toBe(389);
      expect(convertToUsd(utils.parseUnits('100'), utils.parseUnits('389'))).toBe(38900);

      expect(convertToUsd(utils.parseUnits('0.01'), utils.parseUnits('389'))).toBe(3.89);
      expect(convertToUsd(utils.parseUnits('1.00'), utils.parseUnits('389'))).toBe(389);

      expect(convertToUsd(utils.parseUnits('0.0000001'), utils.parseUnits('389'))).toBe(0.0000389);
      expect(convertToUsd(utils.parseUnits('1.0000000'), utils.parseUnits('389'))).toBe(389);

      expect(convertToUsd(utils.parseUnits('0'), utils.parseUnits('389'))).toBe(0);
      expect(convertToUsd(utils.parseUnits('0000'), utils.parseUnits('389'))).toBe(0);
    });
  });

  describe('- with string value and price and underlying decimals', () => {
    it('change value', () => {
      expect(convertToUsd(
        '3999.999999',
        utils.parseUnits('1'),
        utils.parseUnits('18', 0),
      )).toBe(3999.999999);

      expect(convertToUsd(
        '-3999.999999',
        utils.parseUnits('1'),
        utils.parseUnits('18', 0),
      )).toBe(-3999.999999);

      expect(convertToUsd(
        '0.999999',
        utils.parseUnits('1'),
        utils.parseUnits('18', 0),
      )).toBe(0.999999);

      expect(convertToUsd(
        '-0.999999',
        utils.parseUnits('1'),
        utils.parseUnits('18', 0),
      )).toBe(-0.999999);

      expect(convertToUsd(
        '0.0',
        utils.parseUnits('1'),
        utils.parseUnits('18', 0),
      )).toBe(0);

      expect(convertToUsd(
        '0',
        utils.parseUnits('1'),
        utils.parseUnits('18', 0),
      )).toBe(0);

      expect(convertToUsd(
        '1e-5', // 0.00001
        utils.parseUnits('1'),
        utils.parseUnits('18', 0),
      )).toBe(0.00001);
    });

    it('change price', () => {
      expect(convertToUsd(
        '3',
        utils.parseUnits('0.5'),
        utils.parseUnits('18', 0),
      )).toBe(1.5);

      expect(convertToUsd(
        '3',
        utils.parseUnits('2'),
        utils.parseUnits('18', 0),
      )).toBe(6);

      expect(convertToUsd(
        '-3',
        utils.parseUnits('0.5'),
        utils.parseUnits('18', 0),
      )).toBe(-1.5);

      expect(convertToUsd(
        '-3',
        utils.parseUnits('2'),
        utils.parseUnits('18', 0),
      )).toBe(-6);

      expect(convertToUsd(
        '-3',
        utils.parseUnits('0'),
        utils.parseUnits('18', 0),
      )).toBe(0);

      expect(convertToUsd(
        '-3',
        utils.parseUnits('0.0'),
        utils.parseUnits('18', 0),
      )).toBe(0);

      expect(convertToUsd(
        '333',
        utils.parseUnits('0'),
        utils.parseUnits('18', 0),
      )).toBe(0);

      expect(convertToUsd(
        '333',
        utils.parseUnits('0.0'),
        utils.parseUnits('18', 0),
      )).toBe(0);

      expect(convertToUsd(
        '3',
        utils.parseUnits('0.00001'),
        utils.parseUnits('18', 0),
      )).toBe(0.00003);
    });

    it('change underlying decimals', () => {
      expect(convertToUsd(
        '3999.999999',
        utils.parseUnits('1'),
        utils.parseUnits('15', 0),
      )).toBe(3.999999999);

      expect(convertToUsd(
        '-3999.999999',
        utils.parseUnits('1'),
        utils.parseUnits('15', 0),
      )).toBe(-3.999999999);

      expect(convertToUsd(
        '0.999999',
        utils.parseUnits('1'),
        utils.parseUnits('14', 0),
      )).toBe(0.0000999999);

      expect(convertToUsd(
        '-0.999999',
        utils.parseUnits('1'),
        utils.parseUnits('14', 0),
      )).toBe(-0.0000999999);
    });
  });
});
