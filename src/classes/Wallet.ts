/* eslint no-underscore-dangle: 0 */

import keyBy from 'lodash/keyBy';
import uniq from 'lodash/uniq';
import { markRaw, shallowReactive, isProxy } from 'vue';
import { ContractTransaction, providers } from 'ethers';
import { SafeAppWeb3Modal } from '@gnosis.pm/safe-apps-web3modal';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { memoizeAsync, retry } from 'utils-decorators';
import { storage } from '@/services';

import { IHistoryTransaction } from '@/types/common.d';
import { Account } from '@/classes/Account';
import { IEnv, env as ENVs } from '@/global/env';
import {
  PROVIDER_OPTIONS_WALLETCONNECT,
  PROVIDER_OPTIONS_WALLETLINK,
} from '@/helpers/enums/provider-options';
import { TRANSACTION_STATUSES } from '@/helpers/enums/params';


export const WalletProviderTypes = {
  MetaMask: 'metamask',
  WalletConnect: 'walletconnect',
  Coinbase: 'custom-walletlink',
} as const;

type WalletProviderKeys = keyof typeof WalletProviderTypes;

type ProviderController = {
  providers: {
    check: string;
    connector: () => Promise<unknown>;
    id: string;
    logo: string;
    name: keyof typeof WalletProviderTypes;
    package: unknown;
    type: 'web' | 'injected' | 'qrcode';
  }[];
}

export const SUPPORTED_NETWORK_CHAIN_ID = [
  ENVs.mainnet._CHAIN_ID,
  ENVs.rinkeby._CHAIN_ID,
  ENVs.private._CHAIN_ID,
] as number[];

const DEFAULT_ENV = ENVs[process.env.VUE_APP_DEFAULT_NETWORK];

const createSafeAppWeb3Modal = (env: IEnv) => {
  const options = {
    network: env._NETWORK_NAME,
    chainId: env._CHAIN_ID,
    networkId: env._NETWORK_ID,
    infuraId: env.INFURA_ID,
    networkUrl: env.NETWORK_URL,
  };

  const providerOptions = {
    [WalletProviderTypes.WalletConnect]: {
      ...PROVIDER_OPTIONS_WALLETCONNECT,
      options,
    },
    [WalletProviderTypes.Coinbase]: {
      ...PROVIDER_OPTIONS_WALLETLINK,
      options,
    },
  };

  const modal = new SafeAppWeb3Modal({
    network: options.network,
    cacheProvider: true,
    providerOptions,
  });

  return markRaw(modal);
};


export class Wallet {
  private static instance: Wallet;

  public ethAccounts = storage.accounts.get([]);

  public ethAccount = this.ethAccounts.find((_) => _.active)?.ethAccount || '';

  public ethAccountSelected = '';

  public isSelectedEthAccount = true;

  public account: Account | null = null;

  public isMetaMaskUnlocked = false;

  public isAnyConnected = false;

  public isLoadingConnect = true;

  public isSupportedNetwork = true;

  public txLastHistory = [] as IHistoryTransaction[];

  public txPendingHistory = [] as IHistoryTransaction[];

  public externalProvider: providers.ExternalProvider | null = null;

  public web3Provider: providers.Web3Provider | null = null;

  constructor(
    private safeAppWeb3Modal: SafeAppWeb3Modal,
    public env: IEnv | null = DEFAULT_ENV,
    public chainId: number | null = env?._CHAIN_ID || null,
  ) {
    // do not set subscribes because missing reactivity,
    // use for that initialize method
  }

  public static buildClass(env = DEFAULT_ENV) {
    if (Wallet.instance) return Wallet.instance;

    const safeAppWeb3Modal = createSafeAppWeb3Modal(env);

    const instance = new Wallet(safeAppWeb3Modal, DEFAULT_ENV, DEFAULT_ENV._CHAIN_ID);

    Wallet.instance = shallowReactive(instance);

    return Wallet.instance;
  }

  @memoizeAsync(1000)
  @retry({
    delaysArray: [1000, 5000, 16000],
    delay: 1500,
    // eslint-disable-next-line no-console
    onRetry: (e, retriesCount) => console.log(e, retriesCount, 'Wallet#update'),
  })
  private async update() {
    return this.updateOnce();
  }

  private async updateOnce() {
    if (process.env.NODE_ENV !== 'production') {
      if (!isProxy(this)) {
        // eslint-disable-next-line no-console
        console.warn('[App warn]: Wallet#update is not in reactivity');
      }
    }

    const { externalProvider } = this;
    if (!externalProvider) return this;

    const web3Provider = new providers.Web3Provider(
      externalProvider,
    );

    this.web3Provider = web3Provider;

    const promises1 = [
      // web3Provider.listAccounts(),
      web3Provider.getSigner().getAddress(),
      web3Provider.getSigner().getChainId() as Promise<this['chainId']>,
    ] as const;

    const [
      ethAccountSelected,
      chainId,
    ] = await Promise.all(promises1);

    const env = ENVs[chainId as IEnv['_CHAIN_ID']] || null;

    this.isSupportedNetwork = chainId !== null
      ? SUPPORTED_NETWORK_CHAIN_ID.includes(chainId)
      : false;

    this.ethAccountSelected = ethAccountSelected.toLowerCase();
    this.ethAccount = this.ethAccount.toLowerCase() || ethAccountSelected.toLowerCase();
    this.isSelectedEthAccount = this.ethAccount.toLowerCase() === ethAccountSelected.toLowerCase();
    this.chainId = chainId;
    this.env = env;

    if (!this.isSupportedNetwork) {
      this.account?.destroy();
      this.account = null;
      return this;
    }

    if (!this.ethAccount) {
      this.disconnect(false);
      return this;
    }

    this.account?.destroy();
    const account = Account.buildClass(
      web3Provider,
      this.ethAccount,
      env,
      this,
    );

    await account.updateAllMarketsOnce();

    this.account = account;

    return this;
  }

  private writeAccountsToLS(isNew = true) {
    const { ethAccount, chainId } = this;
    const provider = this.current_provider_settings?.name;

    if (!chainId || !provider) return;

    const ethAccounts = this.ethAccounts
      .filter((_) => _.ethAccount.toLowerCase() !== ethAccount.toLowerCase())
      .map((_) => ({ ..._, active: false }));

    const accountNew = {
      ethAccount,
      chainId,
      provider,
      active: true,
    };

    if (isNew) {
      ethAccounts.unshift(accountNew);
    } else {
      const account = this.ethAccounts.find((_) => (
        _.ethAccount.toLowerCase() === ethAccount.toLowerCase()
      )) || accountNew;
      ethAccounts.unshift({ ...account, active: true });
    }

    storage.accounts.set(ethAccounts);

    this.ethAccounts = ethAccounts;
  }

  public async setAccount(data: this['ethAccounts'][0]) {
    this.ethAccount = data.ethAccount;
    this.writeAccountsToLS(false);

    // see loading if chainId supported
    this.isLoadingConnect = (
      this.chainId === null
      || SUPPORTED_NETWORK_CHAIN_ID.includes(this.chainId)
    );

    this.account?.destroy();
    this.account = null;

    try {
      await this.update();
    } finally {
      this.isLoadingConnect = false;
    }
  }

  public removeAccount(data: this['ethAccounts'][0]) {
    const index = this.ethAccounts.indexOf(data);

    if (index > -1) {
      const ethAccounts = [...this.ethAccounts];
      ethAccounts.splice(index, 1);
      this.ethAccounts = ethAccounts;
      storage.accounts.set(ethAccounts);
    }
  }

  @memoizeAsync(1000)
  public async updateTx(txHash?: string) {
    const chainId = this.chainId as unknown as number;
    const etherscanProvider = new providers.EtherscanProvider(
      chainId === ENVs.private._CHAIN_ID ? void 0 : chainId,
      this.env?.ETHERSCAN_API_KEY,
    );

    const txHistory = await etherscanProvider.getHistory(this.ethAccount);

    const promises = uniq(txHistory.slice(-3).map((_) => _.hash).concat(txHash || ''))
      .filter(Boolean).slice(-3).reverse()
      .map((hash) => (etherscanProvider.getTransactionReceipt(hash)));

    const txLastHistory = await Promise.all(promises);

    this.txLastHistory = txLastHistory.map((_) => ({
      hash: _.transactionHash,
      status: _.status === 0
        ? TRANSACTION_STATUSES.FAILED
        : (_.status as IHistoryTransaction['status']),
    }));
  }

  public async watchTx(
    tx: ContractTransaction,
    params: {
      position?: IHistoryTransaction['position'];
    } = {},
  ) {
    const txHistory = {
      ...params,
      hash: tx.hash,
      status: TRANSACTION_STATUSES.PENDING,
    };

    this.txPendingHistory = this.txPendingHistory.concat(txHistory);

    try {
      await tx.wait();
    } finally {
      const list = this.txPendingHistory.slice();
      const data = list.splice(list.indexOf(txHistory), 1);
      this.txPendingHistory = list;

      if (!this.txPendingHistory.length) {
        void this.updateTx(data[0]?.hash);
      }
    }
  }

  public async connect() {
    if (process.env.NODE_ENV !== 'production') {
      if (!isProxy(this)) {
        // eslint-disable-next-line no-console
        console.warn('[App warn]: Wallet#connect is not in reactivity');
      }
    }

    if (this.chainId) {
      this.isSupportedNetwork = SUPPORTED_NETWORK_CHAIN_ID.includes(this.chainId);
    }

    // see loading if chainId supported
    this.isLoadingConnect = (
      this.chainId === null
      || SUPPORTED_NETWORK_CHAIN_ID.includes(this.chainId)
    );

    this.account?.destroy();
    this.account = null;

    const { cachedProvider } = this.safeAppWeb3Modal;

    const provider = Object.values(this.supported_providers)
      .find((_) => _.id === cachedProvider);

    this.isAnyConnected = !!provider;

    if (!provider) {
      this.isLoadingConnect = false;
      return Promise.resolve(this);
    }

    if (provider.name === 'MetaMask') {
      this.isMetaMaskUnlocked = await (window.ethereum as MetaMaskInpageProvider)?._metamask?.isUnlocked();
      if (!this.isMetaMaskUnlocked) {
        this.isAnyConnected = false;
        this.isLoadingConnect = false;
        // TODO: need subscribe for detect unlocked changed
        return Promise.resolve(this);
      }
    }

    return this.connectTo(provider.name, true);
  }

  public async connectTo(providerType: WalletProviderKeys, fromCache = false) {
    type IType = providers.ExternalProvider & providers.Web3Provider;
    (this.externalProvider as IType)?.removeAllListeners();
    // (this.externalProvider as { disconnect?: () => void })?.disconnect?.();
    // (this.externalProvider as { close?: () => void })?.close?.();
    this.account?.destroy();

    // see loading if chainId supported
    this.isLoadingConnect = (
      this.chainId === null
      || SUPPORTED_NETWORK_CHAIN_ID.includes(this.chainId)
    );

    this.account = null;
    this.txLastHistory = [];
    this.txPendingHistory = [];
    this.externalProvider = null;
    this.web3Provider = null;

    const { id } = this.supported_providers[providerType];
    const { safeAppWeb3Modal } = this;

    try {
      const action = fromCache ? safeAppWeb3Modal.connect() : safeAppWeb3Modal.connectTo(id);
      const externalProvider = await action as providers.ExternalProvider;
      const chainId = +(externalProvider as { chainId: number | void }).chainId;

      const needChangeExternalProvider = (
        this.chainId !== +chainId
        && chainId
        && this.chainId
      );

      if (chainId) {
        const env = ENVs[chainId as IEnv['_CHAIN_ID']] || null;
        this.chainId = chainId;
        this.env = env;

        this.isSupportedNetwork = SUPPORTED_NETWORK_CHAIN_ID.includes(this.chainId);
        this.isLoadingConnect = this.isSupportedNetwork;
      }

      // if chainId and externalProvider.chainId is nor equal need change
      if (needChangeExternalProvider) {
        // eslint-disable-next-line no-console
        console.log(
          `[App log]: for provider "${providerType}"`,
          `change chainId ${needChangeExternalProvider} -> ${chainId}`,
        );

        this.env = ENVs[chainId as IEnv['_CHAIN_ID']] || null;
        (externalProvider as { disconnect: () => never }).disconnect?.();

        if (this.env) {
          this.safeAppWeb3Modal = createSafeAppWeb3Modal(this.env);
        }

        const action1 = fromCache ? this.safeAppWeb3Modal.connect() : this.safeAppWeb3Modal.connectTo(id);
        const externalProvider1 = await action1 as providers.ExternalProvider;
        this.externalProvider = markRaw(externalProvider1);
      } else {
        this.externalProvider = markRaw(externalProvider);
      }

      this.isAnyConnected = true;
      if (!fromCache) this.ethAccount = '';
      await this.connectUpdate();
      void this.writeAccountsToLS(!fromCache);
    } catch (error) {
      this.isLoadingConnect = false;

      if (error) {
        // eslint-disable-next-line no-console
        console.error('[App warn]: wallet connect closed', error);
        safeAppWeb3Modal.clearCachedProvider();
        this.disconnect(false);
      }

      return false;
    }

    return true;
  }

  public async connectUpdate() {
    try {
      await this.update();
      void this.subscribe(this.externalProvider);
    } finally {
      this.isLoadingConnect = false;
    }
  }

  public disconnect(forget = true) {
    if (process.env.NODE_ENV !== 'production') {
      if (!isProxy(this)) {
        // eslint-disable-next-line no-console
        console.warn('[App warn]: Wallet#disconnect is not in reactivity');
      }
    }

    type IType = providers.ExternalProvider & providers.Web3Provider;

    (this.externalProvider as IType)?.removeAllListeners();

    if (forget === true) {
      const currentProvider = this.current_provider_settings?.name;
      this.ethAccounts.forEach((account) => {
        if (account.provider !== currentProvider) return;
        this.removeAccount(account);
      });

      (this.externalProvider as { close?: () => void })?.close?.();
      (this.externalProvider as { disconnect?: () => void })?.disconnect?.();
    }

    this.safeAppWeb3Modal.clearCachedProvider();
    this.account?.destroy();
    // storage.accounts.set([]);

    this.ethAccount = '';
    this.ethAccounts = [];
    this.account = null;
    this.isSelectedEthAccount = true;
    this.isMetaMaskUnlocked = false;
    this.isAnyConnected = false;
    this.isLoadingConnect = false;
    this.isSupportedNetwork = true;
    this.txLastHistory = [];
    this.txPendingHistory = [];
    this.externalProvider = null;
    this.web3Provider = null;
  }

  private subscribe(provider: providers.ExternalProvider | null) {
    type IType = typeof provider & providers.Web3Provider;
    const externalProvider = provider as unknown as IType;

    const onEventClose = () => void this.disconnect(false);
    const onEventDisconnect = () => void this.disconnect(false);
    const onEventConnect = () => void this.connect();

    const onEventChainChanged = (id: typeof SUPPORTED_NETWORK_CHAIN_ID[number]) => {
      if (this.chainId === +id) return;
      this.chainId = +id;
      void this.connect();
    };

    const onEventAccountsChanged = async (accounts: string[]) => {
      if (accounts.length) {
        [this.ethAccount] = accounts;
        this.writeAccountsToLS(false);
        void this.connect();
      } else {
        void this.disconnect(false);

        if (this.externalProvider?.isMetaMask) {
          this.isMetaMaskUnlocked = await (window.ethereum as MetaMaskInpageProvider)?._metamask?.isUnlocked();
        }
      }
    };

    externalProvider?.removeAllListeners();
    externalProvider?.on?.('close', onEventClose);
    externalProvider?.on?.('disconnect', onEventDisconnect);
    externalProvider?.on?.('connect', onEventConnect);
    externalProvider?.on?.('chainChanged', onEventChainChanged);
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    externalProvider?.on?.('accountsChanged', onEventAccountsChanged);
  }

  public get isMetaMaskInjected() {
    return 'MetaMask' in this.supported_providers;
  }

  public get supported_providers() {
    // @ts-ignore TODO: need typings
    const list = (this.safeAppWeb3Modal.providerController as ProviderController)
      .providers.filter((_) => (
        WalletProviderTypes[_.name]
      ));

    type IReturn = Record<WalletProviderKeys, typeof list[number]>;
    return keyBy(list, 'name') as IReturn;
  }

  public get current_provider_settings() {
    if (!this.isAnyConnected) return void 0;
    const cachedProvider = this.safeAppWeb3Modal.cachedProvider as WalletProviderKeys | void;

    const provider = Object.values(this.supported_providers)
      .find((_) => _.id === cachedProvider);

    return (provider && this.supported_providers[provider.name]) || void 0;
  }
}
