/**
 * Short doc: https://git.io/Jge8Y
 */

import { BigNumber, providers, constants } from 'ethers';

import { ContractTransactionOverrides } from '@/types/generated/GCEther';
import { CEther } from '@/classes/CEther';
import { CErc20 } from '@/classes/CErc20';


export class CToken {
  public methods: CEther['methods'] | CErc20['methods'];

  constructor(
    public address: string,
    private provider: providers.Web3Provider,
    public isEther: boolean,
  ) {
    const { methods } = isEther
      ? new CEther(address, provider)
      : new CErc20(address, provider);

    this.methods = methods;
  }

  public approve(cToken: string, amount = constants.MaxUint256) {
    const signer = this.provider.getSigner();
    const contract = this.methods.connect(signer) as this['methods'];
    return contract.approve(cToken, amount);
  }

  public async mint(mintAmount: BigNumber, overrides?: ContractTransactionOverrides) {
    const signer = this.provider.getSigner();
    const contract = this.methods.connect(signer) as this['methods'];

    if (this.isEther) {
      const params = { value: mintAmount, ...overrides };
      return (contract as CEther['methods']).mint(params);
    }

    return contract.mint(mintAmount);
  }

  public async redeem(value: BigNumber) {
    const signer = this.provider.getSigner();
    const contract = this.methods.connect(signer) as this['methods'];
    return contract.redeem(value);
  }

  public borrow(borrowAmount: BigNumber) {
    const signer = this.provider.getSigner();
    const contract = this.methods.connect(signer) as this['methods'];
    return contract.borrow(borrowAmount);
  }

  public async repayBorrow(repayAmount: BigNumber, overrides?: ContractTransactionOverrides) {
    const signer = this.provider.getSigner();
    const contract = this.methods.connect(signer) as this['methods'];

    if (this.isEther) {
      const params = { value: repayAmount, ...overrides };
      return (contract as CEther['methods']).repayBorrow(params);
    }

    return contract.repayBorrow(repayAmount);
  }
}
