<template>
  <div class="markets-all-table-col-changes">
    <transition name="transition--fade" mode="out-in">
      <div :key="value_f" class="markets-all-table-col-changes__value" data-testid="value">
        {{ value_f }}
      </div>
    </transition>

    <transition name="transition--fade" mode="out-in">
      <div
        :key="changes_f"
        class="markets-all-table-col-changes__changes"
        data-testid="changes"
        :class="changesClass"
        v-text="changes_f"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { beautifyNumber, formatPercentDisplay } from '@/helpers/formatters/';
import { formatPercentage } from '../utils';


export default defineComponent({
  name: 'MarketsAllTableColChanges',
  props: {
    value: {
      type: Number,
      required: true,
    },
    changes: {
      type: Number,
      required: true,
    },
    percent: {
      type: Boolean,
      required: true,
    },
  },
  setup(props) {
    const changes_f = computed(() => (
      formatPercentage(props.changes)
    ));

    const changesClass = computed(() => (
      // eslint-disable-next-line no-nested-ternary
      changes_f.value === '0%' ? '' : props.changes >= 0 ? 'is-up' : 'is-down'
    ));

    const value_f = computed(() => (
      props.percent ? formatPercentDisplay(props.value) : beautifyNumber(props.value, true)
    ));

    return {
      changesClass,
      value_f,
      changes_f,
    };
  },
});
</script>

<style lang="scss">
.markets-all-table-col-changes {
  text-align: right;

  &__value {
    line-height: 26px;

    @include media-lt(tablet) {
      margin-bottom: 5px;
      font-size: 13px;
      font-weight: 600;
      line-height: 19px;
    }
  }

  &__changes {
    font-size: 12px;
    font-weight: 500;
    line-height: 26px;
    color: $un-color-soft-gray;
    text-align: right;

    @include media-lt(tablet) {
      line-height: 18px;
    }

    &.is-up {
      color: $un-color-green;
    }

    &.is-down {
      color: $un-color-red;
    }
  }
}
</style>
