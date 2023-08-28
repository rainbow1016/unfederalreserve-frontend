import { defineAsyncComponent } from 'vue';

import { Account, Market, Wallet } from '@/types/common.d';
import { useModal } from './useModal';


export const useTransactionMessage = (
  modalPropsData: Parameters<typeof useModal>[1],
  defaultPopsData: Parameters<typeof useModal>[2],
  parent?: Parameters<typeof useModal>[3],
) => {
  const AsyncComponent = defineAsyncComponent(() => import(
    './UnModalTransactionMessage.vue'
  ));

  return useModal(
    AsyncComponent,
    modalPropsData,
    defaultPopsData,
    parent,
  );
};

export const useModalTransactionMessageConfirm = (
  parent?: Parameters<typeof useModal>[3],
) => {
  const modalPropsData = {
    noBackdropDismiss: true,
    noEscDismiss: true,
  };

  const defaultPopsData = {
    title: 'Confirm Transaction',
    loading: true,
    message: 'Please proceed with wallet actions',
  };

  return useTransactionMessage(
    modalPropsData,
    defaultPopsData,
    parent,
  );
};

export const useModalTransactionSubmitted = (
  parent?: Parameters<typeof useModal>[3],
) => {
  const AsyncComponent = defineAsyncComponent(() => import(
    './UnModalTransactionSubmitted.vue'
  ));

  const defaultPopsData = {
    title: 'Transaction Submitted',
  };

  type IPropsData = {
    market?: Market;
    account?: Account;
    txHash?: string;
    addToMetaMask?: boolean;
    timeout?: number;
  };

  return useModal<IPropsData>(
    AsyncComponent,
    void 0,
    defaultPopsData,
    parent,
  );
};

export const useModalConnectWallet = () => {
  const AsyncComponent = defineAsyncComponent(() => import(
    './UnModalConnectWallet.vue'
  ));

  type IPropsData = { wallet: Wallet };
  return useModal<IPropsData>(AsyncComponent);
};
