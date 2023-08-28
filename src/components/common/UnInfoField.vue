<template>
  <div class="un-info-field">
    <slot>
      <div class="un-info-field__wrap">
        <div class="un-info-field__name">
          <img
            v-if="icon"
            :src="icon"
            class="un-info-field__icon"
          >
          <div
            class="un-info-field__text"
            v-text="text && (text !== '-') ? text : symbol"
          />
        </div>
        <div class="un-info-field__value">
          <UnTooltip
            class="un-info-field__value-tooltip"
            :content-text="value_f"
            :disabled="value_f?.length < 5"
            content-width="150"
            content-min-width="150"
          >
            <template #activator>
              <span
                class="un-info-field__value-text"
                v-text="value_f"
              />
            </template>
          </UnTooltip>
        </div>
      </div>
    </slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { formatToNumber, formatBalanceDisplay } from '@/helpers/formatters';
import { CURRENCIES } from '@/helpers/enums/currencies';

import UnTooltip from '@/components/ui/UnTooltip.vue';
import { toFixed } from '@/helpers/toFixed';


export default defineComponent({
  name: 'UnInfoField',
  components: {
    UnTooltip,
  },
  props: {
    symbol: {
      type: String,
      default: '-',
    },
    text: {
      type: String,
      default: '-',
    },
    value: {
      type: String,
      default: '-',
    },
  },
  setup: (props) => {
    const icon = CURRENCIES[props.symbol];

    const value_f = computed(() => {
      let value = +props.value;
      if (Number.isNaN(+value)) return props.value;
      if (+value.toFixed(5) === 0) return formatBalanceDisplay(value, 1e-6);
      value = +toFixed(props.value, 8);
      return formatToNumber(value, Infinity, false);
    });

    return {
      icon,
      value_f,
    };
  },
});
</script>

<style lang="scss">
.un-info-field {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background: #244199;
  border-radius: 41px;

  &__wrap {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  &__name {
    display: flex;
    align-items: center;
  }

  &__icon {
    width: 29px;
    height: 29px;
    margin-right: 10px;
  }

  &__text {
    font-size: 16px;
    font-weight: 500;
    line-height: 100%;

    @include media-gt(tablet) {
      font-size: 18px;
    }
  }

  &__value {
    display: flex;
    align-items: center;
    margin-left: 12px;
    overflow: hidden;
    font-size: 16px;
    font-weight: 600;
    line-height: 100%;

    @include media-gt(tablet) {
      font-size: 18px;
    }

    &-text {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &-tooltip {
      overflow: hidden;
      text-overflow: ellipsis;

      .un-tooltip__activator {
        width: 100%;
        overflow: hidden;
      }
    }
  }
}
</style>
