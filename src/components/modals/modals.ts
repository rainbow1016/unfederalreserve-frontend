import { defineAsyncComponent } from 'vue';

// eslint-disable-next-line object-curly-newline
import { Wallet, Account, Market, Position, PoolToken } from '@/types/common.d';
import { useGetLegal } from '@/store';
import { storage } from '@/services';
import { POOL_SUPPORTED_FEES } from '@/helpers/enums/pools';
import { useModal } from './useModal';

import { TransactionTypes } from '@/classes/transaction/utils-common';


export {
  useModal,
};


export const useModalTransaction = (tabs: TransactionTypes[]) => {
  const AsyncComponent = defineAsyncComponent(() => import(
    /* webpackChunkName: "vUnModalTransaction" */
    './UnModalTransaction.vue'
  ));

  type IPropsData = { market: Market };
  return useModal<IPropsData>(AsyncComponent, {
  }, { tabs });
};

export const useModalSupply = () => {
  const tabs = [
    TransactionTypes.supply,
    TransactionTypes.withdraw,
  ];

  return useModalTransaction(tabs);
};

export const useModalBorrow = () => {
  const tabs = [
    TransactionTypes.borrow,
    TransactionTypes.repay,
  ];

  return useModalTransaction(tabs);
};

export const useModalHelp = () => {
  const AsyncComponent = defineAsyncComponent(() => import(
    './UnModalHelp.vue'
  ));

  return useModal(AsyncComponent);
};

export const useModalNoSupply = () => {
  const AsyncComponent = defineAsyncComponent(() => import(
    './UnModalNoSupply.vue'
  ));

  return useModal(AsyncComponent);
};

export const useModalNoCollateral = () => {
  const AsyncComponent = defineAsyncComponent(() => import(
    './UnModalNoCollateral.vue'
  ));

  return useModal(AsyncComponent);
};

export const useModalCollateral = () => {
  const AsyncComponent = defineAsyncComponent(() => import(
    './UnModalCollateral.vue'
  ));

  type IPropsData = { market: Market };
  return useModal<IPropsData>(AsyncComponent);
};

export const useDisconnectModal = () => {
  const AsyncComponent = defineAsyncComponent(() => import(
    './UnModalDisconnectWallet.vue'
  ));

  type IPropsData = { wallet: Wallet };
  return useModal<IPropsData>(AsyncComponent);
};

export const useAccountModal = () => {
  const AsyncComponent = defineAsyncComponent(() => import(
    './UnModalAccountWallet.vue'
  ));

  type IPropsData = { wallet: Wallet };
  return useModal<IPropsData>(AsyncComponent);
};

export const useModalClaim = () => {
  const AsyncComponent = defineAsyncComponent(() => import(
    './UnModalClaim.vue'
  ));

  type IPropsData = { account: Account; wallet: Wallet };
  return useModal<IPropsData>(AsyncComponent);
};

export const useModalAddPool = () => {
  const AsyncComponent = defineAsyncComponent(() => import(
    './UnModalAddPool.vue'
  ));

  type IPropsData = {
    position?: Position;
    tokenA: PoolToken;
    tokenB: PoolToken;
    leftRange: string;
    rightRange: string;
    tokenPrice: string;
    priceRisesPercent: string;
    fee: typeof POOL_SUPPORTED_FEES[number];
  };
  return useModal<IPropsData>(AsyncComponent);
};

export const useModalTerms = () => {
  const AsyncComponent = defineAsyncComponent(() => import(
    './UnModalTerms.vue'
  ));

  const modalTerms = useModal(AsyncComponent, {
    noBackdropDismiss: true,
    noEscDismiss: true,
    noRouteDismiss: true,
  });

  const { fetchData: fetchGetLegal } = useGetLegal();

  const show = async (options: { ethAccount: string }) => {
    // disabled modal for automation testing
    if (storage.testid_terms_for_use.get()) return true;

    const response = await fetchGetLegal(options.ethAccount)
      .catch(() => ({ message: 'not_ok' }));

    const message = 'message' in response ? response.message : 'not_ok';
    if (message === 'ok') return true;

    const legals = Array.isArray(response) ? response : [];
    return modalTerms.show({ ...options, legals });
  };

  const hide = () => modalTerms.hide();

  return {
    show,
    hide,
  };
};
