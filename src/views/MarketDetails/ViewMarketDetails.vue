<template>
  <UnLayoutDefault
    with-home-grass
    check-network
    class="view-market-details"
  >
    <template #breadcrumbs>
      <div class="view-market-details__breadcrumbs">
        <router-link
          :to="routeMarkets"
          class="view-market-details__breadcrumbs-link"
          v-text="'Markets'"
        /> {{ symbol_f }}
      </div>
    </template>

    <div class="un-row">
      <div class="un-col-1">
        <MarketDetailsCardInfo
          :all_markets="all_markets"
          :skeleton="isLoadingSkeleton"
          :market_data="market_data"
          :market_account="market_account"
        />
      </div>

      <div class="un-col-1 un-col-desc-2">
        <MarketDetailsCardTransaction
          :key="symbol"
          :market="market_account"
          :market_data="market_data"
          :loading="isLoading"
          :skeleton="isLoadingSkeleton"
        />
      </div>

      <div class="un-col-1 un-col-desc-2">
        <MarketDetailsCardDetails
          :all_markets="all_markets"
          :market_data="market_data"
          :market_account="market_account"
          :loading="isLoading"
          :skeleton="isLoadingSkeleton"
        />
      </div>
    </div>
  </UnLayoutDefault>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  watch,
  onBeforeUnmount,
  Ref,
} from 'vue';
import {
  useFetchMarkets,
  useCore,
  useGlobalLoader,
} from '@/store';
import { Market } from '@/types/common.d';
import { ROUTE_MARKETS } from '@/helpers/enums/routes';
import { formatSymbol } from '@/helpers/formatters/legacy';

import UnLayoutDefault from '@/components/layouts/UnLayoutDefault.vue';
import MarketDetailsCardInfo from './components/MarketDetailsCardInfo.vue';
import MarketDetailsCardTransaction from './components/MarketDetailsCardTransaction.vue';
import MarketDetailsCardDetails from './components/MarketDetailsCardDetails.vue';


const UPDATE_DATA_TIMEOUT = 60_000;

const useUpdateData = (market_account: Ref<Market | void>) => {
  const { appEnv: env, isLoadingConnect } = useCore();
  const { fetchList: fetchAllMarkets } = useFetchMarkets();

  let timerId: ReturnType<typeof setTimeout> | null;
  const isLoading = ref(false);

  const updateData = async () => {
    if (timerId) clearTimeout(timerId);
    if (timerId === null) return; // STOP ON UNMOUNTED
    if (!env.value) return;

    const waitLoadingConnectPromise = new Promise((resolve) => {
      if (!isLoadingConnect.value) {
        resolve(true);
      } else {
        const unwatch = watch(isLoadingConnect, () => {
          unwatch();
          resolve(true);
        });
      }
    });

    const promises = [
      waitLoadingConnectPromise,
      fetchAllMarkets(env.value),
      market_account.value?.update(),
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
  name: 'ViewMarketDetails',
  components: {
    UnLayoutDefault,
    MarketDetailsCardInfo,
    MarketDetailsCardTransaction,
    MarketDetailsCardDetails,
  },
  props: {
    symbol: {
      type: String,
      required: true,
    },
  },
  setup: (props) => {
    const { isLoadingConnect } = useCore();
    const globalLoader = useGlobalLoader();
    const { account } = useCore();

    const routeMarkets = { name: ROUTE_MARKETS };
    const { list: all_markets } = useFetchMarkets();
    const isLoadingStart = ref(!all_markets.value.length);

    const symbol_f = computed(() => (
      formatSymbol(props.symbol)
    ));

    const market_account = computed(() => (
      account.value?.markets.find((_) => _.symbol === props.symbol)
    ));

    const { isLoading, updateData } = useUpdateData(market_account);

    const isLoadingSkeleton = computed(() => (
      isLoadingStart.value || isLoadingConnect.value
    ));

    const market_data = computed(() => {
      if (isLoadingSkeleton.value) {
        return void 0; // { symbol: props.symbol };
      }

      return all_markets.value?.find((_) => (
        _.underlyingSymbol.includes(props.symbol)
      ));
    });

    globalLoader.hide();

    watch(() => props.symbol, async () => {
      await updateData();
      isLoadingStart.value = false;
    }, { immediate: true });

    return {
      isLoading,
      isLoadingSkeleton,
      routeMarkets,
      symbol_f,

      all_markets,
      market_data,
      market_account,
    };
  },
});
</script>

<style lang="scss">
.view-market-details {
  &__breadcrumbs {
    position: relative;
    display: flex;
    font-size: 12px;
    font-weight: 600;
    line-height: 26px;
    color: #6d88da;

    @include media-lt(tablet) {
      font-size: 15px;
    }

    &-link {
      position: relative;
      padding-right: 20px;
      margin-right: 8px;
      color: $un-color-white;
      text-decoration: none;

      &::after {
        position: absolute;
        right: 0;
        font-size: 20px;
        font-weight: 600;
        line-height: 26px;
        color: #6d88da;
        content: ">";
      }
    }
  }

  .un-col-1.un-col-desc-2 {
    z-index: 0;
  }
}
</style>
