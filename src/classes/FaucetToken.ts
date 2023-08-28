import { BigNumber, providers } from 'ethers';

import { Faucet } from '@/classes/Faucet';
import { FaucetNonStandard } from '@/classes/FaucetNonStandard';

export class FaucetToken {
  public methods: FaucetNonStandard['methods'] | Faucet['methods'];

  constructor(
    public token: string,
    private provider: providers.Web3Provider,
    public isNonStandard: boolean,
    public account: string,
  ) {
    const { methods } = isNonStandard
      ? new FaucetNonStandard(token, provider)
      : new Faucet(token, provider);

    this.methods = methods;
  }

  // eslint-disable-next-line class-methods-use-this
  public allocateEth() {
    const win = window.open('https://faucet.rinkeby.io', '_blank');
    if (win) win.focus();
  }

  public async allocateTo(value: BigNumber) {
    const signer = this.provider.getSigner();
    const contract = this.methods.connect(signer) as this['methods'];
    return contract.allocateTo(this.account, value);
  }
}
