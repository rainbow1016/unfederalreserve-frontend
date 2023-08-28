import { Contract, providers } from 'ethers';
import { IEnv, env as ENVs } from '@/global/env';
import UniswapV2LPTokenAbi from '@/global/abi/uniswap-v2-LP-token-abi.json';
import { GUniswapV2LPToken } from '@/types/generated/uniswap/GUniswapV2LPToken';


export class LPToken {
  public methods: Contract & GUniswapV2LPToken;

  constructor(
    private address: string,
    private env: IEnv,
  ) {
    // eslint-disable-next-line no-underscore-dangle
    const InfuraProvider = new providers.InfuraProvider(ENVs.mainnet._NETWORK_ID);
    const contract = new Contract(address, UniswapV2LPTokenAbi, InfuraProvider);
    this.methods = contract as this['methods'];
  }

  public balanceOf(owner: string) {
    return this.methods.balanceOf(owner);
  }
}
