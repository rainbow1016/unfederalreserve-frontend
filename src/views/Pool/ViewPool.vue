<template>
  <UnLayoutDefault
    class="view-pool"
    with-grass
    with-whale
    is-content-835
    check-connect
    check-network
  >
    <h1
      class="view-pool__title"
      v-text="'Add Liquidity'"
    />

    <PoolDescription
      class="view-pool__description"
    />

    <div class="un-row view-pool__apy-row">
      <div class="un-col-auto">
        <PoolsAPYRangeSelect
          v-model="selectedDays"
          :options="daysOptions"
          :skeleton="isLoadingSkeletonPool"
          class="view-pool__apy-range-select"
          @update:model-value="onUpdateDays"
        />
      </div>
    </div>

    <PoolsAPYCardList
      :apy-pools="apyPools"
      :skeleton="isLoadingSkeletonPool"
      :days="selectedDays.value"
      class="view-pool__apy-list"
    />

    <div class="un-row">
      <div class="un-col-2 un-col-sm">
        <h2
          class="view-pool__title"
          v-text="'Your Active positions'"
        />
      </div>

      <div class="un-col-auto un-col-sm">
        <PoolsAddBtn
          class="view-pool__add-btn"
        />
      </div>
    </div>

    <PoolPositionOverview
      key="active"
      :skeleton="isLoadingSkeleton"
      :active="!!poolListActive.length"
      empty-text="No active position yet"
      :pool-list="poolListActive"
      :class="{ 'no-margin': poolListPending.length }"
      class="view-pool__position-overview"
    />

    <PoolPositionOverview
      v-if="poolListPending.length"
      key="pending"
      active
      pending
      :pool-list="poolListPending"
      class="view-pool__position-overview"
    />

    <h2
      v-if="poolListClosed.length"
      class="view-pool__title"
      v-text="'Closed positions'"
    />

    <PoolPositionOverview
      v-if="poolListClosed.length"
      key="closed"
      :pool-list="poolListClosed"
      class="view-pool__position-overview"
    />
  </UnLayoutDefault>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-empty-function */

// eslint-disable-next-line object-curly-newline
import { defineComponent, computed, ref, onBeforeUnmount } from 'vue';
import { useCore, useGlobalLoader, usePoolsAPY } from '@/store';
import { getPoolOverviewData } from './utils';

import UnLayoutDefault from '@/components/layouts/UnLayoutDefault.vue';
import PoolDescription from './components/PoolDescription.vue';
import PoolsAPYCardList from './components/PoolsAPYCardList.vue';
import PoolsAddBtn from './components/PoolsAddBtn.vue';
import PoolPositionOverview from './components/PoolPositionOverview.vue';
import PoolsAPYRangeSelect from './components/PoolsAPYRangeSelect.vue';


const UPDATE_DATA_TIMEOUT = 60_000;

const DAYS_OPTION_MAP = {
  7: {
    text: 'Last 7 Days',
    value: 7,
  },
  30: {
    text: 'Last 30 Days',
    value: 30,
  },
  365: {
    text: 'Last Year',
    value: 365,
  },
} as const;

const useUpdateData = () => {
  const { appEnv: env, account: accountRef } = useCore();

  let timerId: ReturnType<typeof setTimeout> | null;
  const isLoading = ref(false);

  const updateData = async () => {
    const { value: account } = accountRef;
    if (timerId) clearTimeout(timerId);
    if (timerId === null) return; // STOP ON UNMOUNTED
    if (!env.value) return;
    if (!account) return;

    const promises = [
      account.updateAllPositions().catch(() => {}),
    ] as const;

    isLoading.value = true;
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
  name: 'ViewPool',
  components: {
    UnLayoutDefault,
    PoolDescription,
    PoolsAPYCardList,
    PoolsAddBtn,
    PoolPositionOverview,
    PoolsAPYRangeSelect,
  },
  setup() {
    const { account, isLoadingConnect, wallet } = useCore();
    const { isLoading, updateData } = useUpdateData();
    const isLoadingStart = ref(!account.value?.positions.length);
    const globalLoader = useGlobalLoader();
    const daysOptions = Object.values(DAYS_OPTION_MAP);

    const {
      data: apyPools,
      fetchData: fetchPoolsAPY,
      isLoading: isLoadingPoolsAPY,
    } = usePoolsAPY();

    const days = apyPools.value?.[0]?.days || 30;
    const selectedDays = ref(DAYS_OPTION_MAP[days]);

    const isLoadingSkeleton = computed(() => (
      isLoadingStart.value || isLoadingConnect.value
    ));

    const isLoadingSkeletonPool = computed(() => (
      isLoadingPoolsAPY.value || !apyPools.value?.length
    ));

    const poolListActive = computed(() => {
      if (isLoadingSkeleton.value) {
        return Array.from({ length: 3 })
          .map(() => getPoolOverviewData());
      }

      return account.value?.positions
        .filter((_) => !_.isClosed)
        .map(getPoolOverviewData) || [];
    });

    const poolListClosed = computed(() => (
      account.value?.positions
        .filter((_) => _.isClosed)
        .map(getPoolOverviewData) || []
    ));

    const poolListPending = computed(() => (
      wallet.value.txPendingHistory
        .map((_) => _.position)
        .filter(Boolean)
    ));

    globalLoader.hide();

    void (async () => {
      await updateData();
      isLoadingStart.value = false;
    })();

    const onUpdateDays = () => {
      void fetchPoolsAPY(selectedDays.value.value);
    };

    if (!apyPools.value?.length) {
      void onUpdateDays();
    }

    return {
      isLoadingSkeleton,
      isLoadingSkeletonPool,
      isLoading,

      poolListActive,
      poolListPending,
      poolListClosed,

      account,
      apyPools,

      daysOptions,
      selectedDays,
      onUpdateDays,
    };
  },
});
</script>

<style lang="scss">
.view-pool {
  color: $un-color-white;
  letter-spacing: 0.01em;
  word-spacing: 0;

  &__title {
    margin-bottom: 19px;
    font-size: 20px;
    font-weight: 600;
  }

  &__add-btn {
    @include media-gt(tablet) {
      width: 163px;
    }

    @include media-lt(tablet) {
      width: calc(100% - 30px);
    }
  }

  &__description {
    max-width: 561px;
    margin-bottom: 27px;
  }

  &__apy-list,
  &__position-overview {
    margin-bottom: 34px;

    &.no-margin {
      margin-bottom: 0;
    }
  }

  &__apy-range-select {
    width: 145px;
  }

  &__apy-row {
    justify-content: end;
  }
}
</style>
