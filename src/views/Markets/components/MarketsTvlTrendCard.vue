<template>
  <UnCard
    title="TVL Trend"
    tooltip-text="Total Value Locked (TVL) trend"
    no-padding
    class="markets-tvl-trend-card"
  >
    <MarketsTvlTrend
      :all_markets="all_markets"
      :skeleton="skeleton"
      type="supply"
    />
  </UnCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import UnCard from '@/components/ui/UnCard.vue';
import MarketsTvlTrend from './MarketsTvlTrend.vue';


export default defineComponent({
  name: 'MarketsTvlTrendCard',
  components: {
    UnCard,
    MarketsTvlTrend,
  },
  props: {
    skeleton: Boolean,
    all_markets: Array,
  },
});
</script>

<style lang="scss">
.markets-tvl-trend-card {
  &__item {
    margin-right: 16px;
  }

  &__title {
    &:not(.is-active) {
      opacity: 0.5;
    }
  }
}
</style>
