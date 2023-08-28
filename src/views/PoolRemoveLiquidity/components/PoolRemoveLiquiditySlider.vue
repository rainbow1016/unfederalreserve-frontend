<template>
  <div class="pool-remove-liquidity-slider">
    <h5 class="pool-remove-liquidity-slider__header" v-text="'Amount'" />

    <div class="pool-remove-liquidity-slider__wrap">
      <div
        class="pool-remove-liquidity-slider__value"
        v-text="value + '%'"
      />

      <PoolRemoveLiquiditySliderBtns
        v-if="!isTablet"
        class="pool-remove-liquidity-slider__btns"
        @update:value="onClick"
      />
    </div>

    <UnSlider
      :model-value="value"
      :min="0"
      :max="100"
      class="pool-remove-liquidity-slider__slider"
      @update:model-value="onClick"
    />

    <PoolRemoveLiquiditySliderBtns
      v-if="isTablet"
      class="pool-remove-liquidity-slider__btns is-bottom"
      @update:value="onClick"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useBreakpoints } from '@/composable';

import UnSlider from '@/components/ui/UnSlider.vue';
import PoolRemoveLiquiditySliderBtns from './PoolRemoveLiquiditySliderBtns.vue';


export default defineComponent({
  name: 'PoolRemoveLiquiditySlider',
  components: {
    UnSlider,
    PoolRemoveLiquiditySliderBtns,
  },
  props: {
    value: Number,
  },
  emits: ['update:value'],
  setup(props, ctx) {
    const { isTablet } = useBreakpoints();

    const onClick = (value: number) => {
      ctx.emit('update:value', value);
    };

    return {
      isTablet,
      onClick,
    };
  },
});
</script>

<style lang="scss">
.pool-remove-liquidity-slider {
  &__header {
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: 500;
    line-height: 100%;

    @include media-gt(tablet) {
      margin-bottom: 22px;
    }
  }

  &__wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;
  }

  &__value {
    font-size: 51px;
    font-weight: 600;
    line-height: 84.5%;
  }

  &__btns {
    &.is-bottom {
      margin-top: 36px;
    }
  }
}
</style>
