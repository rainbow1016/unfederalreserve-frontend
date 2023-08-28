<template>
  <UnLayoutDefault
    with-home-grass
    check-connect
    check-network
    class="view-home"
  >
    <UnBalanceCard
      v-if="isDesktop"
      :loading="isLoadingConnect"
      :supply="account?.total_supply"
      :borrow="account?.total_borrow"
      :borrow-limit="account?.borrow_limit"
      :apy="account?.net_apy"
    />

    <HomeMarketsLayoutDesktop
      v-if="isDesktop"
      :account="account"
      :loading="isLoading"
      :skeleton="isLoadingConnect"
      class="view-home__markets-desktop"

      @click-row="onClickRow"
      @click-collateral="onClickCollateral"
    />

    <HomeMarketsLayoutMobile
      v-else
      :account="account"
      :loading="isLoading"
      :skeleton="isLoadingConnect"
      class="view-home__markets-mobile"

      @click-row="onClickRow"
      @click-collateral="onClickCollateral"
    >
      <template #balance="{ balance }">
        <UnBalanceCardMobile
          v-bind="balance"
          :skeleton="isLoadingConnect"
          class="home-markets-layout-mobile__balance-card"
        />
      </template>
    </HomeMarketsLayoutMobile>
  </UnLayoutDefault>
</template>

<script lang="ts">
import {
  Ref,
  defineComponent,
  ref,
  onBeforeUnmount,
} from 'vue';
import { useCore, useGlobalLoader } from '@/store';
import { Account, Market } from '@/types/common.d';
import {
  useModalSupply,
  useModalBorrow,
  useModalCollateral,
  useModalNoSupply,
  useModalNoCollateral,
} from '@/components/modals/modals';
import { useBreakpoints } from '@/composable';
import { HomeTableTypes } from './utils';


import UnLayoutDefault from '@/components/layouts/UnLayoutDefault.vue';
import HomeMarketsLayoutDesktop from './components/HomeMarketsLayoutDesktop.vue';
import HomeMarketsLayoutMobile from './components/HomeMarketsLayoutMobile.vue';
import UnBalanceCard from '@/components/common/UnBalanceCard.vue';
import UnBalanceCardMobile from '@/components/common/UnBalanceCardMobile.vue';


const FETCH_DATA_TIMEOUT = 20_000;


const useUpdateData = (accountRef: Ref<Account | null>) => {
  const { appEnv: env } = useCore();

  let timerId: ReturnType<typeof setTimeout> | null;
  const isLoading = ref(false);

  const updateData = async () => {
    if (timerId) clearTimeout(timerId);
    if (timerId === null) return; // STOP ON UNMOUNTED
    if (!env.value) return;

    const promises = [
      accountRef.value?.updateAllMarkets(),
    ] as const;

    isLoading.value = true;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    await Promise.all(promises).catch(() => {});
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    timerId = setTimeout(updateData, FETCH_DATA_TIMEOUT);
    isLoading.value = false;
  };

  onBeforeUnmount(() => {
    if (timerId) clearTimeout(timerId);
    timerId = null;
  });

  return {
    isLoading,
    updateData,
  };
};

const useClickRow = (accountRef: Ref<Account | null>) => {
  const modalSupply = useModalSupply();
  const modalBorrow = useModalBorrow();
  const modalNoSupply = useModalNoSupply();
  const modalNoCollateral = useModalNoCollateral();

  const onClickRow = (market: Market, type: HomeTableTypes) => {
    const account = accountRef.value;
    if (!account) return null;

    const { isEnteredTheMarket, total_supply } = account;
    const propsData = { market };

    switch (type) {
      case HomeTableTypes.supply_all:
      case HomeTableTypes.supply_user:
        return modalSupply.show(propsData);

      case HomeTableTypes.borrow_user:
        return modalBorrow.show(propsData);

      case HomeTableTypes.borrow_all: {
        if (total_supply && isEnteredTheMarket) {
          return modalBorrow.show(propsData);
        }

        if (!total_supply && !isEnteredTheMarket) {
          return modalNoSupply.show(propsData);
        }

        if (total_supply && !isEnteredTheMarket) {
          return modalNoCollateral.show(propsData);
        }

        return null;
      }

      default:
        // eslint-disable-next-line no-console
        console.warn(`[App warn]: nothing handle with type "${type as string}"`);
        return null;
    }
  };

  return onClickRow;
};

export default defineComponent({
  name: 'ViewHome',
  components: {
    UnLayoutDefault,
    HomeMarketsLayoutDesktop,
    HomeMarketsLayoutMobile,
    UnBalanceCard,
    UnBalanceCardMobile,
  },
  setup() {
    const {
      isLoadingConnect,
      account,
    } = useCore();

    const globalLoader = useGlobalLoader();

    const { isDesktop } = useBreakpoints();
    const onClickRow = useClickRow(account);
    const { isLoading, updateData } = useUpdateData(account);
    const modalCollateral = useModalCollateral();

    void updateData();
    globalLoader.hide();

    const onClickCollateral = (market: Market) => {
      void modalCollateral.show({ market });
    };

    return {
      isLoading,
      isLoadingConnect,
      isDesktop,
      account,
      onClickRow,
      onClickCollateral,
    };
  },
});
</script>
