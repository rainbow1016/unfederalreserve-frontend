<template>
  <div class="un-modal-transaction-input">
    <div class="un-modal-transaction-input__left">
      <img
        v-if="icon"
        :src="icon"
        class="un-modal-transaction-input__icon"
      >
      <div class="un-modal-transaction-input__input-wrapper">
        <UnInput
          :model-value="modelValue"
          :decimals="decimals"
          placeholder="0.00"
          light
          small
          autofocus
          input-text-left
          class="un-modal-transaction-input__input"
          @update:model-value="$emit('update:modelValue', $event)"
        />
        <div
          class="un-modal-transaction-input__input-usd-value"
          v-text="priceUsdFormated"
        />
      </div>
    </div>
    <div class="un-modal-transaction-input__right">
      <div
        v-if="!!btnLabel"
        class="un-modal-transaction-input__btn"
        @click="$emit('set-max')"
      >
        <UnTooltip
          :disabled="!btnTooltip"
          :content-text="btnTooltip"
          content-width="220px"
        >
          <template #activator>
            <div
              :class="{ 'is-active': max }"
              class="un-modal-transaction-input__btn-label"
              data-testid="btn-set-max"
              v-html="btnLabel"
            />
          </template>
        </UnTooltip>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { CURRENCIES } from '@/helpers/enums/currencies';
import { formatToCurrency } from '@/helpers/formatters';

import UnTooltip from '@/components/ui/UnTooltip.vue';
import UnInput from '@/components/ui/UnInput.vue';

const bil = 1e9; // 1 billion
export default defineComponent({
  name: 'UnModalTransactionInput',
  components: {
    UnTooltip,
    UnInput,
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
    max: Boolean,
    btnTooltip: String,
    btnLabel: String,
    symbol: String,
    priceUsd: {
      type: Number,
      default: 0.00,
    },
  },
  emits: [
    'update:modelValue',
    'set-max',
  ],
  setup(props) {
    const priceUsdFormated = computed(() => (
      props.priceUsd < bil ? `~${formatToCurrency(props.priceUsd)}` : `~${formatToCurrency(props.priceUsd, 2, true)}`
    ));

    return {
      icon: props.symbol && CURRENCIES[props.symbol],
      priceUsdFormated,
    };
  },
});
</script>

<style lang="scss">
.un-modal-transaction-input {
  position: relative;
  display: flex;
  align-items: center;
  height: 75px;
  padding: 0 20px;
  background: #1a327c;
  border-radius: 10px;

  @include media-gt(tablet) {
    margin-top: 20px;
  }

  &__left {
    display: flex;
    align-items: flex-start;
    width: 88%;
  }

  &__right {
    width: 12%;
    text-align: center;
  }

  &__input-wrapper {
    width: calc(100% - 40px);
  }

  &__input {
    height: 100%;
  }

  &__input-usd-value {
    width: 100%;
    font-size: 13px;
    font-weight: 500;
    color: #739efa;
  }

  &__icon {
    width: 27px;
    height: 27px;
    margin-top: 8px;
    margin-right: 13px;
  }

  &__btn-label {
    font-size: 15px;
    font-weight: 600;
    color: #739efa;
    text-align: center;
    cursor: pointer;
    transition: color 0.2s;

    &.is-active,
    &:hover {
      color: $un-color-royal-blue;
    }

    &.is-active {
      pointer-events: none;
    }
  }
}
</style>
