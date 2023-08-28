<template>
  <div class="pool-increase-liquidity-header">
    <div class="pool-increase-liquidity-header_tokens">
      <UnToken
        :symbols="[quoteSymbol, baseSymbol]"
        :symbol="`${quoteSymbol}/${baseSymbol}`"
        class="pool-increase-liquidity-header__token"
      />

      <UnBadge
        :in-range="position.inRange"
        :out-of-range="!position.inRange"
        :is-closed="position.isClosed"

        in-range-with-bg
        class="pool-increase-liquidity-header__badge"
      />
    </div>

    <div class="pool-increase-liquidity-header__balance-tokens">
      <UnInfoField
        :symbol="quoteSymbol"
        :value="position.amountQuote"
        class="pool-increase-liquidity-header__balance-token"
      />
      <UnInfoField
        :symbol="baseSymbol"
        :value="position.amountBase"
        class="pool-increase-liquidity-header__balance-token"
      />
    </div>

    <UnInfoField
      :value="feeAmount"
      text="Fee Tier"
      class="pool-increase-liquidity-header__fee"
    />

    <h5
      class="pool-increase-liquidity-header__subtitle"
      v-text="'Deposit Amounts'"
    />
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { Position } from '@/types/common.d';

import UnToken from '@/components/common/UnToken.vue';
import UnInfoField from '@/components/common/UnInfoField.vue';
import UnBadge from '@/components/ui/UnBadge.vue';


export default defineComponent({
  name: 'PoolIncreaseLiquidityHeader',
  components: {
    UnToken,
    UnInfoField,
    UnBadge,
  },
  props: {
    position: {
      type: Object as PropType<Position>,
      required: true,
    },
  },
  setup: (props) => {
    // eslint-disable-next-line vue/no-setup-props-destructure
    const {
      base,
      quote,
      positionData,
    } = props.position;

    const feeAmount = (positionData.fee / 10_000).toString();
    const baseSymbol = base.symbol?.replace('WETH', 'ETH');
    const quoteSymbol = quote.symbol?.replace('WETH', 'ETH');

    return {
      base,
      quote,

      baseSymbol,
      quoteSymbol,

      feeAmount,
    };
  },
});
</script>

<style lang="scss">
.pool-increase-liquidity-header {
  &_tokens {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  &__badge {
    margin: 3px 0 6px;
  }

  &__balance-tokens {
    margin-bottom: 6px;

    @include media-gt(tablet) {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 15px;
    }
  }

  &__balance-token {
    @include media-lt(tablet) {
      & + & {
        margin-top: 6px;
      }
    }

    @include media-gt(tablet) {
      width: calc(50% - 5px);
    }
  }

  &__fee {
    min-height: 49px;
    margin-bottom: 22px;
  }

  &__subtitle {
    margin-bottom: 23px;
    font-size: 18px;
    font-weight: 500;
    line-height: 100%;

    @include media-gt(tablet) {
      margin-bottom: 15px;
    }
  }
}
</style>
