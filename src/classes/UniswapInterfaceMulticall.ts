import { Contract, providers } from 'ethers';
import { abi as MulticallABI } from '@uniswap/v3-periphery/artifacts/contracts/lens/UniswapInterfaceMulticall.sol/UniswapInterfaceMulticall.json';
import { GUniswapInterfaceMulticall } from '@/types/generated/uniswap/GUniswapInterfaceMulticall';


export class UniswapInterfaceMulticall {
  public methods: Contract & GUniswapInterfaceMulticall;

  constructor(address: string, provider: providers.Web3Provider) {
    const contract = new Contract(address, MulticallABI, provider.getSigner());
    this.methods = contract as this['methods'];
  }
}
