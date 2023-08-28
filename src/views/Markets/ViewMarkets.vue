<template>
  <UnLayoutDefault
    title="Market Overview"
    with-home-grass
    check-network
    class="view-markets"
  >
    <div class="un-row">
      <div class="un-col-2 un-col-md">
        <MarketsTotalCard
          title="Total Supply"
          tooltip-text="The total value of supplied coins"
          type="supply"
          :all_markets="all_markets"
          :skeleton="isLoadingSkeleton"
        />
      </div>

      <div class="un-col-2 un-col-md">
        <MarketsTotalCard
          title="Total Borrow"
          tooltip-text="The total value of borrowed coins"
          type="borrow"
          :all_markets="all_markets"
          :skeleton="isLoadingSkeleton"
        />
      </div>
    </div>

    <div class="un-row">
      <div class="un-col-3 un-col-lg-2 un-col-sm">
        <MarketsOverviewCard
          :all_markets="all_markets"
          :skeleton="isLoadingSkeleton"
          class="un-100h"
        />
      </div>

      <div class="un-col-3 un-col-lg-2 un-col-sm">
        <MarketsTvlTrendCard
          :all_markets="all_markets"
          :skeleton="isLoadingSkeleton"
          class="un-100h"
        />
      </div>

      <div class="un-col-3 un-col-lg">
        <MarketsTop3Card
          :all_markets="all_markets"
          :skeleton="isLoadingSkeleton"
          class="un-100h"
        />
      </div>
    </div>

    <div class="un-row">
      <div class="un-col-1">
        <MarketsAllTableCard
          :all_markets="all_markets"
          :loading="!isLoadingSkeleton && isLoading"
          :skeleton="isLoadingSkeleton"
        />
      </div>
    </div>
  </UnLayoutDefault>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  ref,
  onBeforeUnmount,
} from 'vue';
import {
  useFetchMarkets,
  useCore,
  useGlobalLoader,
} from '@/store';

import UnLayoutDefault from '@/components/layouts/UnLayoutDefault.vue';
import MarketsTotalCard from './components/MarketsTotalCard.vue';
import MarketsOverviewCard from './components/MarketsOverviewCard.vue';
import MarketsTvlTrendCard from './components/MarketsTvlTrendCard.vue';
import MarketsTop3Card from './components/MarketsTop3Card.vue';
import MarketsAllTableCard from './components/MarketsAllTableCard.vue';


const UPDATE_DATA_TIMEOUT = 60_000;

const useUpdateData = () => {
  const { appEnv: env } = useCore();
  const { fetchList: fetchAllMarkets } = useFetchMarkets();

  let timerId: ReturnType<typeof setTimeout> | null;
  const isLoading = ref(false);

  const updateData = async () => {
    if (timerId) clearTimeout(timerId);
    if (timerId === null) return; // STOP ON UNMOUNTED
    if (!env.value) return;

    const promises = [
      fetchAllMarkets(env.value),
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
  name: 'ViewMarkets',
  components: {
    UnLayoutDefault,
    MarketsTotalCard,
    MarketsOverviewCard,
    MarketsTvlTrendCard,
    MarketsTop3Card,
    MarketsAllTableCard,
  },
  setup: () => {
    const { isLoadingConnect } = useCore();
    const { isLoading, updateData } = useUpdateData();
    const globalLoader = useGlobalLoader();

    const { list: all_markets } = useFetchMarkets();
    const isLoadingStart = ref(!all_markets.value.length);

    const isLoadingSkeleton = computed(() => (
      isLoadingStart.value || isLoadingConnect.value
    ));

    globalLoader.hide();

    void (async () => {
      await updateData();
      isLoadingStart.value = false;
    })();

    return {
      isLoadingSkeleton,
      isLoading,
      all_markets,
    };
  },
});
</script>
