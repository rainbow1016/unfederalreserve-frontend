<template>
  <UnCard
    title="All markets"
    tooltip-text="Note: APY rates refreshed every 24 hours"
    tooltip-width="250px"
    no-padding
    class="markets-all-table-card"
  >
    <MarketsAllTable
      v-if="!isTablet"
      :markets="marketsData"
      :loading="loading"
      :skeleton="skeleton"
      class="markets-all-table-card__table"
    />

    <MarketsMobileTable
      v-if="isTablet"
      :markets="marketsData"
      :loading="loading"
      :skeleton="skeleton"
    />
  </UnCard>
</template>

<script lang="ts">
import { PropType, computed, defineComponent } from 'vue';
import { IAllMarket } from '@/types/api/allMarkets';
import { useBreakpoints } from '@/composable';
import { createAllMarketsData } from '../utils';

import UnCard from '@/components/ui/UnCard.vue';
import MarketsAllTable from './MarketsAllTable.vue';
import MarketsMobileTable from './MarketsMobileTable.vue';


export default defineComponent({
  name: 'MarketsAllTableCard',
  components: {
    UnCard,
    MarketsAllTable,
    MarketsMobileTable,
  },
  props: {
    all_markets: {
      type: Array as PropType<IAllMarket[]>,
      required: true,
    },
    skeleton: Boolean,
    loading: Boolean,
  },
  setup: (props) => {
    const { isTablet } = useBreakpoints();

    const allMarketsData = computed(() => {
      if (props.skeleton) {
        return Array.from({ length: 8 })
          .map(() => createAllMarketsData());
      }

      return props.all_markets.map(createAllMarketsData);
    });

    const marketsData = computed(() => (
      allMarketsData.value.filter((_) => _.isListed)
    ));

    return {
      isTablet,
      marketsData,
    };
  },
});
</script>


<style lang="scss">
.markets-all-table-card {
  &__table {
    margin-top: 35px;
  }
}
</style>
