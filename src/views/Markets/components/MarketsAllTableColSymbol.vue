<template>
  <div class="markets-all-table-col-symbol">
    <div class="markets-all-table-col-symbol__icon">
      <img
        v-if="icon"
        class="markets-all-table-col-symbol__icon-symbol"
        :src="icon"
        :alt="symbol_f"
      >
    </div>

    <div class="markets-all-table-col-symbol__info">
      <div
        class="markets-all-table-col-symbol__name"
        v-html="nameParsed"
      />
      <div
        class="markets-all-table-col-symbol__symbol"
        v-text="symbol_f"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { formatSymbol } from '@/helpers/formatters/legacy';
import { CURRENCIES } from '@/helpers/enums/currencies';
import { useBreakpoints } from '@/composable';


export default defineComponent({
  name: 'MarketsAllTableColSymbol',
  inheritAttrs: false,
  props: {
    symbol: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  setup: (props) => {
    const icon = CURRENCIES[props.symbol];
    const symbol_f = formatSymbol(props.symbol);
    const nameParsed = props.name
      .replace(/(token)/gi, '')
      .replace(/(UnFederal)/gi, '$1&shy').replace(/\s&shy/g, '')
      .replace(/(Un)/gi, 'un');

    const { isTablet } = useBreakpoints();

    return {
      icon,
      symbol_f,
      nameParsed,
      isTablet,
    };
  },
});
</script>

<style lang="scss">
.markets-all-table-col-symbol {
  display: flex;
  align-items: center;

  @include media-lte(tablet) {
    align-items: flex-start;
  }

  &__name {
    font-size: 15px;
    line-height: 26px;

    @include media-lte(tablet) {
      margin-bottom: 4px;
      font-size: 13px;
      font-weight: 600;
      line-height: 19px;
      word-break: break-word;
    }
  }

  &__symbol {
    font-size: 12px;
    font-weight: 500;
    line-height: 26px;

    @include media-lte(tablet) {
      line-height: 18px;
    }
  }

  &__icon {
    display: flex;
    align-items: center;
    width: 45px;
    height: 45px;
    margin-right: 15px;

    @include media-lte(tablet) {
      width: 16px;
      height: 16px;
      margin: 2px 7px 0 0;
    }

    &-symbol {
      width: 45px;

      @include media-lte(tablet) {
        width: 16px;
      }
    }
  }
}
</style>
