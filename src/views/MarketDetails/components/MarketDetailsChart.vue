<template>
  <div class="market-details-chart">
    <ECharts
      autoresize
      class="market-details-chart__chart"
      :option="option"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  defineAsyncComponent,
  PropType,
  computed,
} from 'vue';
import { graphic } from 'echarts';

import { beautifyNumber, formatToFullDate } from '@/helpers/formatters';
import { IAllMarketDaily } from '@/types/api/allMarkets';


type ILabels = {
  apy: string;
  total: string;
}

const ECharts = defineAsyncComponent(() => import(
  /* webpackChunkName: "vue-echarts" */
  'vue-echarts'
));

const createChartOptions = (
  date: string[],
  apy: number[],
  total: number[],
  labels: ILabels,
) => ({
  grid: {
    top: 0,
    left: 0,
    right: 0,
    bottom: '10%',
    containLabel: false,
  },
  tooltip: {
    className: 'markets-tvl-trend__line-tooltip',
    trigger: 'axis',
    showContent: true,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    extraCssText: 'box-shadow: none; text-align: center',
    textStyle: {
      color: '#fff',
      fontFamily: 'Poppins',
      fontSize: 12,
      lineHeight: 46,
    },
    formatter: (params: { value: number }[]) => (
      `<div class="market-details-chart__tooltip">
        <div class="market-details-chart__tooltip-date">${params[2].value}</div>
        <div>
          <span class="market-details-chart__tooltip-title">${labels.apy}</span>
          <span class="market-details-chart__tooltip-data">${params[1].value.toFixed(2)}%</span>
        </div>
        <div>
          <span class="market-details-chart__tooltip-title">${labels.total}</span>
          <span class="market-details-chart__tooltip-data">${beautifyNumber(params[0].value, true)} </span>
        </div>
      </div>`),
  },
  legend: {
    show: false,
  },
  xAxis: [
    {
      show: false,
      type: 'category',
      boundaryGap: false,
      data: date,
      axisPointer: {
        type: 'line',
        lineStyle: {
          type: 'dashed',
          color: 'rgba(255, 255, 255, 0)',
        },
      },
    },
  ],
  yAxis: [
    {
      boundaryGap: [0, 1],
      show: false,
      type: 'value',
      data: total,
      interval: 50,
      axisLabel: {
        inside: true,
      },
    },
    {
      boundaryGap: [3, 1],
      show: false,
      type: 'value',
      interval: 5,
      axisLabel: {
        inside: true,
      },
    },
  ],
  series: [
    {
      type: 'bar',
      barGap: '3px',
      barCategoryGap: '3px',
      z: 10,
      emphasis: {
        itemStyle: {
          color: '#fff',
        },
      },
      itemStyle: {
        color: '#739EFA',
      },
      data: total,
    },
    {
      type: 'line',
      z: 11,
      yAxisIndex: 1,
      symbol: 'circle',
      smooth: true,
      symbolSize: 10,
      showSymbol: false,
      lineStyle: {
        width: 2,
        color: '#fff',
      },
      itemStyle: {
        color: '#407BFF',
        borderWidth: 2,
        borderColor: '#fff',
      },
      areaStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgba(74, 135, 255, 0.56)',
          },
          {
            offset: 1,
            color: 'rgba(39, 67, 157, 0)',
          },
        ]),
      },
      data: apy,
    },
    {
      type: 'line',
      data: date,
    },
  ],
});

export default defineComponent({
  name: 'MarketDetailsChart',
  components: {
    ECharts,
  },
  props: {
    data: {
      type: Array as PropType<IAllMarketDaily[]>,
      default: () => [],
    },
    labels: {
      type: Object as PropType<ILabels>,
      required: true,
    },
  },
  setup: (props) => {
    const option = computed(() => {
      const dataDate = props.data.map((item) => formatToFullDate(item.time));
      const dataApy = props.data.map((item) => item.apy);
      const dataTotal = props.data.map((item) => item.total);
      return createChartOptions(dataDate, dataApy, dataTotal, props.labels);
    });

    return {
      option,
    };
  },
});
</script>

<style lang="scss">
.market-details-chart {
  &__chart {
    height: 340px;
  }

  &__tooltip {
    padding: 6px 10px;
    text-align: left;
    background: #091844;
    border-radius: 8px;
    box-shadow: 0 4px 13px rgba(4, 4, 4, 0.2);

    &-date {
      font-size: 15px;
      font-weight: 700;
      line-height: 26px;
      color: $un-color-white;
    }

    &-data {
      font-size: 18px;
      font-weight: 700;
      color: $un-color-white;
    }

    &-title {
      font-size: 14px;
      font-weight: 500;
      line-height: 26px;
      color: $un-color-white;
    }
  }
}

</style>
