<template>
  <UnCard
    no-padding
    transparent-dark
    class="pool-position-liquidity"
  >
    <div class="pool-position-liquidity__header">
      <div class="pool-position-liquidity__header-wrap-title">
        <div class="pool-position-liquidity__header-wrap">
          <h5
            class="pool-position-liquidity__header-title"
            v-text="'Liquidity'"
          />
          <div
            class="pool-position-liquidity__fee"
            v-text="fee"
          />
        </div>
        <div
          class="pool-position-liquidity__balance-usd"
          v-text="liquidity"
        />
      </div>

      <div class="pool-position-liquidity__header-wrap">
        <UnBadge
          :in-range="inRange"
          :out-of-range="!inRange"
          :is-closed="isClosed"
          in-range-with-bg
          class="pool-position-liquidity__badge"
        />
      </div>
    </div>

    <UnInfoField class="pool-position-liquidity__percent">
      <img
        v-if="tokenAData.icon"
        :src="tokenAData.icon"
        class="pool-position-liquidity__percent-icon"
      >
      <div
        class="pool-position-liquidity__percent-percents"
        v-text="tokenAData.percent"
      />
      <div class="pool-position-liquidity__percent-bar">
        <div
          :style="{ width: tokenAData.percent }"
          class="pool-position-liquidity__percent-bar-helper"
        />
      </div>

      <div
        class="pool-position-liquidity__percent-percents"
        v-text="tokenBData.percent"
      />
      <img
        v-if="tokenBData.icon"
        :src="tokenBData.icon"
        class="pool-position-liquidity__percent-icon"
      >
    </UnInfoField>

    <div class="pool-position-liquidity__balance-tokens">
      <UnInfoField
        :symbol="tokenAData.symbol"
        :value="tokenAData.value"
        class="pool-position-liquidity__balance-token"
      />

      <UnInfoField
        :symbol="tokenBData.symbol"
        :value="tokenBData.value"
        class="pool-position-liquidity__balance-token"
      />
    </div>
  </UnCard>
</template>

<script lang="ts">
import { PropType, defineComponent, computed } from 'vue';
import { Position } from '@/types/common.d';
import { CURRENCIES } from '@/helpers/enums/currencies';

import { formatPercentDisplay, formatToCurrencyDisplay } from '@/helpers/formatters';

import UnCard from '@/components/ui/UnCard.vue';
import UnBadge from '@/components/ui/UnBadge.vue';
import UnInfoField from '@/components/common/UnInfoField.vue';


const getTokenData = (
  token: Position['base'] | Position['quote'],
  amount: string,
  percent?: number,
) => ({
  icon: token.symbol && CURRENCIES[token.symbol],
  symbol: token.symbol?.replace(/^WETH$/, 'ETH') || 'UNKNOWN',
  value: amount,
  percent: formatPercentDisplay(percent || 0),
});

export default defineComponent({
  name: 'PoolPositionLiquidity',
  components: {
    UnCard,
    UnBadge,
    UnInfoField,
  },
  props: {
    position: {
      type: Object as PropType<Position>,
      required: true,
    },
  },
  setup: (props) => {
    const feeAmount = props.position.uniswapPool.fee / 10_000;
    const inRange = computed(() => props.position.inRange);
    const isClosed = computed(() => props.position.isClosed);

    const tokenAData = computed(() => {
      // eslint-disable-next-line object-curly-newline
      const { quote, amountQuote, ratio, inverted } = props.position;
      // eslint-disable-next-line no-nested-ternary
      const percent = ratio === void 0 ? void 0 : inverted ? 100 - ratio : ratio;
      return getTokenData(quote, amountQuote, percent);
    });

    const tokenBData = computed(() => {
      // eslint-disable-next-line object-curly-newline
      const { base, amountBase, ratio, inverted } = props.position;
      // eslint-disable-next-line no-nested-ternary
      const percent = ratio === void 0 ? void 0 : inverted ? ratio : 100 - ratio;
      return getTokenData(base, amountBase, percent);
    });

    const liquidity = computed(() => {
      const liquidityUsd = props.position.liquidityUsd || 0;
      return formatToCurrencyDisplay(+liquidityUsd);
    });

    return {
      fee: formatPercentDisplay(feeAmount),
      inRange,
      isClosed,
      tokenAData,
      tokenBData,
      liquidity,
    };
  },
});
</script>

<style lang="scss">
.pool-position-liquidity {
  padding: 20px 17px 26px;

  @include media-gt(tablet) {
    padding: 29px 33px;
  }

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 19px;

    @include media-gt(tablet) {
      margin-bottom: 16px;
    }
  }

  &__header-wrap {
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    @include media-gt(tablet) {
      margin-bottom: 11px;
    }
  }

  &__header-title {
    margin-right: 14px;
    font-size: 18px;
    font-weight: 500;
    line-height: 100%;
  }

  &__fee {
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    font-size: 16px;
    line-height: 100%;
    color: white;
    background-color: rgba(100, 136, 255, 0.11);
    border-radius: 25px;
  }

  &__balance-usd {
    font-size: 38px;
    font-weight: 500;
    line-height: 100%;
    color: #fff;
  }

  &__percent {
    margin-bottom: 12px;

    &-icon {
      flex-shrink: 0;
      width: 29px;
      height: 29px;
    }

    &-percents {
      padding: 5px;
      font-size: 13px;
      font-weight: 600;
      line-height: 100%;
      color: #739efa;
      background: rgba(100, 136, 255, 0.11);
      border-radius: 8px;
    }

    &-icon + &-percents {
      margin-left: 12px;
    }

    &-percents + &-icon {
      margin-left: 12px;
    }

    &-bar {
      position: relative;
      width: 100%;
      height: 5px;
      margin: 0 10px;
      overflow: hidden;
      background: #627eea;
      border-radius: 0 2.5px 2.5px 0;
    }

    &-bar-helper {
      position: absolute;
      top: 0;
      left: 0;
      width: 0;
      height: 5px;
      content: "";
      background: #fff;
      border-radius: 2.5px 0 0 2.5px;
    }
  }

  &__balance-tokens {
    @include media-gt(tablet) {
      display: flex;
      align-items: center;
      justify-content: space-between;
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

  &__badge {
    @include media-lt(tablet) {
      margin-top: -3px;
    }
  }
}
</style>
