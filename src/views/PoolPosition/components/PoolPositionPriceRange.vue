<template>
  <UnCard
    no-padding
    transparent-dark
    class="pool-position-price-range"
  >
    <UnAccountTicket
      v-if="tokenA && tokenB"
      :left-range="leftRange"
      :right-range="rightRange"
      :token-a="tokenA"
      :token-b="tokenB"
      :token-price="tokenPrice"
      :fee="fee"
      with-tabs
      tabs-right
      title="Price Range"
      class="pool-position-price-range__account-ticket"
    />

    <template v-else>
      We don't support one of the Tokens.
    </template>
  </UnCard>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { Position } from '@/types/common.d';
import { PoolToken } from '@/classes/PoolToken';

import UnCard from '@/components/ui/UnCard.vue';
import UnAccountTicket from '@/components/common/UnAccountTicket.vue';


export default defineComponent({
  name: 'PoolPositionPriceRange',
  components: {
    UnCard,
    UnAccountTicket,
  },
  props: {
    position: {
      type: Object as PropType<Position>,
      required: true,
    },
  },
  setup(props) {
    // eslint-disable-next-line vue/no-setup-props-destructure
    const {
      quoteMarket,
      baseMarket,

      tokenQuotePrice,

      minPrice,
      maxPrice,

      inverted,
    } = props.position;

    // eslint-disable-next-line vue/no-setup-props-destructure
    const { fee } = props.position.uniswapPool;

    const tokenA = quoteMarket && PoolToken.buildClass(quoteMarket);
    const tokenB = baseMarket && PoolToken.buildClass(baseMarket);

    return {
      fee,
      tokenA,
      tokenB,

      tokenPrice: tokenQuotePrice,

      leftRange: inverted ? (1 / +maxPrice).toFixed(18) : minPrice,
      rightRange: inverted ? (1 / +minPrice).toFixed(18) : maxPrice,
    };
  },
});
</script>

<style lang="scss">
.pool-position-price-range {
  padding: 20px 17px;

  @include media-gt(tablet) {
    padding: 30px;
  }
}
</style>
