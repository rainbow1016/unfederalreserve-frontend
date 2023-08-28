import { IProviderOptions } from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { WalletLink } from 'walletlink';

import coinbaseSVG from '@/assets/images/icons/coinbase.svg';

type IConnectorOptions = {
  appName: string;
  networkUrl: string;
  chainId: number;
}

export const PROVIDER_OPTIONS_WALLETCONNECT: IProviderOptions[string] = {
  package: WalletConnectProvider,
  /*
  options: {
    chainId,
    networkId,
    infuraId,
  },
  */
};

export const PROVIDER_OPTIONS_WALLETLINK: IProviderOptions[string] = {
  display: {
    name: 'Coinbase',
    logo: coinbaseSVG as unknown as string,
  },
  /*
  options: {
    chainId,
    networkUrl,
  },
  */
  package: WalletLink,
  connector: async (_provider, options: IConnectorOptions) => {
    const { appName, networkUrl, chainId } = options;
    const walletLink = new WalletLink({
      appName,
    });
    const provider = walletLink.makeWeb3Provider(networkUrl, chainId);
    await provider.enable();
    return provider;
  },
};
