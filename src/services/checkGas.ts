import { Account } from '@/types/common.d';


export const checkGas = async (account: Account) => {
  const { markets, ethAccount, web3Provider } = account;
  const ETH = markets.find((_) => _.isEther);
  if (!ETH) return true;

  const estimateGasOptions = {
    from: ethAccount,
    // eslint-disable-next-line no-underscore-dangle
    to: ETH._tokenMetadata.cToken,
    data: '0x1249c58b',
    value: 0,
  };

  const gasPrice = await web3Provider.getGasPrice();
  const gasLimit = await web3Provider.estimateGas(estimateGasOptions);

  const transactionFee = gasPrice.mul(gasLimit);

  // eslint-disable-next-line no-underscore-dangle
  return ETH._balances.tokenBalance.gt(transactionFee);
};
