<template>
  <div class="pool-remove-liquidity-header">
    <UnToken
      :icons="[token0.icon, token1.icon]"
      :symbol="`${token0.symbol}/${token1.symbol}`"
      class="pool-remove-liquidity-header__token"
    />
    <UnBadge
      :in-range="inRange"
      :in-range-with-bg="inRange"
      :out-of-range="!inRange"
      :closed="isClosed"
      class="pool-remove-liquidity-header__badge"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import UnToken from '@/components/common/UnToken.vue';
import UnBadge from '@/components/ui/UnBadge.vue';

export default defineComponent({
  name: 'PoolRemoveLiquidityHeader',
  components: {
    UnToken,
    UnBadge,
  },
  props: {
    token0: {
      type: Object,
      required: true,
    },
    token1: {
      type: Object,
      required: true,
    },
    inRange: Boolean,
    isClosed: Boolean,
  },
});
</script>

<style lang="scss">
.pool-remove-liquidity-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__badge {
    margin: 3px 0 6px;
  }
}
</style>
