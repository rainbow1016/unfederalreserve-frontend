import { Contract, providers } from 'ethers';
import { abi as NFTPositionManagerABI } from '@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json';
import { GNonfungiblePositionManager } from '@/types/generated/uniswap/GNonfungiblePositionManager';


export class NonfungiblePositionManager {
  public methods: Contract & GNonfungiblePositionManager;

  constructor(
    private address: string,
    private provider: providers.Web3Provider,
  ) {
    const contract = new Contract(address, NFTPositionManagerABI, provider.getSigner());
    this.methods = contract as this['methods'];
  }
}
