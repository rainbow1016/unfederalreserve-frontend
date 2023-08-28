<template>
  <UnCard
    title="Market details"
    :loading="loading"
    light
    header-lined
    no-padding
    class="market-details-card-details"
  >
    <template #header-right>
      <UnTabs
        v-model="currentTab"
        :options="tabOptions"
        lined
        light
        class="market-details-card-details__tabs"
      />
    </template>

    <div class="market-details-card-details__balances">
      <MarketDetailsBalance
        v-for="(item, index) in balanceOptions"
        :key="index"
        :skeleton="skeleton"
        v-bind="item"
        class="market-details-card-details__balance"
      />
    </div>

    <MarketDetailsChart
      class="market-details-card-details__chart"
      data-testid="chart"
      :data="chartOptions"
      :labels="chartLabels"
    />

    <MarketDetailsList
      class="market-details-card-details__list"
      :data="detailsList"
      :skeleton="skeleton"
    />
  </UnCard>
</template>

<script lang="ts">
// eslint-disable-next-line object-curly-newline
import { PropType, defineComponent, ref, computed } from 'vue';
import { IAllMarket } from '@/types/api/allMarkets';
import { TRANSACTION_TAB_OPTIONS, TransactionTypes } from '@/classes/transaction';
import { getBalanceOptions, getDetailsList } from '../utils';

import UnCard from '@/components/ui/UnCard.vue';
import UnTabs from '@/components/ui/UnTabs.vue';
import MarketDetailsBalance from './MarketDetailsBalance.vue';
import MarketDetailsChart from './MarketDetailsChart.vue';
import MarketDetailsList from './MarketDetailsList.vue';


const CHART_LABELS_MAP = {
  [TransactionTypes.supply]: {
    total: 'Total Supply',
    apy: 'Supply APY',
  },
  [TransactionTypes.borrow]: {
    total: 'Total Borrow',
    apy: 'Borrow APY',
  },
} as const;


export default defineComponent({
  name: 'MarketDetailsCardDetails',
  components: {
    UnCard,
    UnTabs,
    MarketDetailsBalance,
    MarketDetailsChart,
    MarketDetailsList,
  },
  props: {
    all_markets: {
      type: Array as PropType<IAllMarket[]>,
      required: true,
    },
    market_data: {
      type: Object as PropType<IAllMarket>,
    },
    loading: Boolean,
    skeleton: Boolean,
  },
  setup: (props) => {
    const tabOptions = [
      TRANSACTION_TAB_OPTIONS[TransactionTypes.supply],
      TRANSACTION_TAB_OPTIONS[TransactionTypes.borrow],
    ];

    const currentTab = ref(tabOptions[0]);

    const balanceOptions = computed(() => {
      const { market_data } = props;
      const isSupply = currentTab.value.value === TransactionTypes.supply;
      return getBalanceOptions(market_data, isSupply);
    });

    const chartOptions = computed(() => {
      const propName = currentTab.value.value === TransactionTypes.supply
        ? 'supplyDaily' : 'borrowDaily';

      return props.market_data?.[propName].slice().reverse();
    });

    const chartLabels = computed(() => {
      const type = currentTab.value.value as keyof typeof CHART_LABELS_MAP;
      return CHART_LABELS_MAP[type];
    });

    const detailsList = computed(() => (
      getDetailsList(props.market_data)
    ));

    return {
      tabOptions,
      currentTab,
      balanceOptions,
      chartOptions,
      chartLabels,
      detailsList,
    };
  },
});
</script>

<style lang="scss">
.market-details-card-details {
  &__tabs {
    position: relative;
    right: -25px;
    width: 100%;
    height: 42px;
  }

  &__balances {
    display: flex;
    justify-content: space-between;
  }

  &__list,
  &__balances {
    padding: 22px 33px 7px 27px;

    @include media-lt(tablet-xs) {
      padding: 14px 12px 1px 12px;
    }
  }
}
</style>
