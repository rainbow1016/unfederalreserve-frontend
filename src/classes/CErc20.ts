import { Contract, providers } from 'ethers';
import CErc20Abi from '@/global/abi/Cerc20-abi.json';
import { GCerc20 } from '@/types/generated/GCerc20';


export class CErc20 {
  public methods: Contract & GCerc20;

  constructor(address: string, provider: providers.Web3Provider) {
    const contract = new Contract(address, CErc20Abi, provider.getSigner());
    this.methods = contract as this['methods'];
  }
}
