import { Contract, providers } from 'ethers';
import FaucetNonStandardAbi from '@/global/abi/FaucetNonStandard-abi.json';
import { GFaucetNonStandard } from '@/types/generated/GFaucetNonStandard';


export class FaucetNonStandard {
  public methods: Contract & GFaucetNonStandard;

  constructor(address: string, provider: providers.Web3Provider) {
    const contract = new Contract(address, FaucetNonStandardAbi, provider.getSigner());
    this.methods = contract as this['methods'];
  }
}
