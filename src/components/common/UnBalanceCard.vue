<template>
  <div class="un-balance-card un-row is-nowrap">
    <div class="un-balance-card__block un-col-2">
      <div class="un-balance-card__label">
        Supply balance
      </div>
      <div v-if="!loading" class="un-balance-card__value" data-testid="supply-balance">
        {{ supplyBalance }}
      </div>
      <UnSkeleton
        v-if="loading"
        height="32px"
        width="180px"
        class="un-balance-card__value un-balance-card__skeleton"
      />
    </div>
    <div class="un-balance-card__block un-balance-card__block--right un-col-2">
      <div class="un-balance-card__block-wrapper">
        <div class="un-balance-card__borrow-balance">
          <div class="un-balance-card__label">
            Borrow balance
          </div>
          <div v-if="!loading" class="un-balance-card__value" data-testid="borrow-balance">
            {{ borrowBalance }}
          </div>
          <UnSkeleton
            v-if="loading"
            height="32px"
            width="180px"
            class="un-balance-card__value un-balance-card__skeleton"
          />
        </div>
        <div class="un-balance-card__borrow-limit">
          <div class="un-balance-card__label">
            Borrow Limit
          </div>
          <div
            v-if="!loading"
            class="un-balance-card__value"
            data-testid="borrow-limit"
            v-text="percentFormated"
          />
          <UnSkeleton
            v-if="loading"
            height="32px"
            width="180px"
            class="un-balance-card__value un-balance-card__skeleton"
          />
        </div>
      </div>
      <div class="un-balance-card__available">
        Available to borrow
        <span
          v-if="!loading"
          class="un-balance-card__available-value"
          v-text="availableCredit"
        />
        <UnSkeleton
          v-if="loading"
          height="16px"
          width="70px"
          class="un-balance-card__available-value un-balance-card__skeleton"
        />
      </div>
      <div class="un-balance-card__progress">
        <div
          class="un-balance-card__progress-inner"
          :style="progressStyles"
        />
      </div>
    </div>
    <div class="un-balance-card__apy">
      <div class="un-balance-card__label">
        Net APY
      </div>
      <div v-if="!loading" class="un-balance-card__value" data-testid="apy">
        {{ apyFormated }}
      </div>
      <UnSkeleton
        v-if="loading"
        height="32px"
        width="110px"
        class="un-balance-card__value un-balance-card__skeleton"
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
    supply: {
      type: Number,
      default: 0.00,
    },
    borrow: {
      type: Number,
      default: 0.00,
    },
    borrowLimit: {
      type: Number,
      default: 0.00,
    },
    apy: {
      type: Number,
      default: 0,
    },
    loading: Boolean,
  },
  setup(props) {
    const supplyBalance = computed(() => (
      formatToCurrencyDisplay(props.supply, void 0)
    ));
    const borrowBalance = computed(() => (
      formatToCurrencyDisplay(props.borrow, void 0)
    ));
    const availableCredit = computed(() => (
      formatToCurrencyDisplay(props.borrowLimit - props.borrow, void 0)
    ));
    const percent = computed(() => {
      const { borrow, borrowLimit } = props;
      if (typeof borrow === 'string' || typeof borrowLimit === 'string') return 0;
      const val = toFixed(100 * (borrow / borrowLimit), 2);
      return Math.round(+val) === +val ? Math.round(+val) : +val;
    });
    const progressStyles = computed(() => ({
      width: `${percent.value < 0.1 ? 0 : percent.value}%`,
    }));
    const apyFormated = computed(() => (formatPercentDisplay(props.apy || 0)));
    const percentFormated = computed(() => (formatPercentDisplay(percent.value)));

    return {
      supplyBalance,
      borrowBalance,
      availableCredit,
      percentFormated,
      progressStyles,
      apyFormated,
    };
  },
});
</script>

<style lang="scss">
.un-balance-card {
  $root: &;

  width: 100%;
  height: 192px;
  padding: 45px 27px;
  background:
    center / 100% no-repeat url(~@/assets/images/background/home-balance-bg.png),
    center/ contain no-repeat url(~@/assets/images/background/home-net-apy-bg.png);

  &.un-row {
    margin: 0;
  }

  &__label {
    font-size: 14px;
    font-weight: 400;
    line-height: 21px;
    color: #fff;
  }

  &__value {
    font-size: 36px;
    font-weight: 600;
    line-height: 54px;
    color: #00ffc2;

    &#{$root}__skeleton {
      margin: 11px 0;
    }
  }

  &__block {
    margin: 0;

    &--right {
      position: relative;
      width: 53%;

      #{$root}__value {
        color: #ea9650;
      }
    }
  }

  &__block-wrapper {
    display: flex;
    justify-content: space-between;
  }

  &__borrow-balance {
    padding-left: 111px;
  }

  &__borrow-limit {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  &__apy {
    position: absolute;
    left: calc(50% - 78px); // width / 2
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 156px;
    height: 102px;
    text-align: center;

    #{$root}__value {
      color: $un-color-white;
    }
  }

  &__available {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 13px;
    font-weight: 400;
    color: $un-color-white;

    &-value {
      margin-left: 5px;
    }
  }

  &__progress {
    position: absolute;
    right: 0;
    bottom: -27px;
    width: 86.6%;
    height: 3px;
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
