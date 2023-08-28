<template>
  <!-- eslint-disable vue/no-multiple-template-root -->

  <div
    class="market-details-input"
    :class="{'is-disabled': disabled }"
  >
    <UnInput
      :model-value="modelValue"
      :decimals="decimals"
      placeholder="0.0"
      :label="inputLabel"
      dark
      autofocus
      :disabled="disabled"
      class="market-details-input__input"
      @update:model-value="onInput"
    />

    <div
      v-if="!!btnLabel"
      class="market-details-input__btn"
      @click="onSetMax(100)"
    >
      <UnTooltip
        :disabled="!btnTooltip || disabled"
        :content-text="btnTooltip"
        content-width="280px"
      >
        <template #activator>
          <div
            :class="{ 'is-active': max }"
            class="market-details-input__btn-label"
            data-testid="btn-set-max"
            v-html="btnLabel"
          />
        </template>
      </UnTooltip>
    </div>
    <div
      class="market-details-input__currency"
      v-text="priceUsd"
    />
  </div>

  <div class="market-details-input__percents">
    <div
      v-for="(item, index) in percentList"
      :key="index"
      :class="{
        'is-active': item.active,
        'is-disabled': disabled,
      }"
      class="market-details-input__percent"
      @click="onSetMax(item.value)"
    >
      <div
        class="market-details-input__percent-label"
        v-text="item.label"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';

import UnTooltip from '@/components/ui/UnTooltip.vue';
import UnInput from '@/components/ui/UnInput.vue';


const PERCENT_LIST = [25, 50, 75, 100];

export default defineComponent({
  name: 'MarketDetailsInput',
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
    disabled: Boolean,
    btnTooltip: String,
    btnLabel: String,
    inputLabel: String,
    priceUsd: String,
  },
  emits: [
    'update:modelValue',
    'set-max',
  ],
  setup: (props, ctx) => {
    const activePercent = ref(0);

    const percentList = computed(() => PERCENT_LIST.map((value) => ({
      label: `${value}%`,
      value,
      active: activePercent.value >= value,
    })));

    const onInput = (value: string) => {
      activePercent.value = 0;
      ctx.emit('update:modelValue', value);
    };

    const onSetMax = (value: number) => {
      if (props.disabled) return;
      activePercent.value = value;
      ctx.emit('set-max', value / 100);
    };

    return {
      percentList,
      onInput,
      onSetMax,
    };
  },
});
</script>

<style lang="scss">
.market-details-input {
  $root: &;

  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 111px;
  padding: 10px 64px 22px 0;
  margin-bottom: 27px;
  border-bottom: 2px solid $un-color-blue-7;

  @include media-gt(tablet) {
    margin-top: 20px;
  }

  &__input {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
  }

  &__btn {
    position: absolute;
    right: 10px;
  }

  &__btn-label {
    font-size: 18px;
    font-weight: bold;
    line-height: 26px;
    color: $un-color-soft-gray;
    text-align: right;
    cursor: pointer;

    &.is-active {
      color: $un-color-accent-3;
      pointer-events: none;
    }
  }

  &.is-disabled {
    pointer-events: none;

    #{$root}__btn-label,
    #{$root}__input {
      color: $un-color-blue-6;
      pointer-events: none;
    }
  }

  &__currency {
    position: absolute;
    right: 0;
    bottom: 10px;
    left: 0;
    font-size: 15px;
    font-weight: 600;
    line-height: 26px;
    color: $un-color-blue-6;
    text-align: center;
    pointer-events: none;
  }

  &__percents {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__percent {
    position: relative;
    width: calc(25% - 5px);
    padding-top: 13px;
    text-align: center;
    cursor: pointer;

    &::before {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      width: 100%;
      height: 7px;
      content: "";
      background-color: $un-color-blue-6;
      border-radius: 6px;
    }

    &-label {
      font-size: 16px;
      font-weight: 600;
      line-height: 26px;
      color: $un-color-blue-6;
    }

    &.is-disabled {
      pointer-events: none;
    }

    &.is-active {
      &::before {
        background-color: $un-color-accent-2;
      }

      #{$root}__percent-label {
        color: $un-color-accent-2;
      }
    }
  }
}
</style>
