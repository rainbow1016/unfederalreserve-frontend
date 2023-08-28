<template>
  <UnCard no-padding>
    <template #header-right>
      <UnSearch
        v-model="search"
        class="liquidated-table-card__search"
      />
    </template>

    <UnTabs
      :model-value="currentTab"
      :options="tabOptions"
      dense
      link
      lined
      disabled-options-color
      class="liquidated-table-card__tabs"
    />

    <keep-alive>
      <LiquidatedTable
        :key="currentTab.value"
        :data="currentData"
        :headers="currentTab.headers"
        :all_markets="all_markets"
        :env="env"
        :type="currentTab.value"
        :loading="loading"
        :skeleton="skeleton"
        :search="search"
      />
    </keep-alive>
  </UnCard>
</template>

<script lang="ts">
// eslint-disable-next-line object-curly-newline
import { PropType, Ref, computed, defineComponent, ref } from 'vue';
import { IAccountLiquidity, ILiquidationEvent } from '@/types/api/liquidity';
import {
  LiquidatedTabs,
  AT_RISK_TABLE_HEADERS,
  LIQUIDATED_TABLE_HEADERS,
  parseAccountLiquidity,
  parseLiquidationEvent,
} from '../utils';

import UnCard from '@/components/ui/UnCard.vue';
import UnTabs from '@/components/ui/UnTabs.vue';
import UnSearch from '@/components/ui/UnSearch.vue';
import LiquidatedTable from './LiquidatedTable.vue';


const LIQUIDATED_TABS = {
  [LiquidatedTabs.at_risk]: {
    label: 'At risk',
    value: LiquidatedTabs.at_risk,
    headers: AT_RISK_TABLE_HEADERS,
    data: [] as unknown as Ref<unknown[]>,
  },
  [LiquidatedTabs.liquidated]: {
    label: 'Liquidated',
    value: LiquidatedTabs.liquidated,
    headers: LIQUIDATED_TABLE_HEADERS,
    data: [] as unknown as Ref<unknown[]>,
  },
};

export default defineComponent({
  name: 'LiquidatedTableCard',
  components: {
    UnCard,
    UnTabs,
    UnSearch,
    LiquidatedTable,
  },
  props: {
    skeleton: Boolean,
    loading: Boolean,
    tab: {
      type: String as PropType<LiquidatedTabs>,
      required: true,
    },
    all_markets: {
      type: Array,
      required: true,
    },
    env: {
      type: Object,
      required: true,
    },
    account_liquidites: {
      type: Array as PropType<IAccountLiquidity[]>,
      required: true,
    },
    liquidation_events: {
      type: Array as PropType<ILiquidationEvent[]>,
      required: true,
    },
  },
  setup: (props) => {
    const search = ref('');

    const currentTab = computed(() => (
      LIQUIDATED_TABS[props.tab]
    ));

    const account_liquidites = computed(() => {
      if (props.skeleton) {
        return Array.from({ length: 6 })
          .map(() => parseAccountLiquidity());
      }

      return props.account_liquidites.map(parseAccountLiquidity);
    });

    const liquidation_events = computed(() => {
      if (props.skeleton) {
        return Array.from({ length: 6 })
          .map(() => parseLiquidationEvent());
      }

      return props.liquidation_events.map(parseLiquidationEvent);
    });

    const currentData = computed(() => {
      let list: { address: string }[] = [];

      switch (props.tab) {
        case LiquidatedTabs.at_risk:
          list = account_liquidites.value;
          break;

        case LiquidatedTabs.liquidated:
          list = liquidation_events.value;
          break;

        default:
          list = [];
      }

      if (search.value) {
        const val = search.value.toLowerCase();
        list = list.filter((_) => _.address.toLowerCase().includes(val));
      }

      return list;
    });

    return {
      currentTab,
      currentData,
      tabOptions: Object.values(LIQUIDATED_TABS),
      search,
    };
  },
});
</script>

<style lang="scss">
.liquidated-table-card {
  &__tabs {
    padding: 0 30px;
    font-size: 17px;
    font-weight: 600;
    line-height: 25px;
    border-bottom: 2px solid $un-color-blue-3;
  }

  &__search {
    @include media-gt(tablet) {
      width: 268px;
      margin-left: auto;
    }

    @include media-lte(tablet) {
      width: 100%;
      margin-bottom: 20px;
    }
  }
}
</style>
