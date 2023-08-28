<template>
  <UnModalLayout
    class="un-modal-transaction"
    :title="market.symbol"
    full-width-header
    blue
    @close="$emit('close')"
  >
    <template #header>
      <UnTabs
        v-if="tabOptions.length > 1"
        v-model="currentTab"
        :options="tabOptions"
        lined
        class="un-modal-transaction__tabs"
        @update:model-value="isMaxValue = false; value = ''"
      />
      <div
        v-else
        class="un-modal-transaction__tabs-empty"
      />

      <div class="un-modal-transaction__logo">
        <img
          class="un-modal-transaction__logo__icon"
          :src="icon"
        >
        <div
          class="un-modal-transaction__logo__name"
          :class="{ 'is-orange': isOrange }"
          v-text="symbol_f"
        />
      </div>
    </template>

    <template #default>
      <UnModalTransactionBalance
        :symbol="market.symbol"
        :label="currentTransaction.balance_text"
        :input-label="currentTransaction.input_label"
        :value="currentTransaction.balance_amount"
        class="un-modal-transaction__balance"
      />

      <UnModalTransactionApproveTitle
        v-if="currentTab.approve && needFirstApprove"
        :symbol="market.symbol"
        :label="currentTab.label"
        class="un-modal-transaction__approve-title"
      />

      <UnModalTransactionInput
        v-else
        :key="currentTab.value"
        v-model="value"
        :decimals="currentTransaction.decimals"
        :btn-tooltip="currentTab.max_tooltip"
        :btn-label="currentTab.max_label"
        :max="isMaxValue"
        :price-usd="priceUsd"
        :symbol="market.symbol"
        class="un-modal-transaction__input"
        @set-max="onSetMaxValue"
        @update:model-value="isMaxValue = false"
      />

      <div class="un-modal-transaction__scroll">
        <UnModalTransactionLimits
          v-for="(limits, index) in currentTransaction.limits"
          :key="index"
          v-bind="limits"
          lined
          blue
        />

        <UnModalTransactionCheckbox
          v-if="currentTab.checkbox"
          v-model="checkbox"
          blue
          class="un-modal-transaction__checkbox"
          data-testid="accept-risks-checkbox"
        />
      </div>
    </template>

    <template #footer>
      <div
        v-if="currentTab.approve && (needFirstApprove || needMoreApprove)"
        class="un-modal-transaction__footer-btn-wrapper"
      >
        <UnBtn
          text="Approve"
          :loading="currentTab.loading"
          number="1"
          data-testid="approve-button"
          @click="onTransactionAction"
        />
        <UnBtn
          :text="currentTab.label"
          :disabled="needFirstApprove || needMoreApprove"
          number="2"
          data-testid="submit-button"
          @click="onTransactionAction"
        />
      </div>

      <UnBtn
        v-else
        :text="currentTransaction.btn_text"
        :disabled="currentTransaction.btn_disabled"
        :loading="currentTab.loading"
        data-testid="submit-button"
        @click="onTransactionAction"
      />

      <div
        v-if="!isSelectedEthAccount"
        class="un-modal-transaction__account-not-in-wallet"
        v-text="'To make transactions, please, switch to the account as in your wallet'"
      />

      <UnModalTransactionFaucet
        v-if="withFaucet"
        :disabled="currentTab.loading"
        class="un-modal-transaction__faucet"
        @faucet="onFaucet"
      />
    </template>
  </UnModalLayout>
</template>

<script lang="ts">
import {
  PropType,
  computed,
  defineComponent,
  defineAsyncComponent,
  ref,
  watch,
} from 'vue';
import { notify } from '@kyvg/vue3-notification';

import {
  TransactionAllocateTo,

  TransactionSupply,
  TransactionWithdraw,
  TransactionBorrow,
  TransactionRepay,

  TransactionTypes,
  TRANSACTION_TAB_OPTIONS,
} from '@/classes/transaction';
import { Market } from '@/types/common.d';

import UnTabs from '@/components/ui/UnTabs.vue';
import UnBtn from '@/components/ui/UnBtn.vue';

import { formatSymbol } from '@/helpers/formatters/legacy';
import { CURRENCIES } from '@/helpers/enums/currencies';

import UnModalLayout from './UnModalLayout.vue';
import UnModalTransactionLimits from './components/UnModalTransactionLimits.vue';
import UnModalTransactionBalance from './components/UnModalTransactionBalance.vue';
import UnModalTransactionInput from './components/UnModalTransactionInput.vue';


const UnModalTransactionApproveTitle = defineAsyncComponent(() => import(
  /* webpackChunkName: "UnModalTransactionApproveTitle" */
  './components/UnModalTransactionApproveTitle.vue'
));

const UnModalTransactionCheckbox = defineAsyncComponent(() => import(
  /* webpackChunkName: "UnModalTransactionCheckbox" */
  './components/UnModalTransactionCheckbox.vue'
));

const UnModalTransactionFaucet = defineAsyncComponent(() => import(
  /* webpackChunkName: "UnModalTransactionFaucet" */
  './components/UnModalTransactionFaucet.vue'
));


const Component = defineComponent({
  name: 'UnModalTransaction',
  components: {
    UnTabs,
    UnBtn,
    UnModalLayout,
    UnModalTransactionInput,
    UnModalTransactionApproveTitle,
    UnModalTransactionCheckbox,
    UnModalTransactionLimits,
    UnModalTransactionBalance,
    UnModalTransactionFaucet,
  },
  props: {
    tabs: {
      type: Array as PropType<TransactionTypes[]>,
      required: true,
      validator: (props: TransactionTypes[]) => (
        props.every((key) => key in TransactionTypes)
      ),
    },
    market: {
      type: Object as PropType<Market>,
      required: true,
    },
  },
  emits: ['close'], // close modal
  setup(props, ctx) {
    const value = ref('');
    const checkbox = ref(false);
    const isMaxValue = ref(false);

    const currentTab = ref(TRANSACTION_TAB_OPTIONS[props.tabs[0]]);

    const withFaucet = computed(() => (
      props.market.account.env.FAUCET
    ));

    const isSelectedEthAccount = computed(() => (
      props.market.account.wallet.isSelectedEthAccount
    ));

    const priceUsd = computed(() => {
      const price = props.market?.price_usd || 0;
      const val = +value.value || 0;
      return (val * price);
    });


    const needFirstApprove = computed(() => (
      props.market.symbol !== 'ETH'
      && +props.market.allowance_balance <= 0
    ));

    const needMoreApprove = computed(() => (
      props.market.symbol !== 'ETH'
      && +value.value > 0
      && +props.market.allowance_balance < +value.value
      && [
        TransactionTypes.supply,
        TransactionTypes.repay,
      ].includes(currentTab.value.value)
    ));

    const tabOptions = computed(() => {
      const tabs = props.tabs.map((key) => {
        let disabled;
        let tooltipText;

        switch (key) {
          case TransactionTypes.supply:
            if (!props.market.supply_allowed) {
              disabled = true;
              tooltipText = 'Supply is paused';
            }
            break;

          case TransactionTypes.borrow:
            if (!props.market.borrow_allowed) {
              disabled = true;
              tooltipText = 'Borrow is paused';
            }
            break;

          default:
        }

        return {
          ...TRANSACTION_TAB_OPTIONS[key],
          disabled,
          tooltipText,
        };
      });

      const isNeedFirstApproveOnlySupply = (
        props.tabs.includes(TransactionTypes.supply)
        && needFirstApprove.value
        && props.market.supply_balance === '0'
      );

      if (isNeedFirstApproveOnlySupply) {
        return [tabs[0]];
      }

      return tabs;
    });

    const tabIndex = tabOptions.value.findIndex((tab) => !tab.disabled);
    currentTab.value = tabOptions.value[tabIndex];

    watch([tabOptions], () => {
      const hasPrev = tabOptions.value.some((_) => (
        _.value === currentTab.value?.value
      ));
      if (hasPrev) return;
      [currentTab.value] = tabOptions.value;
    });

    const isOrange = computed(() => [
      TransactionTypes.withdraw,
      TransactionTypes.borrow,
    ].includes(currentTab.value.value));

    const transactionSupply = new TransactionSupply(props.market);
    const transactionWithdraw = new TransactionWithdraw(props.market);
    const transactionBorrow = new TransactionBorrow(props.market);
    const transactionRepay = new TransactionRepay(props.market);
    const transactionAllocateTo = new TransactionAllocateTo(props.market);

    const currentTransaction = computed(() => {
      switch (currentTab.value.value) {
        case TransactionTypes.supply:
          return transactionSupply.update(value.value);

        case TransactionTypes.withdraw:
          return transactionWithdraw.update(value.value);

        case TransactionTypes.borrow:
          return transactionBorrow.update(value.value, checkbox.value);

        case TransactionTypes.repay:
          return transactionRepay.update(value.value, false, isMaxValue.value);

        default:
          return null as never;
      }
    });

    const onTransactionAction = async () => {
      currentTab.value.loading = true;
      const isValid = await currentTransaction.value.validate(isMaxValue.value);

      if (isValid !== true) {
        const text = isValid || 'Ошибка валидации';
        notify({ group: 'transaction', text });
      } else {
        const promise = currentTransaction.value.btnAction(isMaxValue.value);
        ctx.emit('close', promise);
        const result = await promise;
        if (result) value.value = '';
      }

      currentTab.value.loading = false;
    };

    const onFaucet = async () => {
      currentTab.value.loading = true;
      ctx.emit('close');
      transactionAllocateTo.update(value.value);
      await transactionAllocateTo.btnAction();
      currentTab.value.loading = false;
    };

    const onSetMaxValue = () => {
      const possibleMax = currentTransaction.value.getPossibleMax();
      const max = currentTransaction.value.getMax();
      value.value = possibleMax;
      isMaxValue.value = +possibleMax > 0 && possibleMax === max;
    };

    const icon = CURRENCIES[props.market.symbol];
    const symbol_f = formatSymbol(props.market.symbol);

    return {
      value,
      priceUsd,
      checkbox,
      currentTab,
      tabOptions,
      icon,
      symbol_f,

      currentTransaction,

      isMaxValue,
      isOrange,
      withFaucet,
      needFirstApprove,
      needMoreApprove,

      isSelectedEthAccount,

      onTransactionAction,
      onFaucet,
      onSetMaxValue,
    };
  },
});

export default Component;
</script>

<style lang="scss">
.un-modal-transaction {
  &__tabs {
    position: relative;
    z-index: 2;
    width: 100%;
    margin-top: 15px;
  }

  &__tabs-empty {
    height: 32px;
    margin-top: 15px;

    @include media-lt(tablet) {
      height: 50px;
    }
  }

  &__scroll {
    overflow: auto;

    @include media-lt(tablet) {
      padding: 10px 15px 0 15px;
      margin-right: -15px;
      margin-left: -15px;
    }

    @include media-gte(tablet) {
      padding-top: 20px;
    }
  }

  &__approve-title {
    margin-top: 10px;
  }

  &__checkbox {
    margin-top: 10px;

    @include media-lt(tablet) {
      margin-bottom: 10px;
    }
  }

  &__balance {
    @include media-lt(tablet) {
      padding-left: 5px;
      margin-bottom: 12px;
    }
  }

  &__faucet {
    margin: 15px 10px 0;
  }

  &__account-not-in-wallet {
    margin: 10px 0;
    font-size: 14px;
    color: $un-color-warning-notification;
    text-align: center;
  }

  &__footer-btn-wrapper {
    @include media-gt(tablet-xs) {
      display: flex;

      .un-btn:first-child {
        margin-right: 30px;
      }
    }

    @include media-lte(tablet-xs) {
      .un-btn:first-child {
        margin-bottom: 10px;
      }
    }
  }

  &__logo {
    position: absolute;
    top: -40px;
    left: calc(50% - 43px);
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 86px;
    height: 86px;
    background: #13296d;
    border-radius: 50%;

    @include media-lte(tablet) {
      top: 30px;
    }

    &__icon {
      width: 65px;
      height: 65px;
      margin-top: 11px;
    }

    &__name {
      padding: 3px 13px;
      margin-top: -6px;
      font-size: 16px;
      font-weight: 600;
      color: white;
      white-space: nowrap;
      background: #00d395;
      border-radius: 6px;
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);

      &.is-orange {
        background: #ec9d5b;
      }
    }
  }
}
</style>
