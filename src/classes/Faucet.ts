import { Contract, providers } from 'ethers';
import FaucetAbi from '@/global/abi/Faucet-abi.json';
import { GFaucet } from '@/types/generated/GFaucet';


export class Faucet {
  public methods: Contract & GFaucet;

  constructor(address: string, provider: providers.Web3Provider) {
    const contract = new Contract(address, FaucetAbi, provider.getSigner());
    this.methods = contract as this['methods'];
  }
}
