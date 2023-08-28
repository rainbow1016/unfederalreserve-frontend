<template>
  <div class="markets-overview">
    <UnSkeleton
      v-if="skeleton"
      height="24px"
      width="100%"
      style="margin-top: 48px;"
    />

    <UnSkeleton
      v-if="skeleton"
      height="24px"
      width="80%"
      style="margin-top: 32px;"
    />

    <ECharts
      v-else
      :option="option"
      autoresize
      class="markets-overview__chart"
    />
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line object-curly-newline
import { PropType, computed, defineComponent, defineAsyncComponent } from 'vue';
import { IAllMarket } from '@/types/api/allMarkets';

import { beautifyNumber } from '@/helpers/formatters/';
import { getMarketsTotal } from '../utils';

import UnSkeleton from '@/components/ui/UnSkeleton.vue';


const ECharts = defineAsyncComponent(() => import(
  /* webpackChunkName: "vue-echarts" */
  'vue-echarts'
));

const TITLES = {
  SUPPLY: 'Total Supply',
  BORROW: 'Total Borrowed',
};

const createChartOptions = (
  supply: number,
  borrow: number,
  isEmpty = false,
) => ({
  tooltip: {
    show: false,
  },
  legend: {
    top: 'middle',
    left: 'middle',
    orient: 'vertical',
    itemGap: 20,
    align: 'left',
    icon: 'circle',
    selectedMode: false,
    textStyle: {
      color: '#798DCA',
      fontFamily: 'Poppins',
      fontWeight: 600,
      fontSize: 13,
      rich: {
        value: {
          color: '#fff',
          fontSize: 16,
          fontWeight: 'bold',
          lineHeight: 35,
        },
      },
    },
    formatter: (name: string) => {
      if (isEmpty) return `${name} \n {value|-}`;
      const value = name === TITLES.SUPPLY ? supply : borrow;
      return `${name} \n {value|${beautifyNumber(value, true)}}`;
    },
  },
  series: [
    {
      name: 'Market Overview',
      type: 'pie',
      cursor: 'default',
      radius: ['40%', '70%'],
      center: ['22%', '50%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
      },
      labelLine: {
        show: false,
      },
      data: [
        {
          value: isEmpty ? '-' : supply,
          name: TITLES.SUPPLY,
          itemStyle: {
            color: '#407BFF',
          },
        },
        {
          value: isEmpty ? '-' : borrow,
          name: TITLES.BORROW,
          itemStyle: {
            color: '#FC942C',
          },
        },
      ],
    },
  ],
});


export default defineComponent({
  name: 'MarketsOverview',
  components: {
    ECharts,
    UnSkeleton,
  },
  props: {
    skeleton: Boolean,
    all_markets: {
      type: Array as PropType<IAllMarket[]>,
      required: true,
    },
  },
  setup: (props) => {
    const option = computed(() => {
      const { all_markets } = props;
      const supply = getMarketsTotal(all_markets, 'supplyDaily');
      const borrow = getMarketsTotal(all_markets, 'borrowDaily');

      return createChartOptions(supply, borrow, !all_markets.length);
    });

    return {
      option,
    };
  },
});
</script>

<style lang="scss">
.markets-overview {
  padding: 0 25px;

  @include media-lt(mobile-xs) {
    padding: 0 5px;
  }

  &__chart {
    height: 175px;
  }
}
</style>
