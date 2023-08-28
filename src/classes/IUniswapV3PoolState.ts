import { Contract, providers } from 'ethers';
import { abi as IUniswapV3PoolStateABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/pool/IUniswapV3PoolState.sol/IUniswapV3PoolState.json';
import { GIUniswapV3PoolState } from '@/types/generated/uniswap/GIUniswapV3PoolState';


export class IUniswapV3PoolState {
  public methods: Contract & GIUniswapV3PoolState;

  constructor(
    private address: string,
    private provider: providers.Web3Provider,
  ) {
    const contract = new Contract(address, IUniswapV3PoolStateABI, provider.getSigner());
    this.methods = contract as this['methods'];
  }
}
