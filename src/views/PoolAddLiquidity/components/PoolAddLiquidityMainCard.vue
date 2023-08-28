<template>
  <!-- eslint-disable vue/no-v-model-argument -->

  <UnCard
    no-padding
    transparent-dark
    class="pool-add-liquidity-main-card"
  >
    <PoolIncreaseLiquidityHeader
      v-if="position"
      :position="position"
      class="pool-add-liquidity-main-card__header"
    />

    <PoolAddLiquidityHeader
      v-else
      v-model:singleSide="isSingleSide"
      :price-rises-percent="priceRisesPercent"
      class="pool-add-liquidity-main-card__header"
    />

    <UnPoolTokenCard
      v-model:inputValue="tokenA.value"
      :symbol="tokenA.symbol"
      :options="tokenOptionsA"
      :disabled="depositADisabled || isMaxLessMin"
      :price-rises-percent="priceRisesPercent"
      :data-testid="`${tokenA.symbol}-card`"
      class="pool-add-liquidity-main-card__token"
      @update:symbol="$emit('update:tokenIdA', $event)"
      @update:input-value="onUpdateInput('tokenA')"
    />

    <UnPoolTokenCard
      v-model:inputValue="tokenB.value"
      :with-plus="!position"
      :symbol="tokenB.symbol"
      :options="tokenOptionsB"
      :disabled="depositBDisabled || isMaxLessMin"
      :price-rises-percent="priceRisesPercent"
      :data-testid="`${tokenB.symbol}-card`"
      class="pool-add-liquidity-main-card__token"
      @update:symbol="$emit('update:tokenIdB', $event)"
      @update:input-value="onUpdateInput('tokenB')"
    />

    <UnAccountTicket
      v-model:leftRange="leftRange"
      v-model:rightRange="rightRange"
      v-model:advanceMode="advanceMode"
      :token-a="tokenA"
      :token-b="tokenB"
      :token-price="tokenPrice"
      :fee="fee"
      with-tabs
      :with-advanced="!isSingleSide && !position"
      title="Price Range"
      class="pool-add-liquidity-main-card__account-ticket"
      @update:left-range="onUpdateRange"
      @update:right-range="onUpdateRange"
      @decrement="onDecrementRange"
      @increment="onIncrementRange"
    />

    <div v-if="transaction" class="un-row is-dense">
      <div v-if="transaction.isApprovedA" class="un-col">
        <UnBtn
          data-testid="approve-button"
          :text="transaction.btnTextA"
          :loading="isLoadingA"
          :uppercase="false"
          @click="onApproveA"
        />
      </div>

      <div v-if="transaction.isApprovedB" class="un-col">
        <UnBtn
          data-testid="approve-button"
          :text="transaction.btnTextB"
          :loading="isLoadingB"
          :uppercase="false"
          @click="onApproveB"
        />
      </div>

      <div class="un-col-1">
        <UnBtn
          data-testid="submit-button"
          :text="transaction.btnText"
          :loading="isLoading"
          :disabled="transaction.btnDisabled || !isSelectedEthAccount || isMaxLessMin"
          :uppercase="false"
          @click="onPreview"
        />
      </div>
    </div>

    <div
      v-if="isMaxLessMin"
      class="pool-add-liquidity-main-card__max-less-min-warning"
      v-html="'You have incorrect range.<br>Min price should be smaller than max price'"
    />

    <div
      v-if="!isSelectedEthAccount"
      class="pool-add-liquidity-main-card__account-not-in-wallet"
      v-text="'To make transactions, please, switch to the account as in your wallet'"
    />
  </UnCard>
</template>

<script lang="ts">
import {
  PropType,
  defineComponent,
  computed,
  ref,
  watch,
  onBeforeUnmount,
} from 'vue';
import minBy from 'lodash/minBy';
import { useCore } from '@/store';
import { useModalAddPool } from '@/components/modals/modals';
import {
  POOL_SUPPORTED_TOKEN_A_LIST,
  POOL_SUPPORTED_TOKEN_B_LIST,
} from '@/helpers/enums/pools';
import { Position } from '@/types/common.d';
import { PoolToken } from '@/classes/PoolToken';
import { TransactionPoolAddPosition } from '@/classes/transaction';
import { useV3DerivedMintInfo, FieldTypes } from '@/classes/Position/useV3DerivedMintInfo';
import { useRangeHopCallbacks, getLeftRightRangeCallbacks } from '@/classes/Position/useRangeHopCallbacks';
import { formatPercentDisplay } from '@/helpers/formatters';
import { getPoolOptions } from '../utils';

import UnCard from '@/components/ui/UnCard.vue';
import UnBtn from '@/components/ui/UnBtn.vue';
import UnAccountTicket from '@/components/common/UnAccountTicket.vue';
import UnPoolTokenCard from '@/components/common/poolCommon/UnPoolTokenCard.vue';

import PoolAddLiquidityHeader from './PoolAddLiquidityHeader.vue';
import PoolIncreaseLiquidityHeader from './PoolIncreaseLiquidityHeader.vue';


const UPDATE_RANGES_TIMEOUT = 60_000;

export default defineComponent({
  name: 'PoolAddLiquidityMainCard',
  components: {
    UnCard,
    UnBtn,
    UnPoolTokenCard,
    UnAccountTicket,
    PoolAddLiquidityHeader,
    PoolIncreaseLiquidityHeader,
  },
  props: {
    tokenIdA: {
      type: String,
      required: true,
    },
    tokenIdB: {
      type: String,
      required: true,
    },
    fee: {
      type: Number as PropType<500 | 3000 | 10000>,
      required: true,
    },
    position: {
      type: Object as PropType<Position>,
    },
  },
  emits: [
    'update:tokenIdA',
    'update:tokenIdB',
  ],
  setup: (props) => {
    const modalAddPool = useModalAddPool();
    const { isSelectedEthAccount } = useCore().wallet.value;

    const isSingleSide = ref(true);
    const depositADisabled = ref(false); // block inputs
    const depositBDisabled = ref(true);

    const isMaxLessMin = ref(false); // is max price < min

    const isLoading = ref(false); // add btn
    const isLoadingA = ref(false); // approve
    const isLoadingB = ref(false); // approve

    const leftRange = ref(''); // min value
    const rightRange = ref(''); // max value
    const tokenPrice = ref(''); // current price
    const advanceMode = ref(false);
    const rangeCallbacks = ref<ReturnType<typeof getLeftRightRangeCallbacks>>();

    const tokenA = ref<PoolToken>();
    const tokenB = ref<PoolToken>();

    const tokenOptionsA = ref(getPoolOptions(POOL_SUPPORTED_TOKEN_A_LIST));
    const tokenOptionsB = ref(getPoolOptions(POOL_SUPPORTED_TOKEN_B_LIST));

    // if increase liquidity, not create
    if (props.position) { // similar for advanced mode
      // eslint-disable-next-line vue/no-setup-props-destructure
      const {
        minPrice,
        maxPrice,
        token0Price,
        token1Price,
        inverted,
        inRange,
      } = props.position;

      leftRange.value = (inverted ? (1 / +maxPrice).toFixed(18) : minPrice);
      rightRange.value = (inverted ? (1 / +minPrice).toFixed(18) : maxPrice);
      tokenPrice.value = (inverted ? token1Price : token0Price);

      const PoolTokens = PoolToken.buildFromPosition(props.position);
      tokenA.value = PoolTokens.quote;
      tokenB.value = PoolTokens.base;

      tokenOptionsA.value = [tokenA.value];
      tokenOptionsB.value = [tokenB.value];

      isSingleSide.value = !inRange;
    }

    const priceRisesPercent = computed(() => {
      const price = depositADisabled.value ? 1 / +tokenPrice.value : +tokenPrice.value;

      const value = depositADisabled.value
        ? (1 / +rightRange.value - price) / price
        : (+leftRange.value - price) / price;

      return formatPercentDisplay(price ? 100 * value : 0.1);
    });

    const transaction = ref<TransactionPoolAddPosition>();

    const getRangesByPrice = (price: number) => {
      // from 3% to 100% / from -50% to 100%
      const leftConst = isSingleSide.value ? 1.03 : 0.5;

      const leftRangeValue = (leftConst * price).toFixed(18);
      const rightRangeValue = (2 * price).toFixed(18);

      return [leftRangeValue, rightRangeValue];
    };

    const updateTransactionData = async (fieldType?: FieldTypes) => {
      if (!tokenA.value || !tokenB.value) return null;
      if (!transaction.value) return null;

      void tokenA.value.update(); // update token A
      void tokenB.value.update(); // update token B

      const price = await transaction.value.getTokenPrice(props.fee);
      if (!props.position) tokenPrice.value = price;

      let leftRangeValue = leftRange.value;
      let rightRangeValue = rightRange.value;

      if (!(props.position || advanceMode.value)) {
        [leftRangeValue, rightRangeValue] = getRangesByPrice(+price);
      }

      const promises = [
        useV3DerivedMintInfo(
          tokenA.value,
          tokenB.value,
          leftRangeValue,
          rightRangeValue,
          props.fee,
          props.position?.positionData,
          fieldType,
        ),
        useRangeHopCallbacks(
          tokenA.value.address,
          tokenB.value.address,
          props.fee,
        ),
      ] as const;

      const [mintInfo, ranges] = await Promise.all(promises);

      depositADisabled.value = mintInfo.depositADisabled;
      depositBDisabled.value = mintInfo.depositBDisabled;

      const leftRightRangeCallbacks = getLeftRightRangeCallbacks(mintInfo, ranges);
      rangeCallbacks.value = leftRightRangeCallbacks;

      // if increase liquidity then just return mintInfo, no other calculations needed
      if (props.position) return mintInfo;

      if (isSingleSide.value) {
        // when single side get min variant when value > price
        leftRange.value = minBy([
          leftRightRangeCallbacks.leftRange.increment(),
          mintInfo.leftRangeCurrent,
        ]) as string;

        rightRange.value = mintInfo.rightRangeCurrent;
      } else {
        // when proper, two side pool
        leftRange.value = leftRangeValue;
        rightRange.value = rightRangeValue;
      }

      return mintInfo;
    };

    const onUpdateInput = async (tokenName: 'tokenA' | 'tokenB') => {
      // check which token changes A or B
      const fieldType = tokenName === 'tokenA' ? FieldTypes.CurrencyA : FieldTypes.CurrencyB;
      // update all data based on CurrencyA or CurrencyB
      const mintInfo = await updateTransactionData(fieldType);

      if (!mintInfo) return;
      if (!tokenA.value || !tokenB.value) return;

      leftRange.value = mintInfo.leftRangeCurrent;
      rightRange.value = mintInfo.rightRangeCurrent;

      // when update amount of tokens in one field then update amount in other.
      switch (tokenName) {
        case 'tokenA': {
          const value = mintInfo.invertPrice ? mintInfo.amount0 : mintInfo.amount1;
          tokenB.value.value = value ?? '';
          break;
        }

        case 'tokenB': {
          const value = mintInfo.invertPrice ? mintInfo.amount1 : mintInfo.amount0;
          tokenA.value.value = value ?? '';
          break;
        }

        default:
      }
    };

    const onUpdateRange = () => {
      // we monitor left and right range changes to detect when min > max
      // left range - min; right range - max
      isMaxLessMin.value = +leftRange.value >= +rightRange.value;

      if (isMaxLessMin.value) return;

      // when min,max price update, we also update input values
      void onUpdateInput('tokenA');
    };

    const createDecrementIncrementRange = (actionType: 'decrement' | 'increment') => (
      (rangeType: 'leftRange' | 'rightRange') => {
        if (!rangeCallbacks.value) return;
        const value = rangeCallbacks.value[rangeType][actionType]();

        switch (rangeType) {
          case 'leftRange':
            leftRange.value = value;
            break;

          case 'rightRange':
            rightRange.value = value;
            break;

          default:
        }

        void onUpdateInput('tokenA');
      });

    const onDecrementRange = createDecrementIncrementRange('decrement');
    const onIncrementRange = createDecrementIncrementRange('increment');

    // click on preview button
    const onPreview = async () => {
      isLoading.value = true;

      if (!tokenA.value || !tokenB.value) return;
      await updateTransactionData(); // update all data before show modal

      // show modal and send data to modal
      const result = await modalAddPool.show({
        fee: props.fee,
        leftRange: leftRange.value,
        rightRange: rightRange.value,
        tokenPrice: tokenPrice.value,
        priceRisesPercent: priceRisesPercent.value,
        tokenA: tokenA.value,
        tokenB: tokenB.value,
        position: props.position,
      });

      if (result) {
        tokenA.value.value = '';
        tokenB.value.value = '';
      }

      isLoading.value = false;
    };

    // on click approve token A
    const onApproveA = async () => {
      isLoadingA.value = true;
      await transaction.value?.approveA();
      isLoadingA.value = false;
    };

    // on click approve token B
    const onApproveB = async () => {
      isLoadingB.value = true;
      await transaction.value?.approveB();
      isLoadingB.value = false;
    };

    watch([() => props.tokenIdA, () => props.tokenIdB], async () => {
      if (!props.position) {
        const valA = tokenA.value?.value;
        const valB = tokenB.value?.value;

        tokenA.value = tokenOptionsA.value.find((_) => _.symbol === props.tokenIdA) as PoolToken;
        tokenB.value = tokenOptionsB.value.find((_) => _.symbol === props.tokenIdB) as PoolToken;

        if (tokenA.value) tokenA.value.value = valA || '';
        if (tokenB.value) tokenB.value.value = valB || '';
      }

      if (!tokenA.value || !tokenB.value) return;

      // if we have pool we increase liquidity
      if (transaction.value) {
        transaction.value.update(
          tokenA.value,
          tokenB.value,
        );
      } else {
        // if we don't have position, we create new
        transaction.value = new TransactionPoolAddPosition(
          tokenA.value,
          tokenB.value,
        );
      }

      if (!props.position) {
        // calculate new price
        tokenPrice.value = (tokenA.value.price_usd / tokenB.value.price_usd).toString();
        [leftRange.value, rightRange.value] = getRangesByPrice(+tokenPrice.value);

        tokenPrice.value = await transaction.value.getTokenPrice(props.fee);
        [leftRange.value, rightRange.value] = getRangesByPrice(+tokenPrice.value);
      }

      void onUpdateInput('tokenA');
    }, { immediate: true });

    watch(isSingleSide, () => {
      advanceMode.value = false;
      // if we have single side -> type smth in input ->
      // switch off single side -> we need to update 2 input value
      void onUpdateInput('tokenA');
    });

    watch(advanceMode, () => {
      void onUpdateInput('tokenA');
    });

    // if we don't have position, update data with interval
    if (!props.position) {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      const interval = setInterval(() => {
        void updateTransactionData();
      }, UPDATE_RANGES_TIMEOUT);
      onBeforeUnmount(() => { clearInterval(interval); });
    }

    return {
      isLoading,
      isSingleSide,
      isSelectedEthAccount,
      tokenPrice,
      priceRisesPercent,

      tokenOptionsA,
      tokenA,
      depositADisabled,
      isLoadingA,

      tokenOptionsB,
      tokenB,
      depositBDisabled,
      isLoadingB,

      isMaxLessMin,
      advanceMode,

      leftRange,
      rightRange,

      transaction,

      onPreview,
      onApproveA,
      onApproveB,
      onUpdateInput,
      onUpdateRange,
      onDecrementRange,
      onIncrementRange,
    };
  },
});
</script>

<style lang="scss">
.pool-add-liquidity-main-card {
  $root: &;

  padding: 16px 17px;

  @include media-gt(tablet) {
    padding: 30px;
  }

  &__header {
    margin-bottom: 18px;
  }

  &__account-ticket {
    margin: 17px 0 14px;

    @include media-gt(tablet) {
      margin: 17px 0 24px;
    }
  }

  &__token {
    & + & {
      margin-top: 22px;
    }
  }

  &__account-not-in-wallet {
    margin: 10px 0;
    font-size: 14px;
    color: $un-color-warning-notification;
    text-align: center;
  }

  &__max-less-min-warning {
    margin: 10px 0;
    font-size: 14px;
    color: $un-color-warning-notification;
    text-align: center;
  }
}
</style>
