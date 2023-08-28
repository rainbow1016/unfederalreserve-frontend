<template>
  <div
    :class="{
      'is-small': small,
    }"
    class="un-token"
  >
    <div
      v-if="iconsCalc"
      class="un-token__wrap"
    >
      <img
        v-for="item in iconsCalc"
        :key="item"
        :src="item"
        class="un-token__icon"
      >
    </div>
    <div
      :data-testid="symbol"
      class="un-token__name"
      v-text="symbol ? symbol : '----'"
    />
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent, computed } from 'vue';
import { CURRENCIES } from '@/helpers/enums/currencies';


export default defineComponent({
  name: 'UnToken',
  props: {
    icons: Array as PropType<string[]>,
    symbols: Array as PropType<string[]>,
    symbol: String,
    small: Boolean,
  },
  setup: (props) => {
    const iconsCalc = computed(() => (
      props.icons
      || props.symbols?.map((symbol) => (
        CURRENCIES[symbol]
      ))
    ));

    return {
      iconsCalc,
    };
  },
});
</script>

<style lang="scss">
.un-token {
  $root: &;

  display: flex;
  align-items: center;

  &__wrap {
    display: flex;
    align-items: center;
    margin-right: 6px;

    @include media-gt(tablet) {
      margin-right: 11px;
    }
  }

  &__icon {
    width: 30px;
    height: 30px;
    margin-right: 2px;

    #{$root}.is-small & {
      width: 20px;
      height: 20px;
    }
  }

  &__name {
    font-size: 16px;
    font-weight: 500;
    line-height: 100%;

    @include media-gt(tablet) {
      font-size: 18px;
    }

    #{$root}.is-small & {
      font-size: 14px;
    }
  }
}
</style>
