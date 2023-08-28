<template>
  <UnExpansionPanel
    small
    class="dashboard-pools-position__expansion-panel"
  >
    <template #main>
      <div class="dashboard-pools-position__item-wrap">
        <div class="dashboard-pools-position__token-wrap">
          <UnSkeleton
            v-if="skeleton"
            :width="isDesktop ? '243px' : '100px'"
            class="dashboard-pools-position__skeleton"
          />

          <div v-else class="dashboard-pools-position__token-details">
            <UnToken
              :icons="positionMainFormatted.icons"
              :symbol="positionMainFormatted.symbol"
              small
              class="dashboard-pools-position__token"
            />

            <div
              class="dashboard-pools-position__fee"
              v-text="positionMainFormatted.fee"
            />
          </div>
        </div>

        <div
          class="dashboard-pools-position__value"
          v-text="positionMainFormatted.liquidityUsd"
        />
      </div>
    </template>

    <template #item>
      <div class="dashboard-pools-position__details-wrap">
        <div
          v-for="item in detailsOptions"
          :key="item"
          class="dashboard-pools-position__details-item"
        >
          <div class="dashboard-pools-position__details-token-wrap">
            <img
              :src="item.icon"
              class="dashboard-pools-position__details-icon"
            >

            <div class="dashboard-pools-position__details-token">
              <div
                class="dashboard-pools-position__details-name"
                v-text="item.name"
              />
              <div
                class="dashboard-pools-position__details-price"
                v-text="item.price"
              />
            </div>
          </div>

          <div class="dashboard-pools-position__details-value-wrap">
            <div
              class="dashboard-pools-position__details-value"
              v-text="item.valueUsd"
            />
            <div
              class="dashboard-pools-position__details-subvalue"
              v-text="item.value"
            />
          </div>
        </div>
      </div>
    </template>
  </UnExpansionPanel>
</template>

<script lang="ts">
import { PropType, defineComponent, computed } from 'vue';
import { useBreakpoints } from '@/composable';
import { Position } from '@/types/common.d';
import { formatPercentDisplay, formatToCurrencyDisplay, formatBalanceDisplay } from '@/helpers/formatters';
import { getTokenNames } from '@/views/Pool/utils';

import UnExpansionPanel from '@/components/ui/UnExpansionPanel.vue';
import UnToken from '@/components/common/UnToken.vue';
import UnSkeleton from '@/components/ui/UnSkeleton.vue';


const getDetailsOptions = (
  token: Position['quote'],
  market: Position['quoteMarket'],
  balance: string,
) => {
  const tokenData = getTokenNames(token);
  let price: string | null = null;
  let valueUsd: string | null = null;

  if (market) {
    price = formatToCurrencyDisplay(market.price_usd);
    valueUsd = formatToCurrencyDisplay(market.price_usd * +balance);
  }

  return {
    symbol: tokenData.symbol,
    icon: tokenData.icon,
    name: tokenData.symbol,
    price: price ?? '-',
    value: formatBalanceDisplay(balance),
    valueUsd: valueUsd ?? '-',
  };
};

export default defineComponent({
  name: 'DashboardPoolsPosition',
  components: {
    UnExpansionPanel,
    UnToken,
    UnSkeleton,
  },
  props: {
    skeleton: Boolean,
    loading: Boolean,
    position: {
      type: Object as PropType<Position>,
      required: true,
    },
  },
  setup(props) {
    const { isDesktop } = useBreakpoints();

    const detailsOptions = computed(() => {
      const {
        quote,
        base,
        amountQuote,
        amountBase,
        baseMarket,
        quoteMarket,
      } = props.position;

      return [
        getDetailsOptions(quote, quoteMarket, amountQuote),
        getDetailsOptions(base, baseMarket, amountBase),
      ];
    });

    const positionMainFormatted = computed(() => {
      const { fee } = props.position.positionData;
      const [quoteDetails, baseDetails] = detailsOptions.value;
      let { liquidityUsd } = props.position;
      liquidityUsd = (liquidityUsd
        ? formatToCurrencyDisplay(liquidityUsd)
        : liquidityUsd) as number;

      return {
        icons: [quoteDetails.icon, baseDetails.icon],
        symbol: `${quoteDetails.symbol}/${baseDetails.symbol}`,
        fee: fee ? formatPercentDisplay(fee / 10_000) : '-',
        liquidityUsd: liquidityUsd ?? '-',
      };
    });

    return {
      isDesktop,
      detailsOptions,
      positionMainFormatted,
    };
  },
});
</script>

<style lang="scss">
.dashboard-pools-position {
  $root: &;

  &__item-wrap {
    @include media-gt(desktop) {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  &__token-wrap {
    display: flex;
    align-items: center;

    @include media-lt(desktop) {
      margin-bottom: 9px;
    }
  }

  &__token-details {
    display: flex;
    align-items: center;
  }

  &__token {
    margin-right: 7px;

    #{$root}.is-active & {
      color: $un-color-white;
    }

    @include media-lt(tablet) {
      .un-token__icon {
        max-width: 17px;
        max-height: 17px;
      }
    }
  }

  &__fee {
    display: none;
    align-items: center;
    padding: 4px 12px;
    font-size: 14px;
    color: white;
    background-color: rgba(100, 136, 255, 0.11);
    border-radius: 25px;

    @include media-gt(tablet) {
      display: inline-flex;
    }
  }

  &__value {
    font-size: 16px;
    font-weight: 600;
    line-height: 26px;
  }

  &__details {
    &-wrap {
      margin: 0 16px 20px;
      background: #1f398b;
      border-radius: 20px;

      @include media-gt(desktop) {
        padding: 0 20px 20px;
      }
    }

    &-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;

      & + & {
        border-top: 1px solid rgba(149, 173, 255, 0.1);
      }
    }

    &-token-wrap {
      display: flex;
      align-items: center;
    }

    &-icon {
      width: 19px;
      height: 19px;
      margin-right: 12px;
    }

    &-name,
    &-value {
      font-size: 14px;
      font-weight: 600;
      line-height: 21px;
    }

    &-price,
    &-subvalue {
      font-size: 12px;
      line-height: 18px;
      color: #739efa;
    }

    &-value-wrap {
      text-align: end;
    }
  }
}
</style>
