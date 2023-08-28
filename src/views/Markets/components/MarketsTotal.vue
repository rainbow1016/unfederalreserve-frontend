<template>
  <div class="markets-total">
    <UnSkeleton
      v-if="skeleton"
      :height="isTablet ? '30px' : '34px'"
      width="330px"
      class="markets-total__value markets-total__skeleton"
    />

    <transition v-else name="transition--fade" mode="out-in">
      <div :key="data.amount_f" class="markets-total__value">
        <span>{{ data.amount_f }}</span>

        <div
          v-if="data.amount_changes"
          :class="data.amount_changes >= 0 ? 'is-up' : 'is-down'"
          class="markets-total__value-changes"
          v-text="data.amount_changes_f"
        />
      </div>
    </transition>

    <div class="markets-total__bottom">
      <div class="markets-total__info-item">
        <div class="markets-total__label">
          24H {{ data.type }} Volume (Difference in USD)
        </div>

        <UnSkeleton
          v-if="skeleton"
          height="27px"
          width="110px"
          class="markets-total__skeleton"
        />

        <transition v-else name="transition--fade" mode="out-in">
          <div :key="data.amount_24_f" class="markets-total__amount">
            {{ data.amount_24_f }}
          </div>
        </transition>
      </div>

      <div class="markets-total__info-item">
        <div class="markets-total__label">
          # of {{ data.label }}
        </div>

        <UnSkeleton
          v-if="skeleton"
          height="27px"
          width="110px"
          class="markets-total__skeleton"
        />

        <transition v-else name="transition--fade" mode="out-in">
          <div :key="data.count" class="markets-total__amount">
            {{ data.count }}
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent, computed } from 'vue';
import { IAllMarket } from '@/types/api/allMarkets';
import { formatToCurrency } from '@/helpers/formatters';
import { useBreakpoints } from '@/composable';
import { calculateChangePercent } from '@/helpers/calculateChangePercent';
import {
  MarketTotalTypes,
  getMarketsTotal,
  getMarketsDaily,
  getMarketsCount,
  formatPercentage,
} from '../utils';

import UnSkeleton from '@/components/ui/UnSkeleton.vue';


const MARKET_TOTAL_SETTINGS = {
  [MarketTotalTypes.supply]: {
    amount_key: 'supplyDaily',
    count_key: 'numSuppliers',
    label: 'Suppliers',
    type: 'Supply',
  },
  [MarketTotalTypes.borrow]: {
    amount_key: 'borrowDaily',
    count_key: 'numBorrowers',
    label: 'Borrowers',
    type: 'Borrow',
  },
} as const;

const getData = (
  markets: IAllMarket[],
  type: MarketTotalTypes,
) => {
  const settings = MARKET_TOTAL_SETTINGS[type];

  if (!markets.length) {
    return {
      ...settings,
      amount: '-',
      amount_f: '-',

      amount_changes: '',
      amount_changes_f: '',

      amount_24: '-',
      amount_24_f: '-',

      count: '-',
    };
  }

  const amount = getMarketsTotal(markets, settings.amount_key);
  const amount_f = formatToCurrency(amount);

  const amount_24 = getMarketsDaily(markets, settings.amount_key);
  const amount_24_f = formatToCurrency(amount_24);

  const amount_changes = calculateChangePercent(amount, amount - amount_24);

  const amount_changes_f = formatPercentage(amount_changes);

  const count = getMarketsCount(markets, settings.count_key);

  return {
    ...settings,
    amount,
    amount_f,

    amount_changes,
    amount_changes_f,

    amount_24,
    amount_24_f,

    count,
  };
};


export default defineComponent({
  name: 'MarketsTotal',
  components: {
    UnSkeleton,
  },
  props: {
    type: {
      type: String as PropType<MarketTotalTypes>,
      required: true,
      validator: (prop: MarketTotalTypes) => (
        prop in MarketTotalTypes
      ),
    },
    all_markets: {
      type: Array as PropType<IAllMarket[]>,
      required: true,
    },
    skeleton: Boolean,
  },
  setup: (props) => {
    const { isTablet } = useBreakpoints();
    const data = computed(() => (
      getData(props.all_markets, props.type)
    ));

    return {
      data,
      isTablet,
    };
  },
});
</script>

<style lang="scss">
.markets-total {
  color: $un-color-white;

  &__value {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-top: 22px;
    margin-bottom: 27px;
    font-size: 34px;
    font-style: normal;
    font-weight: 700;
    line-height: 100%;
    letter-spacing: 0.01em;

    @include media-lt(tablet) {
      font-size: 30px;
    }

    @include media-lt(tablet-xs) {
      flex-direction: column;
      align-items: flex-start;
    }

    @include media-lt(mobile-xs) {
      font-size: 22px;
    }
  }

  &__value-changes {
    margin-left: 11px;
    font-size: 16px;
    font-weight: 600;
    line-height: 26px;

    @include media-lt(tablet-xs) {
      margin: 5px 0 0 0;
    }

    &.is-up {
      color: $un-color-green;
    }

    &.is-down {
      color: $un-color-red;
    }
  }

  &__bottom {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;

    @include media-lt(tablet-xs) {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  &__info-item {
    margin-bottom: 9px;

    &:first-child {
      margin-right: 20px;
      text-align: left;
    }

    &:last-child {
      text-align: right;

      @include media-lt(tablet-xs) {
        margin-bottom: 0;
        text-align: left;
      }
    }
  }

  &__label {
    margin-bottom: 6px;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 26px;
    color: $un-color-soft-gray;

    @include media-lt(tablet-xs) {
      margin-bottom: 0;
      font-size: 13px;
      line-height: 20px;
    }
  }

  &__amount {
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 27px;
  }
}
</style>
