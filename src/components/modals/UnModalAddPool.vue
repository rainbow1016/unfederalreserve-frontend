<template>
  <UnModalLayout
    dark
    :mobile-full-screen="false"
    class="un-modal-add-pool"
  >
    <template #header>
      <div class="un-modal-add-pool__header">
        <h3
          class="un-modal-add-pool__title"
          v-text="position ? 'Add more Liquidity' : 'Add Liquidity Position'"
        />
        <UnBadge
          :in-range="inRange"
          :out-of-range="!inRange"
          in-range-with-bg
          class="un-modal-add-pool__badge"
        />
      </div>
    </template>

    <UnAttentionCard
      v-if="!inRange && !position"
      class="un-modal-add-pool__attention-card"
    >
      <template #text>
        <strong>No immediate APY.</strong>
        You will start earning once the eRSDL price rises by {{ priceRisesPercent }}
      </template>
    </UnAttentionCard>

    <UnAttentionCard
      v-if="!isInitializedPool"
      class="un-modal-add-pool__attention-card"
    >
      <template #text>
        This pool must be initialized before you can add liquidity.
        <!--
        To initialize, select a starting price for the pool.
        Then, enter your liquidity price range and deposit amount.
        -->
        Gas fees will be higher than usual due to the initialization transaction.
      </template>
    </UnAttentionCard>

    <UnInfoField
      :symbol="tokenA.symbol"
      :value="valueA"
      class="un-modal-add-pool__info-field"
    />
    <UnInfoField
      :symbol="tokenB.symbol"
      :value="valueB"
      class="un-modal-add-pool__info-field"
    />

    <UnAccountTicket
      :left-range="leftRange"
      :right-range="rightRange"
      :token-a="tokenA"
      :token-b="tokenB"
      :token-price="tokenPrice"
      :fee="fee"
      with-tabs
      title="Price Range"
      class="un-modal-add-pool__account-ticket"
    />

    <template #footer>
      <UnBtn
        text="ADD"
        :loading="isLoading"
        class="un-modal-add-pool__button"
        data-testid="add-pool"
        @click="onTransactionAction"
      />
    </template>
  </UnModalLayout>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { Position, PoolToken } from '@/types/common.d';
import {
  TransactionPoolAddPosition,
  transactionNotifyError,
} from '@/classes/transaction';
import { useV3DerivedMintInfo, FieldTypes } from '@/classes/Position/useV3DerivedMintInfo';
import { POOL_SUPPORTED_FEES } from '@/helpers/enums/pools';

import UnBtn from '@/components/ui/UnBtn.vue';
import UnAttentionCard from '@/components/common/UnAttentionCard.vue';
import UnInfoField from '@/components/common/UnInfoField.vue';
import UnAccountTicket from '@/components/common/UnAccountTicket.vue';
import UnModalLayout from '@/components/modals/UnModalLayout.vue';
import UnBadge from '@/components/ui/UnBadge.vue';


export default defineComponent({
  name: 'UnModalAddPool',
  components: {
    UnBtn,
    UnModalLayout,
    UnAttentionCard,
    UnInfoField,
    UnAccountTicket,
    UnBadge,
  },
  props: {
    tokenA: {
      type: Object as PropType<PoolToken>,
      required: true,
    },
    tokenB: {
      type: Object as PropType<PoolToken>,
      required: true,
    },
    tokenPrice: {
      type: String,
      required: true,
    },
    priceRisesPercent: {
      type: String,
      required: true,
    },
    leftRange: {
      type: String,
      required: true,
    },
    rightRange: {
      type: String,
      required: true,
    },
    fee: {
      type: Number as PropType<typeof POOL_SUPPORTED_FEES[number]>,
      required: true,
      validator: (prop: typeof POOL_SUPPORTED_FEES[number]) => (
        POOL_SUPPORTED_FEES.includes(prop)
      ),
    },
    position: {
      type: Object as PropType<Position>,
    },
  },
  emits: ['close'],
  setup: (props, ctx) => {
    const isLoading = ref(false);
    const inRange = ref(false);
    const isInitializedPool = ref(true);

    const valueA = ref(props.tokenA.value);
    const valueB = ref(props.tokenB.value);

    void (async () => {
      // eslint-disable-next-line no-nested-ternary
      const independentField = +props.tokenA.value > 0
        ? FieldTypes.CurrencyA
        : +props.tokenB.value > 0 ? FieldTypes.CurrencyB : FieldTypes.CurrencyA;

      const mintInfo = await useV3DerivedMintInfo(
        props.tokenA,
        props.tokenB,
        props.leftRange,
        props.rightRange,
        props.fee,
        props.position?.positionData,
        props.position && independentField,
      );

      inRange.value = !mintInfo.outOfRange;
      isInitializedPool.value = !!mintInfo.uniswapPoolFined;

      [
        valueA.value = valueA.value,
        valueB.value = valueB.value,
      ] = mintInfo.invertPrice
        ? [mintInfo.amount1, mintInfo.amount0]
        : [mintInfo.amount0, mintInfo.amount1];
    })();

    const transactionPoolAddPosition = new TransactionPoolAddPosition(
      props.tokenA,
      props.tokenB,
    );

    const onTransactionAction = async () => {
      isLoading.value = true;

      const result = await transactionPoolAddPosition.getTransaction(
        props.leftRange,
        props.rightRange,
        props.fee,
        props.position,
      );

      if (result) {
        const positionData = {
          tokenA: props.tokenA,
          tokenB: props.tokenB,
          minPrice: props.leftRange,
          maxPrice: props.rightRange,
          fee: props.fee,
          inRange: inRange.value,
          tokenId: props.position?.tokenId,
          isClosed: false,
        };

        const promise = transactionPoolAddPosition.addPosition(
          result,
          positionData,
          props.position,
        );
        ctx.emit('close', promise);
        await promise;
      } else {
        const text = 'Error with creation position transaction';
        transactionNotifyError({ text });
      }

      isLoading.value = false;
    };

    return {
      isLoading,
      inRange,
      isInitializedPool,

      valueA,
      valueB,

      onTransactionAction,
    };
  },
});
</script>

<style lang="scss">
.un-modal-add-pool {
  @include media-gt(tablet) {
    max-width: 540px;
  }

  &__attention-card {
    margin-bottom: 13px;
  }

  &__info-field {
    margin: 4px 0;
  }

  &__button {
    margin-bottom: 15px;
  }

  &__account-ticket {
    margin: 20px 0 0;
  }

  &__header {
    @include media-lt(tablet) {
      text-align: start;
    }

    @include media-gt(tablet) {
      display: flex;
      align-items: center;
    }
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    line-height: 144%;

    @include media-lt(tablet) {
      margin-bottom: 3px;
    }

    @include media-gt(tablet) {
      margin-right: 12px;
      font-size: 20px;
    }
  }

  &__badge {
    margin: 3px 0 6px;

    @include media-lt(tablet) {
      display: inline-flex;
    }
  }
}
</style>
