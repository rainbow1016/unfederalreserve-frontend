<template>
  <div class="markets-top-3">
    <template v-for="{ title, details } in list" :key="title">
      <div class="markets-top-3__item">
        <h5 class="markets-top-3__title">
          {{ title }}
        </h5>

        <MarketsTop3Details
          v-for="(item, index) of details"
          :key="index"
          :data="item"
          :skeleton="skeleton"
          class="markets-top-3__details"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { PropType, computed, defineComponent } from 'vue';
import { IAllMarket } from '@/types/api/allMarkets';
import { formatSymbol } from '@/helpers/formatters/legacy';
import { getMarketsTotal } from '../utils';

import MarketsTop3Details from './MarketsTop3Details.vue';


const MARKET_TOP_3 = [
  {
    title: 'Supply',
    key: 'supplyDaily',
  },
  {
    title: 'Borrow',
    key: 'borrowDaily',
  },
] as const;

const getTopMarketsDetails = (
  markets: IAllMarket[],
  key: 'supplyDaily' | 'borrowDaily',
) => {
  if (!markets.length) {
    return Array(3).fill({ symbol: 'loading...', percent: 0 }) as
    { symbol: string; percent: number }[];
  }

  const sortedMarkets = markets.slice().sort((a, b) => {
    const first = a[key][0]?.total || 0;
    const second = b[key][0]?.total || 0;
    return second - first;
  });

  const total = getMarketsTotal(markets, key);

  return sortedMarkets.slice(0, 3).map((market) => {
    const symbol = formatSymbol(market.underlyingSymbol, false, true);
    const [today] = market[key] || [];
    const percent = ((today?.total || 0) / total) * 100;

    return { symbol, percent };
  });
};

export default defineComponent({
  name: 'MarketsTopThree',
  components: {
    MarketsTop3Details,
  },
  props: {
    all_markets: {
      type: Array as PropType<IAllMarket[]>,
      required: true,
    },
    skeleton: Boolean,
  },
  setup: (props) => {
    const list = computed(() => {
      const { all_markets } = props;

      return MARKET_TOP_3.map((_) => ({
        title: _.title,
        details: getTopMarketsDetails(all_markets, _.key),
      }));
    });

    return {
      list,
    };
  },
});
</script>

<style lang="scss">
.markets-top-3 {
  display: flex;
  justify-content: space-between;
  margin-top: 18px;

  &__item {
    // width: calc(50% - 8px);
    flex: 1 1 50%;

    & + & {
      margin-left: 16px;
    }
  }

  &__title {
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 21px;
    color: $un-color-soft-gray;
    text-align: center;
  }

  &__details {
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
