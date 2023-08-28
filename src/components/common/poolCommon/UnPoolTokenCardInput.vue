<template>
  <!-- eslint-disable vue/no-multiple-template-root -->

  <div
    class="un-pool-token-card-input"
    :class="{'is-disabled': disabled }"
  >
    <UnTooltip
      :content-text="modelValueFormatted"
      content-min-width="80px"
      :handler="!inputTooltip ? 'custom' : 'hover'"
      class="un-pool-token-card-input__input-tooltip"
    >
      <template #activator>
        <UnInput
          :model-value="modelValue"
          :decimals="decimals"
          placeholder="0.00"
          light
          small
          input-text-left
          :font-change="false"
          :autofocus="autofocus"
          :disabled="disabled"
          class="un-pool-token-card-input__input"
          @update:model-value="$emit('update:modelValue', $event)"
          @update:target="onCheckChange($event)"
        />
      </template>
    </UnTooltip>

    <UnTooltip
      :content-text="priceUsdFull"
      content-min-width="64px"
      :disabled="priceUsdFull === currencyValue"
      class="un-pool-token-card-input__currency-tooltip"
    >
      <template #activator>
        <div
          class="un-pool-token-card-input__currency"
          v-text="currencyValue"
        />
      </template>
    </UnTooltip>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { formatToCurrency } from '@/helpers/formatters';

import UnInput from '@/components/ui/UnInput.vue';
import UnTooltip from '@/components/ui/UnTooltip.vue';


export default defineComponent({
  name: 'UnPoolTokenCardInput',
  components: {
    UnInput,
    UnTooltip,
  },
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    decimals: {
      type: Number,
      required: true,
    },
    autofocus: Boolean,
    disabled: Boolean,
    priceUsdValue: Number,
  },
  emits: ['update:modelValue'],
  setup(props) {
    const priceUsdCompact = computed(() => (
      `~${formatToCurrency(props.priceUsdValue || 0, void 0, true)}`
    ));

    const priceUsdFull = computed(() => (
      `~${formatToCurrency(props.priceUsdValue || 0)}`
    ));

    const numberWithCommas = (x:string) => x.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    const modelValueFormatted = computed(() => {
      if (props.modelValue.includes('.')) {
        const [leftSide, rightSide] = props.modelValue.split('.');
        const leftFormatted = numberWithCommas(leftSide);
        return rightSide ? `${leftFormatted}.${rightSide}` : `${leftFormatted}.`;
      }
      return numberWithCommas(props.modelValue);
    });

    const currencyValue = computed(() => {
      const { priceUsdValue } = props;
      if (!priceUsdValue) return '~$0.00';
      return priceUsdValue < 1e7 ? priceUsdFull.value : priceUsdCompact.value;
    });

    const inputTooltip = ref(false);
    const onCheckChange = (e: HTMLInputElement) => {
      inputTooltip.value = (e.scrollWidth > e.clientWidth);
    };

    return {
      priceUsdFull,
      currencyValue,
      modelValueFormatted,
      inputTooltip,
      onCheckChange,
    };
  },
});
</script>

<style lang="scss">
.un-pool-token-card-input {
  $root: &;

  display: flex;
  align-items: center;
  min-height: 67px;
  padding: 15px 18px;
  line-height: 100%;
  text-align: start;
  background: #1d3582;
  border-radius: 15px;

  &__input {
    font-size: 24px;
    font-weight: 600;

    input {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &-tooltip {
      flex: 1 2 auto;
      overflow: hidden;
      text-overflow: ellipsis;

      .un-tooltip__activator {
        width: 100%;
        overflow: hidden;
      }
    }
  }

  &__currency {
    flex-shrink: 0;
    margin-left: 8px;
    overflow: hidden;
    font-size: 18px;
    color: #798dca;
    text-overflow: ellipsis;

    &-tooltip {
      flex: 1 0 auto;
      max-width: 50%;
      overflow: hidden;
      text-overflow: ellipsis;

      .un-tooltip__activator {
        width: 100%;
        overflow: hidden;
      }

      #{$root}__currency {
        flex-shrink: inherit;
      }
    }
  }
}
</style>
