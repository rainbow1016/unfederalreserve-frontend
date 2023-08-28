import { Contract, providers } from 'ethers';
import CompoundLensAbi from '@/global/abi/CompoundLens-abi.json';
import { GCompoundLens } from '@/types/generated/GCompoundLens';


export class CompoundLens {
  public methods: Contract & GCompoundLens;

  constructor(address: string, provider: providers.Web3Provider) {
    const signer = provider instanceof providers.Web3Provider ? provider.getSigner() : provider;
    const contract = new Contract(address, CompoundLensAbi, signer);
    this.methods = contract as this['methods'];
  }
}
