<template>
  <div class="pool-position-header">
    <UnToken
      :icons="icons"
      :symbol="symbol"
      class="pool-position-header__token"
    />

    <div class="pool-position-header__buttons">
      <UnBtn
        v-if="!isClosed"
        :to="toRemove"
        danger
        outlined
        small
        font-size="12px"
        :uppercase="false"
        text="Remove Liquidity"
        class="pool-position-header__button"
      />

      <UnBtn
        :to="toIncrease"
        :href="isCtrlPressed ? href : void 0"
        outlined
        small
        font-size="12px"
        :uppercase="false"
        text="Increase Liquidity"
        class="pool-position-header__button"
      />
    </div>
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line object-curly-newline
import { PropType, computed, defineComponent, ref, onBeforeUnmount } from 'vue';
import { Position } from '@/types/common.d';
import { CURRENCIES } from '@/helpers/enums/currencies';
import {
  ROUTE_POOL_LIQUIDITY_INCREASE,
  ROUTE_POOL_LIQUIDITY_REMOVE,
} from '@/helpers/enums/routes';

import UnToken from '@/components/common/UnToken.vue';
import UnBtn from '@/components/ui/UnBtn.vue';


export default defineComponent({
  name: 'PoolPositionHeader',
  components: {
    UnToken,
    UnBtn,
  },
  props: {
    position: {
      type: Object as PropType<Position>,
      required: true,
    },
  },
  setup: (props) => {
    // eslint-disable-next-line object-curly-newline, vue/no-setup-props-destructure
    const { quote, base, tokenId, uniswapPool } = props.position;
    const isCtrlPressed = ref(false);
    const isClosed = computed(() => props.position.isClosed);

    const href = [
      'https://app.uniswap.org/#/increase',
      quote.address,
      base.address,
      uniswapPool.fee,
      tokenId,
    ].join('/');

    const onKeydown = (event: KeyboardEvent) => {
      isCtrlPressed.value = event.which === 17;
    };

    const onKeyup = () => {
      isCtrlPressed.value = false;
    };

    document.addEventListener('keydown', onKeydown);
    document.addEventListener('keyup', onKeyup);

    onBeforeUnmount(() => {
      document.removeEventListener('keydown', onKeydown);
      document.removeEventListener('keyup', onKeyup);
    });

    return {
      isClosed,
      href,
      isCtrlPressed,
      icons: [
        quote.symbol && CURRENCIES[quote.symbol],
        base.symbol && CURRENCIES[base.symbol],
      ].filter(Boolean),
      symbol: [
        quote.symbol?.replace(/^WETH$/, 'ETH') || 'UNKNOWN',
        base.symbol?.replace(/^WETH$/, 'ETH') || 'UNKNOWN',
      ].join('/'),
      toIncrease: {
        name: ROUTE_POOL_LIQUIDITY_INCREASE,
        params: { tokenId },
      },
      toRemove: {
        name: ROUTE_POOL_LIQUIDITY_REMOVE,
        params: { tokenId },
      },
    };
  },
});
</script>

<style lang="scss">
.pool-position-header {
  @include media-gt(tablet) {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__token {
    @include media-lt(tablet) {
      margin-bottom: 20px;
    }

    @include media-gte(tablet) {
      margin-right: 5px;
    }
  }

  &__buttons {
    display: flex;
    align-items: center;

    @include media-lt(tablet) {
      justify-content: space-between;
    }
  }

  &__button {
    font-weight: 500;

    @include media-lt(tablet) {
      width: calc(50% - 5px);
      font-size: 14px;
    }

    @include media-gt(tablet) {
      min-width: 150px;
    }

    & + & {
      @include media-gt(tablet) {
        margin-left: 5px;
      }
    }
  }
}
</style>
