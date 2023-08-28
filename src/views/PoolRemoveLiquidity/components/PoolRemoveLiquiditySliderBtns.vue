<template>
  <div class="pool-remove-liquidity-slider-btns">
    <div
      v-for="item in buttonList"
      :key="item.label"
      class="pool-remove-liquidity-slider-btns__percent"
      @click="onClick(item.value)"
      v-text="item.label"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';


const BUTTON_LIST = [
  { label: '25%', value: 25 },
  { label: '50%', value: 50 },
  { label: '75%', value: 75 },
  { label: '100%', value: 100 },
];

export default defineComponent({
  name: 'PoolRemoveLiquiditySliderBtns',
  emits: ['update:value'],
  setup(props, ctx) {
    const onClick = (value: number) => {
      ctx.emit('update:value', value);
    };

    return {
      buttonList: BUTTON_LIST,
      onClick,
    };
  },
});
</script>

<style lang="scss">
.pool-remove-liquidity-slider-btns {
  display: flex;
  align-items: center;

  &__percent {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-width: 64px;
    height: 33px;
    font-size: 16px;
    font-weight: 600;
    line-height: 26px;
    color: #37f;
    background: rgba(51, 119, 255, 0.15);
    border: 1px solid #37f;
    border-radius: 6px;

    & + & {
      margin-left: 8px;
    }

    &:hover {
      cursor: pointer;
    }
  }
}
</style>
