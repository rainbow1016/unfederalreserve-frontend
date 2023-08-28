<template>
  <div
    class="un-balance-card-mobile"
    :class="{'is-orange': !isSupply}"
  >
    <div class="un-balance-card-mobile__block">
      <div class="un-balance-card-mobile__block-wrapper">
        <div class="un-balance-card-mobile__text-wrap">
          <div
            class="un-balance-card-mobile__label"
            v-text="titleTop"
          />
          <div
            v-if="!skeleton"
            class="un-balance-card-mobile__value"
            v-text="valueTopFormatted"
          />
          <UnSkeleton
            v-if="skeleton"
            height="16px"
            width="70px"
            class="un-balance-card-mobile__value un-balance-card-mobile__skeleton"
          />
        </div>

        <div class="un-balance-card-mobile__text-wrap">
          <div
            class="un-balance-card-mobile__label"
            v-text="titleBottom"
          />
          <div
            v-if="!skeleton"
            class="un-balance-card-mobile__value"
            v-text="valueBottomFormatted"
          />
          <UnSkeleton
            v-if="skeleton"
            height="16px"
            width="70px"
            class="un-balance-card-mobile__value un-balance-card-mobile__skeleton"
          />
        </div>
      </div>

      <div v-if="!isSupply" class="un-balance-card-mobile__progress">
        <div
          class="un-balance-card-mobile__progress-inner"
          :style="progressStyles"
        />
      </div>
    </div>

    <div class="un-balance-card-mobile__apy">
      <div
        class="un-balance-card-mobile__label"
        v-text="'Net APY'"
      />
      <div
        v-if="!skeleton"
        class="un-balance-card-mobile__value"
        v-text="apyFormated"
      />
      <UnSkeleton
        v-if="skeleton"
        height="16px"
        width="70px"
        class="un-balance-card-mobile__value un-balance-card-mobile__skeleton"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { formatToCurrencyDisplay, formatPercentDisplay } from '@/helpers/formatters';
import { toFixed } from '@/helpers/toFixed';

import UnSkeleton from '@/components/ui/UnSkeleton.vue';


export default defineComponent({
  name: 'UnBalanceCard',
  components: {
    UnSkeleton,
  },
  props: {
    skeleton: Boolean,
    isSupply: Boolean,
    titleTop: {
      type: String,
      default: '-',
    },
    titleBottom: {
      type: String,
      default: '-',
    },
    valueTop: {
      type: Number,
      default: 0.00,
    },
    valueBottom: {
      type: Number,
      default: 0,
    },
    apy: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const valueTopFormatted = computed(() => (
      formatToCurrencyDisplay(props.valueTop, void 2)
    ));

    const percent = computed(() => {
      if (!props.isSupply) {
        const { valueTop, valueBottom } = props;
        if (typeof valueTop === 'string' || typeof valueBottom === 'string') return 0;
        const val = toFixed(100 * (valueTop / valueBottom), 2);
        return Math.round(+val) === +val ? Math.round(+val) : +val;
      }
      return 0;
    });

    const valueBottomFormatted = computed(() => (
      props.isSupply ? formatToCurrencyDisplay(props.valueBottom, void 0) : formatPercentDisplay(percent.value)
    ));

    const progressStyles = computed(() => ({
      width: `${percent.value < 0.1 ? 0 : percent.value}%`,
    }));

    const apyFormated = computed(() => (formatPercentDisplay(props.apy || 0)));

    return {
      valueTopFormatted,
      valueBottomFormatted,
      progressStyles,
      apyFormated,
    };
  },
});
</script>

<style lang="scss">
.un-balance-card-mobile {
  $root: &;

  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 180px;
  padding-left: 70px;

  &__label {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: #fff;
  }

  &__value {
    font-size: 22px;
    font-weight: 600;
    line-height: 33px;

    &#{$root}__skeleton {
      margin: 8px 0 9px;
    }
  }

  &__text-wrap &__value {
    color: #00ffc2;

    #{$root}.is-orange & {
      color: #ea9650;
    }
  }

  &__block {
    position: relative;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    width: 100%;
    height: 121px;
    padding-left: 76px;
    background: rgba(17, 37, 100, 0.5);
    background: right / cover no-repeat url(~@/assets/images/background/home-balance-bg-mobile.png);
    border-radius: 15px;
  }

  &__apy {
    position: absolute;
    top: 11px;
    left: -15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 152px;
    height: 152px;
    text-align: center;
    background: center/ contain no-repeat url(~@/assets/images/background/home-net-apy-bg.png) #2c4ba9;
    border-radius: 100%;

    #{$root}__value {
      color: $un-color-white;
    }
  }

  &__progress {
    position: absolute;
    right: 10px;
    bottom: 0;
    width: 100%;
    height: 3px;
    padding-left: 43px;
    overflow: hidden;
    background-color: #19317d;
    border-radius: 3px;
  }

  &__progress-inner {
    width: 0;
    height: 3px;
    background-color: #ea9650;
    border-radius: 3px;
    transition: width 1s ease-out;
  }
}
</style>
