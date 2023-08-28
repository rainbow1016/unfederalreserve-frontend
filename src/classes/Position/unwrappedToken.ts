import { Currency, WETH9, Ether } from '@uniswap/sdk-core';


export class ExtendedEther extends Ether {
  public get wrapped() {
    if (this.chainId in WETH9) return WETH9[this.chainId];
    throw new Error('Unsupported chain ID');
  }

  private static _cachedEther: { [chainId: number]: ExtendedEther } = {};

  public static onChain(chainId: number): ExtendedEther {
    // eslint-disable-next-line no-return-assign, no-underscore-dangle
    return this._cachedEther[chainId] ?? (this._cachedEther[chainId] = new ExtendedEther(chainId));
  }
}

export const unwrappedToken = (currency: Currency) => {
  if (currency.isNative) return currency;
  const { chainId } = currency;

  if (currency.equals(WETH9[chainId])) {
    return ExtendedEther.onChain(currency.chainId);
  }

  return currency;
};
