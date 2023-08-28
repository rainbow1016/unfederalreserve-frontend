import { Contract, providers } from 'ethers';
import CEtherAbi from '@/global/abi/CEther-abi.json';
import { GCEther } from '@/types/generated/GCEther';


const ETHER_SYMBOLS = [
  'unFederal ETH', // TODO: WTF ?!!
  'unETH',
  'WETH',
];

export class CEther {
  public methods: Contract & GCEther;

  constructor(address: string, provider: providers.Web3Provider) {
    const contract = new Contract(address, CEtherAbi, provider.getSigner());

    this.methods = contract as this['methods'];
  }

  public isEther() {
    return this.methods.symbol().then((symbol) => (
      ETHER_SYMBOLS.includes(symbol)
    ));
  }
}
