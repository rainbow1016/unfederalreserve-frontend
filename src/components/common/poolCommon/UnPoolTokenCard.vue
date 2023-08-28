<template>
  <div class="un-pool-token-card__token-wrap">
    <div v-if="withPlus" class="un-pool-token-card__plus-icon-wrap">
      <img
        v-svg-inline
        :src="require(`@/assets/images/icons/plus.svg`)"
        class="un-pool-token-card__plus-icon"
      >
    </div>
    <UnCard
      no-padding
      dark
      class="un-pool-token-card"
    >
      <div class="un-pool-token-card__header">
        <UnPoolSelect
          v-if="options.length > 1"
          :selected="selected"
          :options="options"
          class="un-pool-token-card__select"
          data-testid="token-select"
          @change="$emit('update:symbol', $event.symbol)"
        />

        <UnToken
          v-else
          :symbol="selected.symbol"
          :icons="[selected.icon]"
        />

        <div
          v-if="!disabled"
          class="un-pool-token-card__balance-wrap"
        >
          <div
            class="un-pool-token-card__balance"
            data-testid="balance"
            v-text="balanceText"
          />
          <span
            class="un-pool-token-card__max"
            @click="onSetMax"
            v-text="'(Max)'"
          />
        </div>
      </div>

      <UnPoolTokenCardInput
        :model-value="inputValue"
        :decimals="selected.decimals"
        :price-usd-value="priceUsdValue"
        :autofocus="autofocus"
        :disabled="disabled"
        class="un-pool-token-card__input"
        @update:model-value="$emit('update:inputValue', $event)"
      />

      <div
        v-if="disabled"
        :class="{ 'is-select': options.length > 1 }"
        class="un-pool-token-card__un-lock-card"
      >
        <img
          v-svg-inline
          :src="require(`@/assets/images/icons/lock.svg`)"
          class="un-pool-token-card__un-lock-card__icon"
        >
        <div class="un-pool-token-card__un-lock-card__text" data-testid="locked-card">
          Your position will not earn fees or be used in trades
          until the market price rises by {{ priceRisesPercent }}.
          <br>Single-asset deposit only
        </div>
      </div>
    </UnCard>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { PoolToken } from '@/types/common.d';
import { formatToNumber } from '@/helpers/formatters';

import UnCard from '@/components/ui/UnCard.vue';
import UnToken from '@/components/common/UnToken.vue';

import UnPoolSelect from './UnPoolSelect.vue';
import UnPoolTokenCardInput from './UnPoolTokenCardInput.vue';


export default defineComponent({
  name: 'UnPoolTokenCard',
  components: {
    UnCard,
    UnPoolSelect,
    UnToken,
    UnPoolTokenCardInput,
  },
  props: {
    autofocus: Boolean,
    disabled: Boolean,
    withPlus: Boolean,
    inputValue: {
      type: String,
      required: true,
    },
    symbol: {
      type: String,
      required: true,
    },
    priceRisesPercent: {
      type: String,
      default: '3%',
    },
    options: {
      type: Array as PropType<PoolToken[]>,
      required: true,
    },
  },
  emits: [
    'update:symbol',
    'update:inputValue',
  ],
  setup(props, ctx) {
    const selected = computed(() => (
      props.options.find((_) => (
        _.symbol === props.symbol
      ))
    ));

    const balance = computed(() => {
      const tokenBalance = selected.value?.balance || '';
      return formatToNumber(+tokenBalance || 0);
    });

    const balanceText = computed(() => (
      `Balance: ${balance.value} ${props.symbol}`
    ));

    const priceUsdValue = computed(() => {
      const value = +props.inputValue * (selected.value?.price_usd || 0);
      return value;
    });

    const onSetMax = () => {
      const value = selected.value?.balance || '';
      ctx.emit('update:inputValue', value);
    };

    return {
      balanceText,
      priceUsdValue,
      selected,

      onSetMax,
    };
  },
});
</script>

<style lang="scss">
.un-pool-token-card {
  $root: &;

  position: relative;
  padding: 16px 18px 18px;

  @include media-gt(tablet) {
    padding: 25px;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  &__balance-wrap {
    display: flex;
    font-size: 10px;
    line-height: 100%;

    @include media-gt(tablet) {
      font-size: 12px;
    }
  }

  &__max {
    margin-left: 5px;
    color: $un-color-caribbean-green;
    text-transform: uppercase;
    cursor: pointer;
    transition: 0.2s color;

    &:hover {
      color: $un-color-green;
    }
  }

  &__select {
    z-index: 1;
  }

  &__plus-icon-wrap {
    position: absolute;
    top: -36px;
    left: 16px;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-items: center;
    width: 42px;
    height: 42px;
    background: #1d3582;
    border-radius: 100%;

    @include media-gt(tablet) {
      width: 50px;
      height: 50px;
    }

    &::after {
      position: inherit;
      right: 0;
      left: 0;
      width: calc(100% - 10px);
      height: calc(100% - 10px);
      margin: 0 auto;
      content: "";
      background: #244199;
      border-radius: 100%;
    }
  }

  &__plus-icon {
    z-index: 2;
    width: 18px;
    height: 18px;
    margin: 0 auto;
    color: #739efa;
  }

  &__token-wrap {
    position: relative;
  }

  &__un-lock-card {
    position: absolute;
    top: 65px;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    padding: 15px 20px 20px 40px;
    color: #fff;
    background: rgb(23, 48, 123);
    border-radius: 0 0 20px 20px;

    @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
      background: rgba(0, 11, 50, 0.2);
      backdrop-filter: blur(8px);
    }

    @include media-gt(tablet) {
      &.is-select {
        top: 75px;
      }
    }

    &__icon {
      width: 34px;
      min-width: 20px;
      height: 34px;
      min-height: 22px;
      margin-right: 30px;
    }

    &__text {
      font-size: 12px;
      line-height: 129.5%;
    }
  }
}
</style>
