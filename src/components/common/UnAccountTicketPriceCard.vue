<template>
  <!-- eslint-disable vue/no-multiple-template-root -->

  <div class="un-account-ticket-price-card">
    <div class="un-account-ticket-price-card__wrap">
      <div
        class="un-account-ticket-price-card__name"
        v-text="tokenData.title"
      />
      <UnInput
        :model-value="modelValue"
        :decimals="tokenData.decimals"
        placeholder="0"
        small
        :disabled="disabled"
        class="un-account-ticket-price-card__value-input"
        data-testid="price-input"
        @change="onChangeValue"
        @focus="modelValue = value"
        @blur="formatValue(value === modelValue)"
      />

      <div
        class="un-account-ticket-price-card__help-text"
        v-text="tokenData.currencyText"
      />

      <div
        class="un-account-ticket-price-card__price-usd"
        v-text="tokenData.priceUsd"
      />

      <div class="un-account-ticket-price-card__percent">
        <button
          v-show="!disabled"
          class="un-account-ticket-price-card__percent-button is-minus"
          @click="$emit('decrement')"
        />

        <UnInput
          v-model="percentValue"
          :decimals="3"
          placeholder="0%"
          small
          percentage
          :disabled="disabled"
          class="un-account-ticket-price-card__percent-input"
          data-testid="percent-input"
          @change="onChangePercent"
          @focus="percentValue = percent"
          @blur="formatPercent(percentValue === percent)"
        />

        <button
          v-show="!disabled"
          class="un-account-ticket-price-card__percent-button  is-plus"
          @click="$emit('increment')"
        />
      </div>

      <div
        class="un-account-ticket-price-card__help-text"
        v-text="'Changes from current price'"
      />
    </div>

    <div
      class="un-account-ticket-price-card__help-text"
      v-text="tokenData.helpText"
    />
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line object-curly-newline
import { defineComponent, PropType, ref, watch } from 'vue';
import { PoolToken } from '@/types/common.d';
import { formatNumberToStringNumber } from '@/helpers/formatUnits';

import UnInput from '@/components/ui/UnInput.vue';


export default defineComponent({
  name: 'UnAccountTicketPriceCard',
  components: {
    UnInput,
  },
  props: {
    tokenData: {
      type: Object as PropType<PoolToken>,
      required: true,
      validator: (prop: PoolToken) => (
        prop
        && 'title' in prop
        && 'decimals' in prop
        && 'currencyText' in prop
        && 'helpText' in prop
      ),
    },
    disabled: Boolean,
    value: {
      type: String,
      required: true,
    },
    value_f: {
      type: String,
      required: true,
    },
    percent: {
      type: Number,
      required: true,
    },
    percent_f: {
      type: String,
      required: true,
    },
    tokenPrice: {
      type: Number,
      required: true,
    },
  },
  emits: ['update:value', 'decrement', 'increment'],
  setup(props, ctx) {
    const percentValue = ref('');
    const modelValue = ref('');

    const formatPercent = () => {
      percentValue.value = props.percent_f;
    };

    const formatValue = () => {
      modelValue.value = props.value_f;
    };

    const updateValue = (value: number) => {
      if (value > 0 && value !== +props.value) {
        const valueString = formatNumberToStringNumber(value);
        ctx.emit('update:value', valueString);
      } else {
        ctx.emit('update:value', props.value);
        formatPercent();
      }
    };

    const onChangeValue = (value: string) => {
      if (+value > 0) {
        ctx.emit('update:value', value);
      } else {
        ctx.emit('update:value', props.tokenPrice);
      }
    };

    const onChangePercent = () => {
      const newPercent = percentValue.value;
      const value = (((+newPercent / 100) + 1) * props.tokenPrice);
      updateValue(value);
    };

    watch(() => props.percent, formatPercent, { immediate: true });
    watch(() => props.value, formatValue, { immediate: true });

    return {
      percentValue,
      modelValue,

      onChangeValue,
      onChangePercent,
      formatValue,
      formatPercent,
    };
  },
});
</script>

<style lang="scss">
.un-account-ticket-price-card {
  font-size: 12px;
  font-weight: 500;
  line-height: 100%;
  text-align: center;

  &__wrap {
    padding: 15px 5px 11px;
    margin-bottom: 11px;
    background: #17307b;
    border-radius: 20px;

    @include media-gt(tablet) {
      padding: 15px 10px;
    }
  }

  &__name {
    margin-bottom: 9px;
  }

  &__value-input {
    min-height: 38px;
  }

  &__percent {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 30px;
    margin: 23px 0 16px;
    font-size: 14px;
    font-weight: 600;
    line-height: 100%;

    @include media-gt(tablet) {
      min-height: 44px;
      margin: 13px 0 6px;
      font-size: 24px;
    }

    &-button {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 29px;
      height: 29px;
      padding: 10px;
      cursor: pointer;
      background: #1d3582;
      border: 1px solid #1d3582;
      border-radius: 5px;

      @include media-gt(tablet) {
        width: 44px;
        height: 44px;
        border-radius: 10px;
      }

      &:hover {
        border-color: #4a6bce;
      }

      &:active {
        border-color: #739efa;
      }

      &::before,
      &::after {
        position: absolute;
        width: 45%;
        height: 2.5px;
        background-color: #739efa;
      }

      &.is-minus::before,
      &.is-plus::before {
        content: "";
      }

      &.is-plus::after {
        content: "";
        transform: rotate(90deg);
      }
    }

    &-input {
      max-width: 109px;
      padding: 0;
      margin: 0 5px;
      background: #1d3582;
      border-radius: 5px;

      @include media-gt(tablet) {
        padding: 5px 0;
        margin: 0 7px;
        border-radius: 10px;
      }
    }
  }

  &__help-text {
    max-width: 92%;
    margin: 5px auto 0;
    line-height: 123%;
    color: #739efa;

    @include media-gt(tablet) {
      max-width: 200px;
    }
  }

  &__tooltip {
    text-align: center;
  }

  &__price-usd {
    margin: 9px 0 0;
    font-size: 16px;
    line-height: 100%;
  }
}
</style>
