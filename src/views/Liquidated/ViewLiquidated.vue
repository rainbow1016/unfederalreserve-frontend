<template>
  <UnLayoutDefault
    title="Liquidations"
    with-home-grass
    with-scroll-up
    check-network
    class="view-liquidated"
  >
    <LiquidatedTableCard
      v-if="env"
      :tab="tab"
      :skeleton="isLoadingSkeleton"
      :loading="!isLoadingSkeleton && isLoading"
      :all_markets="all_markets"
      :account_liquidites="account_liquidites"
      :liquidation_events="liquidation_events"
      :env="env"
    />
  </UnLayoutDefault>
</template>

<script lang="ts">
import {
  PropType,
  defineComponent,
  computed,
  ref,
  onBeforeUnmount,
} from 'vue';
import {
  useCore,
  useFetchMarkets,
  useGlobalLoader,
  useAccountLiquidity,
  useLiquidationEvents,
} from '@/store';
import {
  LiquidatedTabs,
} from './utils';


import UnLayoutDefault from '@/components/layouts/UnLayoutDefault.vue';
import LiquidatedTableCard from './components/LiquidatedTableCard.vue';


const UPDATE_DATA_TIMEOUT = 60_000;

const useUpdateData = () => {
  const { fetchList: fetchMarkets, list: all_markets } = useFetchMarkets();
  const { fetchList: fetchAccountLiquidites } = useAccountLiquidity();
  const { fetchList: fetchLiquidationEvents } = useLiquidationEvents();
  const { appEnv: env } = useCore();

  let timerId: ReturnType<typeof setTimeout> | null;
  const isLoading = ref(false);

  const updateData = async () => {
    if (timerId) clearTimeout(timerId);
    if (timerId === null) return; // STOP ON UNMOUNTED
    if (!env.value) return;

    const promises = [
      all_markets.value.length ? all_markets.value : fetchMarkets(env.value),
      fetchAccountLiquidites(env.value),
      fetchLiquidationEvents(env.value),
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
  name: 'ViewLiquidated',
  components: {
    UnLayoutDefault,
    LiquidatedTableCard,
  },
  props: {
    tab: {
      type: String as PropType<LiquidatedTabs>,
      required: true,
    },
  },
  setup: () => {
    const { isLoadingConnect, appEnv } = useCore();
    const { isLoading, updateData } = useUpdateData();
    const globalLoader = useGlobalLoader();

    const { list: all_markets } = useFetchMarkets();
    const { list: account_liquidites } = useAccountLiquidity();
    const { list: liquidation_events } = useLiquidationEvents();

    const isLoadingStart = ref(
      !all_markets.value.length
      || !account_liquidites.value.length
      || !liquidation_events.value.length,
    );

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
      account_liquidites,
      liquidation_events,

      env: appEnv,
    };
  },
});
</script>

<style lang="scss">
.view-liquidated {
  width: 100%;
}
</style>
