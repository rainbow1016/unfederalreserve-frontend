<template>
  <div class="markets-tvl-trend">
    <UnSkeleton
      v-if="skeleton"
      height="24px"
      width="calc(100% - 24px)"
      style="margin: 48px 12px 12px;"
    />

    <UnSkeleton
      v-if="skeleton"
      height="24px"
      width="calc(80% - 24px)"
      style="margin: 32px 12px 12px;"
    />

    <ECharts
      v-else
      class="markets-tvl-trend__chart"
      :option="option"
      autoresize
    />
  </div>
</template>

<script lang="ts">
import { graphic } from 'echarts';
// eslint-disable-next-line object-curly-newline
import { PropType, computed, defineComponent, defineAsyncComponent } from 'vue';
import { IAllMarket } from '@/types/api/allMarkets';
import { formatToCurrency, formatToDate } from '@/helpers/formatters/';

import UnSkeleton from '@/components/ui/UnSkeleton.vue';


const ECharts = defineAsyncComponent(() => import(
  /* webpackChunkName: "vue-echarts" */
  'vue-echarts'
));

const createChartOptions = (
  dataLabels: string[],
  dataValues: number[],
) => ({
  grid: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  tooltip: {
    className: 'markets-tvl-trend__line-tooltip',
    trigger: 'axis',
    borderColor: '#091844',
    backgroundColor: '#091844',
    extraCssText: 'box-shadow: 0px 5px 13px rgba(4, 4, 4, 0.18);',
    axisPointer: {
      type: 'none',
    },
    textStyle: {
      color: '$un-color-white',
      fontFamily: 'Poppins',
      fontSize: 12,
      lineHeight: 46,
    },
    formatter: ([{ name, data }]: { name: string; data: number }[]) => (`
      ${name}
      <br />
      <span class="markets-tvl-trend__tooltip-value">
        ${formatToCurrency(data)}
      </span>`),
  },
  legend: {
    show: false,
  },
  xAxis: [
    {
      show: false,
      type: 'category',
      boundaryGap: false,
      data: dataLabels,
    },
  ],
  yAxis: [
    {
      show: false,
      type: 'value',
    },
  ],
  series: [
    {
      name: 'TVL',
      type: 'line',
      cursor: 'default',
      stack: 'TVL',
      smooth: true,
      lineStyle: {
        width: 1,
        color: '#fff',
      },
      itemStyle: {
        color: '#407BFF',
        borderWidth: 2,
        borderColor: '#fff',
      },
      symbol: 'circle',
      symbolSize: 10,
      showSymbol: false,
      areaStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgba(39, 67, 157, 0)',
          },
          {
            offset: 1,
            color: 'rgba(74, 135, 255, 0.56)',
          },
        ]),
      },
      data: dataValues,
    },
  ],
});

const getMappedValues = (
  all_markets: IAllMarket[],
  key: 'supplyDaily' | 'borrowDaily',
) => {
  const date = new Date();
  const lastThreeMonth = date.setMonth(date.getMonth() - 3);

  return all_markets.reduce((acc, market) => {
    market[key].forEach(({ time, total }) => {
      const dateItem = new Date(time);

      if (+dateItem > lastThreeMonth) {
        acc[time] = total + (acc[time] || 0);
      }
    });

    return acc;
  }, {} as Record<string, number>);
};

export default defineComponent({
  name: 'MarketsTvlTrend',
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
    type: {
      type: String as PropType<'supply' | 'borrow'>,
      required: true,
    },
  },
  setup: (props) => {
    const option = computed(() => {
      const { all_markets } = props;

      const type = `${props.type}Daily` as const;
      const mappedValues = getMappedValues(all_markets, type);
      const dataLabels = Object.keys(mappedValues).reverse()
        .map((date, index, arr) => formatToDate(date, index === arr.length - 1));
      const dataValues = Object.values(mappedValues).reverse();
      return createChartOptions(dataLabels, dataValues);
    });

    return {
      option,
    };
  },
});
</script>

<style lang="scss">
.markets-tvl-trend {
  $root: &;

  &__chart {
    height: 175px;

    div {
      &:not(#{$root}__line-tooltip) {
        width: 100% !important;
        cursor: default !important;
      }
    }

    canvas {
      width: 100% !important;
      border-radius: 0 0 12px 12px;
    }

    #{$root}__line-tooltip {
      z-index: 9 !important;
      font-size: 12px;
      font-weight: 500;
      line-height: 26px;
      color: $un-color-white;

      #{$root}__tooltip-value {
        font-size: 20px;
        font-weight: 700;
        line-height: 20px;
        color: $un-color-white;
      }
    }
  }
}
</style>
