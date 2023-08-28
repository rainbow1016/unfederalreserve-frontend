// eslint-disable-next-line object-curly-newline
import { Ref, ref, computed, readonly, toRefs } from 'vue';

import { env as ENV, IEnv } from '@/global/env';
import { Wallet } from '@/classes/Wallet';


const DEFAULT_ENV = ENV[process.env.VUE_APP_DEFAULT_NETWORK];

const wallet = ref(Wallet.buildClass()) as Ref<Wallet>;

const appEnv = computed(() => {
  const { isAnyConnected, env } = wallet.value;
  if (isAnyConnected) return env;
  return DEFAULT_ENV as IEnv;
});

const appChainId = computed(() => {
  const { isAnyConnected, chainId } = wallet.value;
  if (isAnyConnected) return chainId;
  // eslint-disable-next-line no-underscore-dangle
  return DEFAULT_ENV._CHAIN_ID;
});

const {
  account,
  isAnyConnected,
  isLoadingConnect,
  isSupportedNetwork,
} = toRefs(wallet.value) as {
  account: Ref<Wallet['account']>;
  isAnyConnected: Ref<Wallet['isAnyConnected']>;
  isLoadingConnect: Ref<Wallet['isLoadingConnect']>;
  isSupportedNetwork: Ref<Wallet['isSupportedNetwork']>;
  chainId: Ref<Wallet['chainId']>;
};

export const initialize = async () => {
  await wallet.value.connect();
};

export const useCore = () => ({
  isSupportedNetwork: readonly(isSupportedNetwork),
  isAnyConnected: readonly(isAnyConnected),
  isLoadingConnect: readonly(isLoadingConnect),

  appEnv,
  appChainId: readonly(appChainId),

  // TODO: readonly
  wallet,
  account,
});
