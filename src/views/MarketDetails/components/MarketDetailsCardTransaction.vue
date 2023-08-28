<template>
  <UnCard
    :loading="loading"
    header-lined
    light
    class="market-details-card-transaction"
  >
    <template #header>
      <div class="un-100w">
        <UnTabs
          v-model="currentTab"
          :options="tabOptions"
          lined
          light
          disabled-options-color
          class="market-details-card-transaction__tabs"
          @update:model-value="isMaxValue = false"
        />
      </div>
    </template>

    <MarketDetailsInput
      :key="currentTab.value"
      v-model="value"
      :decimals="decimals"
      :btn-tooltip="currentTab.max_tooltip"
      :btn-label="currentTab.max_label"
      :price-usd="priceUsd"
      input-label="Amount"
      :max="isMaxValue"
      :disabled="!market || !isTokenAnyActionActive"
      @set-max="onSetMaxValue"
      @update:model-value="isMaxValue = false"
    />

    <MarketDetailsTransactionConnect
      v-if="!market && !skeleton"
    />

    <MarketDetailsPaused
      v-else-if="market && !isTokenAnyActionActive"
    />

    <!-- eslint-disable vue/no-v-model-argument -->
    <MarketDetailsTransactionDetails
      v-else-if="market"
      ref="detailsRef"
      :key="market?.symbol"
      v-model:value="value"
      :type="currentTab.value"
      :market="market"
      :max="isMaxValue"
      :skeleton="skeleton"
    />
  </UnCard>
</template>

<script lang="ts">
import {
  PropType,
  computed,
  defineComponent,
  ref,
} from 'vue';
import { TRANSACTION_TAB_OPTIONS, TransactionTypes } from '@/classes/transaction';
import { Market } from '@/types/common.d';
import { IAllMarket } from '@/types/api/allMarkets';
import { formatToCurrency } from '@/helpers/formatters';

import UnCard from '@/components/ui/UnCard.vue';
import UnTabs from '@/components/ui/UnTabs.vue';
import MarketDetailsInput from './MarketDetailsInput.vue';
import MarketDetailsTransactionConnect from './MarketDetailsTransactionConnect.vue';
import MarketDetailsTransactionDetails from './MarketDetailsTransactionDetails.vue';
import MarketDetailsPaused from './MarketDetailsPaused.vue';


type IDetailsRef = InstanceType<typeof MarketDetailsTransactionDetails>;

export default defineComponent({
  name: 'MarketDetailsCardTransaction',
  components: {
    UnCard,
    UnTabs,
    MarketDetailsInput,
    MarketDetailsTransactionConnect,
    MarketDetailsTransactionDetails,
    MarketDetailsPaused,
  },
  props: {
    market: {
      type: Object as PropType<Market>,
    },
    market_data: {
      type: Object as PropType<IAllMarket>,
    },
    loading: Boolean,
    skeleton: Boolean,
  },
  setup: (props) => {
    const detailsRef = ref<IDetailsRef>();
    const value = ref('');
    const isMaxValue = ref(false);

    const isTokenAnyActionActive = computed(() => {
      const { market } = props;
      if (!market) return true;

      return (
        market.supply_allowed
        || market.borrow_allowed
        || +market.supply_balance > 0
        || +market.borrow_balance > 0
      );
    });

    const tabOptions = computed(() => [
      TRANSACTION_TAB_OPTIONS.supply,
      TRANSACTION_TAB_OPTIONS.withdraw,
      TRANSACTION_TAB_OPTIONS.borrow,
      TRANSACTION_TAB_OPTIONS.repay,
    ].map((options) => {
      const { market } = props;
      if (!market) return options;

      let disabled;
      let tooltipText;

      switch (options.value) {
        case TransactionTypes.supply:
          if (!market.supply_allowed) {
            disabled = true;
            tooltipText = isTokenAnyActionActive.value ? 'Supply is temporarily paused' : '';
          }
          break;

        case TransactionTypes.withdraw:
          if (!props.market?.supply_allowed && +market.supply_balance <= 0) {
            disabled = true;
          }
          break;

        case TransactionTypes.borrow:
          if (!market.borrow_allowed) {
            disabled = true;
            tooltipText = isTokenAnyActionActive.value ? 'Borrow is temporarily paused' : '';
          }
          break;

        case TransactionTypes.repay:
          if (!market.borrow_allowed && +market.borrow_balance <= 0) {
            disabled = true;
          }
          break;

        default:
      }

      return {
        ...options,
        disabled,
        tooltipText,
      };
    }));

    let tabIndex = tabOptions.value.findIndex((tab) => !tab.disabled);
    tabIndex = tabIndex !== -1 ? tabIndex : 0;
    const currentTab = ref(tabOptions.value[tabIndex]);

    const decimals = computed(() => (
      props.market?.underlyingDecimals || 18
    ));

    const priceUsd = computed(() => {
      const price = props.market_data?.price || props.market?.price_usd || 0;
      const val = +value.value || 0;
      return formatToCurrency(val * price);
    });

    const onSetMaxValue = (percent : number) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const currentTransaction = detailsRef.value?.currentTransaction;
      if (!currentTransaction || !props.market) return;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      const possibleMax = currentTransaction.getPossibleMax();

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      const max = currentTransaction.getMax();

      const val = percent === 1
        ? (possibleMax as string)
        : (percent * +possibleMax).toFixed(props.market.underlyingDecimals);

      // convert after toFixed(): 0.00000000 -> 0
      value.value = +val === 0 ? '0' : val;

      isMaxValue.value = +value.value > 0 && value.value === max;
    };

    return {
      detailsRef,
      value,
      currentTab,
      tabOptions,
      priceUsd,
      decimals,
      isMaxValue,
      isTokenAnyActionActive,

      onSetMaxValue,
    };
  },
});
</script>

<style lang="scss">
.market-details-card-transaction {
  &__tabs {
    position: relative;
    left: -25px;
    z-index: 1;
    width: calc(100% + 2 * 25px);
  }
}
</style>
