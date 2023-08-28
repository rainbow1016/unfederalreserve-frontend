import { BigNumber } from 'ethers';
import { CalculationsDefaults } from '@/helpers/enums/params';


// TODO check what type of ratePerBlock really is
export const calculateAPY = (ratePerBlock: BigNumber) => {
  const x = (ratePerBlock.toNumber() / CalculationsDefaults.ETH_MANTISSA) * CalculationsDefaults.BLOCKS_PER_DAY + 1;
  const apy = ((x ** CalculationsDefaults.DAYS_PER_YEAR) - 1) * 100;
  return apy; // Number(apy.toFixed(2));
};
