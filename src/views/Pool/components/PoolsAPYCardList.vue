<template>
  <div class="un-row">
    <template v-for="(item, index) in pools " :key="index">
      <div class="un-col-3 un-col-sm">
        <PoolsAPYCard
          v-bind="item"
          :skeleton="skeleton"
          :days="days"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import PoolsAPYCard from './PoolsAPYCard.vue';


const SKELETON_POOLS = [
  {
    token0: { symbol: 'eRSDL' },
    token1: { symbol: 'ETH' },
    apy: 0,
  },
  {
    token0: { symbol: 'eRSDL' },
    token1: { symbol: 'USDT' },
    apy: 0,
  },
  {
    token0: { symbol: 'eRSDL' },
    token1: { symbol: 'USDC' },
    apy: 0,
  },
];

export default defineComponent({
  name: 'PoolsAPYCardList',
  components: {
    PoolsAPYCard,
  },
  props: {
    skeleton: Boolean,
    apyPools: {
      type: Array,
    },
    days: {
      type: Number,
    },
  },
  setup: (props) => {
    const pools = computed(() => (
      props.skeleton ? SKELETON_POOLS : props.apyPools
    ));

    return {
      pools,
    };
  },
});
</script>

<style lang="scss">
.pools-apy-card {
  &__apy {
    font-size: 14px;
  }

  &__percent {
    font-size: 25px;
    font-weight: 600;
  }
}
</style>
