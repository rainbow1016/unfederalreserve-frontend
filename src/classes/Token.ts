import { Contract, providers, constants } from 'ethers';
import TokenAbi from '@/global/abi/Token-abi.json';
import { GToken } from '@/types/generated/GToken';


export class Token {
  public methods: Contract & GToken;

  constructor(
    public address: string,
    private provider: providers.Web3Provider,
  ) {
    const contract = new Contract(address, TokenAbi, provider.getSigner());
    this.methods = contract as this['methods'];
  }

  public approve(cToken: string, amount = constants.MaxUint256) {
    const signer = this.provider.getSigner();
    const contract = this.methods.connect(signer) as this['methods'];
    return contract.approve(cToken, amount);
  }
}
