<template>
  <!-- eslint-disable vue/no-v-model-argument -->

  <UnCard
    no-padding
    transparent-dark
    class="pool-remove-liquidity-main-card"
  >
    <PoolRemoveLiquidityHeader
      :token0="tokenAData"
      :token1="tokenBData"
      :in-range="inRange"
      :in-closed="isClosed"
      class="pool-remove-liquidity-main-card__header"
    />

    <PoolRemoveLiquiditySlider
      v-model:value="percentSlider"
      class="pool-remove-liquidity-main-card__slider"
    />

    <div class="pool-remove-liquidity-main-card__token-wrap">
      <UnInfoField
        :symbol="tokenAData.symbol"
        :text="`Pooled ${tokenAData.symbol}`"
        :value="tokenAData.value"
        class="pool-remove-liquidity-main-card__token"
      />
      <UnInfoField
        :symbol="tokenBData.symbol"
        :text="`Pooled ${tokenBData.symbol}`"
        :value="tokenBData.value"
        class="pool-remove-liquidity-main-card__token"
      />
    </div>

    <template v-if="unclaimed">
      <div class="pool-remove-liquidity-main-card__token-wrap">
        <UnInfoField
          :symbol="tokenAData.symbol"
          :text="`${tokenAData.symbol} Fees Earned`"
          :value="tokenAData.unclaimed"
          class="pool-remove-liquidity-main-card__token"
        />
        <UnInfoField
          :symbol="tokenBData.symbol"
          :text="`${tokenBData.symbol} Fees Earned`"
          :value="tokenBData.unclaimed"
          class="pool-remove-liquidity-main-card__token"
        />
      </div>
    </template>

    <UnSwitch
      v-if="withCollectAsWETH"
      v-model="asWETH"
      label="Collect as WETH"
      class="pool-remove-liquidity-main-card__switch"
    />

    <UnBtn
      text="REMOVE"
      :disabled="isDisabled"
      :loading="isLoading"
      class="pool-remove-liquidity-main-card__button"
      @click="onRemove"
    />
  </UnCard>
</template>

<script lang="ts">
// eslint-disable-next-line object-curly-newline
import { PropType, computed, defineComponent, ref } from 'vue';
import { Position } from '@/types/common.d';
import { getTokenData } from '../utils';
import { TransactionPoolRemoveLiquidity, transactionNotifyError } from '@/classes/transaction';

import UnCard from '@/components/ui/UnCard.vue';
import UnSwitch from '@/components/ui/UnSwitch.vue';
import UnBtn from '@/components/ui/UnBtn.vue';
import UnInfoField from '@/components/common/UnInfoField.vue';

import PoolRemoveLiquidityHeader from './PoolRemoveLiquidityHeader.vue';
import PoolRemoveLiquiditySlider from './PoolRemoveLiquiditySlider.vue';


export default defineComponent({
  name: 'PoolRemoveLiquidityMainCard',
  components: {
    UnCard,
    UnSwitch,
    UnBtn,
    UnInfoField,
    PoolRemoveLiquidityHeader,
    PoolRemoveLiquiditySlider,
  },
  props: {
    position: {
      type: Object as PropType<Position>,
      required: true,
    },
  },
  setup: (props) => {
    const percentSlider = ref(0);
    const asWETH = ref(false);
    const isLoading = ref(false);
    const transactionPoolRemoveLiquidity = new TransactionPoolRemoveLiquidity(props.position);

    const inRange = computed(() => props.position.inRange);
    const isClosed = computed(() => props.position.isClosed);

    const tokenAData = computed(() => {
      const { quote, amountQuote, unclaimedAmountQuote } = props.position;
      return getTokenData(
        quote,
        amountQuote,
        unclaimedAmountQuote,
        percentSlider.value,
        asWETH.value,
      );
    });

    const tokenBData = computed(() => {
      const { base, amountBase, unclaimedAmountBase } = props.position;
      return getTokenData(
        base,
        amountBase,
        unclaimedAmountBase,
        percentSlider.value,
        asWETH.value,
      );
    });

    const unclaimed = computed(() => (
      props.position.unclaimedUsd
    ));

    const isDisabled = computed(() => {
      if (percentSlider.value === 0) return true;
      return props.position.liquidityUsd === 0;
    });

    const withCollectAsWETH = computed(() => {
      const { quote, base } = props.position;
      return (
        !isClosed.value
        && (quote.symbol === 'WETH' || base.symbol === 'WETH')
      );
    });

    const onRemove = async () => {
      isLoading.value = true;

      const result = await transactionPoolRemoveLiquidity.getTransaction(
        percentSlider.value,
        asWETH.value,
      );

      if (result) {
        const isDone = await transactionPoolRemoveLiquidity.removeLiquidity(result, asWETH.value);
        if (isDone) percentSlider.value = 0;
      } else {
        const text = 'Error with remove position transaction';
        transactionNotifyError({ text });
      }

      isLoading.value = false;
    };

    return {
      isLoading,
      inRange,
      isClosed,
      isDisabled,

      tokenAData,
      tokenBData,
      unclaimed,

      withCollectAsWETH,
      asWETH,

      percentSlider,
      onRemove,
    };
  },
});
</script>

<style lang="scss">
.pool-remove-liquidity-main-card {
  padding: 27px 17px;

  @include media-lt(tablet) {
    margin-top: 22px;
  }

  @include media-gt(tablet) {
    padding: 30px;
  }

  &__header {
    margin-bottom: 24px;
  }

  &__token-wrap {
    & + & {
      margin-top: 20px;

      @include media-gt(tablet) {
        margin-top: 33px;
      }
    }
  }

  &__token {
    & + & {
      margin-top: 6px;

      @include media-gt(tablet) {
        margin-top: 8px;
      }
    }
  }

  &__switch {
    margin-top: 32px;

    @include media-gt(tablet) {
      margin-top: 25px;
    }
  }

  &__button {
    margin-top: 36px;

    @include media-gt(tablet) {
      margin-top: 25px;
    }
  }

  &__slider {
    margin-bottom: 34px;

    @include media-gt(tablet) {
      margin-bottom: 43px;
    }
  }
}
</style>
