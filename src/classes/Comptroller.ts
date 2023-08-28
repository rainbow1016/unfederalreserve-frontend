/**
 * Short doc: https://git.io/JgeYN
 */

import { Contract, providers } from 'ethers';
import ComptrollerAbi from '@/global/abi/Comptroller-abi.json';
import { GComptroller } from '@/types/generated/GComptroller';


export class Comptroller {
  public methods: Contract & GComptroller;

  constructor(
    private address: string,
    private provider: providers.Web3Provider | providers.InfuraProvider,
  ) {
    const signer = provider instanceof providers.Web3Provider ? provider.getSigner() : provider;
    const contract = new Contract(address, ComptrollerAbi, signer);
    this.methods = contract as this['methods'];
  }

  public async getAccountLiquidity(ethAccount?: string) {
    const account = ethAccount || await this.provider.getSigner().getAddress();
    return this.methods.getAccountLiquidity(account);
  }

  public async claimRewards(cTokens: string[]) {
    const account = await this.provider.getSigner().getAddress();
    type IClaimRewards = this['methods']['claimRewards']

    if (cTokens.length) {
      const methodName = 'claimRewards(address,address[])';
      return (this.methods[methodName] as IClaimRewards)(account, cTokens);
    }

    const methodName = 'claimRewards(address)';
    return (this.methods[methodName] as IClaimRewards)(account);
  }
}
