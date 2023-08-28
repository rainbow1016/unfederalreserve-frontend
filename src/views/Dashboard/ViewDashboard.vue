<template>
  <UnLayoutDefault
    class="view-dashboard"
    with-grass
    with-mountain
    with-small-fishes
    check-connect
    check-network
  >
    <DashboardHeader
      :network-color="networkColor"
      :network-name="networkName"
      :skeleton="isLoadingSkeleton"
      :loading="isLoading"
      :total-balance-usd="totalBalanceUsd"
      class="view-dashboard__header"
    />

    <div
      v-if="lpBalance"
      class="view-dashboard__old-staking"
    >
      <DashboardOldStaking
        :skeleton="isLoadingSkeleton"
        :balance="lpBalance"
      />
    </div>

    <div class="un-row">
      <div class="view-dashboard__content un-col-1">
        <div class="view-dashboard__left-container">
          <DashboardErsdlBalance
            v-if="!isDesktop"
            :skeleton="isLoadingSkeleton"
            :loading="isLoading"
            :balance="ersdlBalance"
            :balance-usd="ersdlBalanceUsd"
            :wallet-balance="walletBalance"
            :unclaimed-balance="unclaimedBalance"
            class="view-dashboard__content-element"
          />

          <DashboardLendingPosition
            :skeleton="isLoadingSkeleton"
            :loading="isLoading"
            :account="account"
            class="view-dashboard__content-element"
          />

          <DashboardPools
            :skeleton="isLoadingSkeleton"
            :total-liquidity="poolsTotalLiquidityUsd"
            :total-unclaimed-fees="poolsTotalUnclaimedFeesUsd"
            class="view-dashboard__content-element"
          />

          <DashboardReserveFunding
            class="view-dashboard__content-element"
          />

          <DashboardFarm
            class="view-dashboard__content-element"
          />
        </div>
        <div class="view-dashboard__right-container">
          <DashboardErsdlBalance
            v-if="isDesktop"
            :skeleton="isLoadingSkeleton"
            :loading="isLoading"
            :balance="ersdlBalance"
            :balance-usd="ersdlBalanceUsd"
            :wallet-balance="walletBalance"
            :unclaimed-balance="unclaimedBalance"
            class="view-dashboard__content-element"
          />

          <DashboardSnapshot
            :proposals="snapshotData?.proposals"
            :skeleton="isLoadingSkeleton"
            :loading="isLoading"
            class="view-dashboard__content-element"
          />
        </div>
      </div>
    </div>
  </UnLayoutDefault>
</template>

<script lang="ts">
import {
  Ref,
  computed,
  defineComponent,
  defineAsyncComponent,
  ref,
  onBeforeUnmount,
} from 'vue';
import { Account } from '@/types/common.d';
import { useCore, useGlobalLoader, useSnapshot } from '@/store';
import { NETWORK_NAME_MAP as NETWORKS_MAP } from '@/helpers/enums/params';
import { useBreakpoints } from '@/composable';

import UnLayoutDefault from '@/components/layouts/UnLayoutDefault.vue';
import DashboardHeader from './components/DashboardHeader.vue';
import DashboardFarm from './components/DashboardFarm.vue';
import DashboardPools from './components/DashboardPools.vue';
import DashboardErsdlBalance from './components/DashboardErsdlBalance.vue';
import DashboardReserveFunding from './components/DashboardReserveFunding.vue';
import DashboardLendingPosition from './components/DashboardLendingPosition.vue';
import DashboardSnapshot from './components/DashboardSnapshot.vue';


const DashboardOldStaking = defineAsyncComponent(() => import(
  './components/DashboardOldStaking.vue'
));


const UPDATE_DATA_TIMEOUT = 60_000;
const DEFAULT_NETWORK_COLOR = '#a9ffe6';

const useUpdateData = (accountRef: Ref<Account | null>) => {
  const { appEnv: env } = useCore();

  let timerId: ReturnType<typeof setTimeout> | null;
  const isLoading = ref(false);

  const updateData = async () => {
    const { value: account } = accountRef;
    if (timerId) clearTimeout(timerId);
    if (timerId === null) return; // STOP ON UNMOUNTED
    if (!env.value) return;
    if (!account) return;

    const promises = [
      account.updateAllMarkets(),
      account.updateAllPositions(),
    ] as const;

    isLoading.value = true;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    await Promise.all(promises).catch(() => {});
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    timerId = setTimeout(updateData, UPDATE_DATA_TIMEOUT);
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


export default defineComponent({
  name: 'ViewDashboard',
  components: {
    UnLayoutDefault,
    DashboardHeader,
    DashboardFarm,
    DashboardPools,
    DashboardErsdlBalance,
    DashboardReserveFunding,
    DashboardOldStaking,
    DashboardLendingPosition,
    DashboardSnapshot,
  },
  setup() {
    // eslint-disable-next-line object-curly-newline
    const { account, appChainId, appEnv, isLoadingConnect } = useCore();
    const { updateData, isLoading } = useUpdateData(account);
    const isLoadingStart = ref(true);
    const { isDesktop } = useBreakpoints();
    const globalLoader = useGlobalLoader();
    const { fetchData: fetchSnapshot, data: snapshotData } = useSnapshot();

    const lpBalance = computed(() => +(account.value?.lpBalance || 0));

    const ersdlBalance = computed(() => +(account?.value?.balance || 0));

    const ersdlPriceUsd = computed(() => (
      account?.value?.eRSDL?.price_usd ?? 0
    ));

    const ersdlBalanceUsd = computed(() => {
      if (!account.value) return 0;
      return ersdlBalance.value * ersdlPriceUsd.value;
    });

    const lendTotalSupply = computed(() => (
      account?.value?.total_supply || 0
    ));

    const networkColor = computed(() => (
      appEnv.value?.NETWORK_COLOR || DEFAULT_NETWORK_COLOR
    ));

    const networkName = computed(() => (
      NETWORKS_MAP[appChainId.value as keyof typeof NETWORKS_MAP] || NETWORKS_MAP.DEFAULT
    ));

    const poolsLiquidityUsd = computed(() => (
      account.value?.positions.reduce((acc, position) => {
        const { liquidityUsd } = position;
        return liquidityUsd === void 0 ? acc : acc + liquidityUsd;
      }, 0) || 0
    ));

    const poolsTotalLiquidityUsd = computed(() => (
      poolsLiquidityUsd.value
    ));

    const poolsUnclaimedFeesUsd = computed(() => (
      account.value?.positions.reduce((acc, position) => {
        const { unclaimedUsd } = position;
        return unclaimedUsd === void 0 ? acc : acc + unclaimedUsd;
      }, 0) || 0
    ));

    const poolsTotalUnclaimedFeesUsd = computed(() => (
      poolsUnclaimedFeesUsd.value
    ));

    const totalBalanceUsd = computed(() => (
      (lendTotalSupply.value + poolsLiquidityUsd.value) || 0
    ));

    const isLoadingSkeleton = computed(() => (
      isLoadingConnect.value
      || (isLoadingStart.value && !(
        poolsLiquidityUsd.value
          + poolsTotalLiquidityUsd.value
          + totalBalanceUsd.value
      ))
    ));

    const walletBalance = computed(() => +(account?.value?.eRSDL.balance || 0));

    const unclaimedBalance = computed(() => +(account?.value?.unclaimed_rewards || 0));

    globalLoader.hide();

    void (async () => {
      void fetchSnapshot();
      await updateData();
      isLoadingStart.value = false;
    })();

    return {
      isLoadingSkeleton,
      isLoading,
      isDesktop,

      account,
      lpBalance,

      ersdlBalance,
      ersdlBalanceUsd,
      walletBalance,
      unclaimedBalance,

      networkColor,
      networkName,

      lendTotalSupply,
      totalBalanceUsd,

      poolsTotalLiquidityUsd,
      poolsTotalUnclaimedFeesUsd,

      snapshotData,
    };
  },
});
</script>

<style lang="scss">
.view-dashboard {
  color: #fff;

  &__header {
    margin: 3px 0 15px;
  }

  &__content {
    @include media-gt(desktop) {
      display: flex;
      justify-content: space-between;
    }
  }

  &__left-container {
    width: 100%;

    @include media-gt(desktop) {
      width: calc(70% - 30px);
    }
  }

  &__right-container {
    width: 100%;

    @include media-gt(desktop) {
      width: 30%;
    }
  }

  &__content-element {
    margin-bottom: 16px;
  }

  &__old-staking {
    margin: 0 0 3px;
  }
}
</style>
