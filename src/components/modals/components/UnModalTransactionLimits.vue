<template>
  <div
    class="un-modal-transaction-limits"
    :class="{ 'is-blue': blue }"
  >
    <template v-for="(item, index) in list" :key="index">
      <div
        class="un-modal-transaction-limits__item"
        :class="[item.class, { 'is-lined': lined }]"
        :data-testid="item.name"
      >
        <div
          class="un-modal-transaction-limits__item-name"
          :class="{ 'is-reverse': item.iconRight }"
        >
          <UnTooltip
            bordered
            :disabled="!item.tooltipText"
            :content-text="item.tooltipText"
            content-width="250px"
            :activator-text="item.name"
          />
          <template v-if="item.icon || item.iconRight">
            <img
              v-if="getCurrencyName(item)"
              v-svg-inline
              :src="getIconSource(item)"
              :class="`is-type--${getCurrencyName(item)}`"
              class="un-modal-transaction-limits__item-name__icon"
            >
            <img
              v-else
              :src="getIconSource(item)"
              class="un-modal-transaction-limits__item-name__icon"
            >
          </template>
        </div>

        <UnSkeleton
          v-if="skeleton"
          height="16px"
          width="70px"
          class="un-modal-transaction-limits__skeleton"
        />

        <div
          v-else
          class="un-modal-transaction-limits__item-value"
          data-testid="value"
          :style="{ color: item.color }"
        >
          <span>{{ item.from_f }}</span>

          <template v-if="item.to !== void 0">
            <span
              class="un-modal-transaction-limits__item-value__icon-arrow"
              v-html="require('!raw-loader!@/assets/images/icons/arrow-right.svg').default"
            />
            <UnModalTransactionLimitsWarning
              v-if="item.warning"
              :value="item.to_f"
            />
            <span>{{ item.to_f }}</span>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { CURRENCIES } from '@/helpers/enums/currencies';
import { ITransactionLimit } from '@/classes/transaction';

import UnTooltip from '@/components/ui/UnTooltip.vue';
import UnSkeleton from '@/components/ui/UnSkeleton.vue';
import UnModalTransactionLimitsWarning from './UnModalTransactionLimitsWarning.vue';


const getIconSource = (data: ITransactionLimit) => {
  const icon = data.icon || data.iconRight;
  if (!icon) return null;

  if (icon.includes('data:image')) return icon;
  if (/\.svg$/.test(icon)) return icon;

  return CURRENCIES[icon];
};

const getCurrencyName = (data: ITransactionLimit) => {
  const icon = data.icon || data.iconRight;
  if (!icon) return null;

  if (icon.includes('data:image')) return null;
  if (/\.svg$/.test(icon)) return null;

  return CURRENCIES[icon] && icon;
};

export default defineComponent({
  name: 'UnModalTransactionLimits',
  components: {
    UnTooltip,
    UnSkeleton,
    UnModalTransactionLimitsWarning,
  },
  props: {
    skeleton: Boolean,
    title: {
      type: String,
    },
    lined: {
      type: Boolean,
    },
    blue: {
      type: Boolean,
    },
    list: {
      type: Array as PropType<ITransactionLimit[]>,
      required: true,
      validator: ([prop]: ITransactionLimit[]) => (
        prop
        && 'name' in prop
      ),
    },
    info: {
      type: Object,
    },
    itemClass: [String, Array, Object],
  },
  setup() {
    return {
      getIconSource,
      getCurrencyName,
    };
  },
});
</script>

<style lang="scss">
.un-modal-transaction-limits {
  $root: &;

  &.is-blue {
    margin-bottom: 24px;
    color: #fff;
    border: 1px solid #1a327c;
    border-radius: 10px;

    #{$root}__item {
      padding: 10px 16px;
      margin: 0;

      &.is-lined {
        border-bottom: 1px solid #1a327c;
      }
    }
  }

  &__item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 10px 10px 0;
    margin-top: 10px;

    &.is-lined {
      border-bottom: 2px solid $un-color-grey-0;
    }

    @include media(tablet) {
      padding: 0 0 10px 0;
      margin-top: 16px;
    }

    &:last-child {
      border-bottom: none;
    }

    &.is-reverse {
      flex-direction: row-reverse;
    }

    &-name {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 14px;
      font-weight: 600;
      line-height: 26px;

      &.with-tooltip {
        border-bottom: 1px dashed #739efa;
      }

      @include media(tablet) {
        font-size: 15px;
      }
    }

    &-name__icon {
      width: 18px;
      height: 18px;
      margin-left: 7px;

      .is-reverse > & {
        margin-right: 0;
        margin-left: 7px;
      }
    }

    &-value {
      display: flex;
      flex-wrap: wrap;
      font-size: 16px;
      font-weight: 600;
      line-height: 26px;

      @include media-lt(tablet) {
        font-size: 14px;
      }
    }

    &-value__icon-arrow {
      margin: 0 5px;
    }
  }

  &__skeleton {
    margin: 5px 0 6px;
  }
}
</style>
