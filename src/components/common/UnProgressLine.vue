<template>
  <div
    class="un-progress-line"
  >
    <div class="un-progress-line__info">
      <slot name="info-before" />

      <transition name="transition--fade" mode="out-in" appear>
        <template v-if="$slots['info-percent']">
          <div :key="percent" class="un-progress-line__percent">
            <slot name="info-percent" :percent="percent" />
          </div>
        </template>
      </transition>

      <transition name="transition--fade" mode="out-in" appear>
        <template v-if="$slots['info-value']">
          <div :key="value" class="un-progress-line__value" data-testid="borrow-limit-value">
            <slot name="info-value" :value="value" />
          </div>
        </template>
      </transition>

      <slot name="info-after" />
    </div>

    <UnBorrowLimitSwitcher :percent="percent">
      <template #default="{ type }">
        <UnTooltip
          :disabled="!withType"
          content-width="240px"
          block
        >
          <template #activator>
            <div class="un-progress-line__progress">
              <div
                :class="{ [`is-type--${type}`]: withType }"
                :style="progressStyles"
                class="un-progress-line__progress-inner"
              />
            </div>
          </template>

          <template v-if="true">
            Liquidation occurs if Borrow Balance meets or exceeds Borrow Limit:
            <br>
            <span class="un-font-bold">
              Liquidity cushion of {{ available }}
            </span>
          </template>
        </UnTooltip>
      </template>
    </UnBorrowLimitSwitcher>
  </div>
</template>

<script lang="ts">
import { PropType, computed, defineComponent } from 'vue';
import { toFixed } from '@/helpers/toFixed';
import { formatToCurrency } from '@/helpers/formatters';

import UnTooltip from '@/components/ui/UnTooltip.vue';
import UnBorrowLimitSwitcher from '@/components/common/UnBorrowLimitSwitcher.vue';


export default defineComponent({
  name: 'UnProgressLine',
  components: {
    UnTooltip,
    UnBorrowLimitSwitcher,
  },
  props: {
    withType: Boolean,
    value: {
      type: [Number, String] as PropType<number | string>,
      required: true,
    },
    max: {
      type: [Number, String] as PropType<number | string>,
      required: true,
    },
  },
  setup: (props) => {
    const percent = computed(() => {
      const { value, max } = props;
      if (typeof value === 'string' || typeof max === 'string') return 0;
      const val = toFixed(100 * (value / max), 2);
      return Math.round(+val) === +val ? Math.round(+val) : +val;
    });

    const available = computed(() => {
      const { value, max } = props;
      if (typeof value === 'string' || typeof max === 'string') return '';
      return formatToCurrency(max - value);
    });

    const progressStyles = computed(() => ({
      width: `${percent.value < 0.1 ? 0 : percent.value}%`,
    }));

    return {
      percent,
      available,
      progressStyles,
    };
  },
});
</script>

<style lang="scss">
$un-progress-line-border-radius: 5px !default;

.un-progress-line {
  $root: &;

  font-size: 15px;
  font-weight: 600;
  line-height: 26px;
  color: $un-color-white;

  &__info {
    display: flex;
    justify-content: space-between;
  }

  &__progress {
    width: 100%;
    height: 1px + $un-progress-line-border-radius;
    overflow: hidden;
    background-color: rgba(white, 0.2);
    border-radius: $un-progress-line-border-radius;
  }

  &__progress-inner {
    width: 0;
    height: 1px + $un-progress-line-border-radius;
    background-color: $un-color-normal;
    border-radius: $un-progress-line-border-radius;
    transition: width 1s ease-out;

    &.is-type {
      &--warning {
        background-image:
          linear-gradient(
            90deg,
            $un-color-normal 0%,
            $un-color-normal 92%,
            $un-color-warning 92%
          );
      }

      &--danger {
        background:
          linear-gradient(
            90deg,
            $un-color-warning 0%,
            $un-color-danger 100%
          );
      }

      &--critical {
        background: $un-color-critical;
      }
    }
  }
}
</style>
