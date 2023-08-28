<template>
  <!-- eslint-disable vue/no-multiple-template-root -->

  <UnModalTransactionLimits
    v-for="(limits, index) in currentTransaction.limits"
    :key="index"
    light
    :skeleton="skeleton"
    v-bind="limits"
    class="market-details-transaction-details__limits"
  />

  <UnModalTransactionCheckbox
    v-if="isBorrow"
    v-model="checkbox"
    blue
    class="market-details-transaction-details__checkbox"
    data-testid="accept-risks-checkbox"
  />

  <UnBtn
    :text="currentTransaction.btn_text"
    :disabled="currentTransaction.btn_disabled"
    :loading="market.loading"
    light
    data-testid="submit-button"
    class="market-details-transaction-details__button"
    @click="onTransactionAction"
  />

  <div
    v-if="!isSelectedEthAccount"
    class="market-details-transaction-details__account-not-in-wallet"
    v-text="'To make transactions, please, switch to the account as in your wallet'"
  />

  <UnModalTransactionBalance
    :symbol="market.symbol"
    :skeleton="skeleton"
    :label="currentTransaction.balance_text"
    :value="currentTransaction.balance_amount"
    class="market-details-transaction-details__balance"
  />
</template>

<script lang="ts">
import {
  PropType,
  computed,
  defineComponent,
  ref,
  toRef,
} from 'vue';
import { notify } from '@kyvg/vue3-notification';
import { Market } from '@/types/common.d';
import {
  TransactionSupply,
  TransactionWithdraw,
  TransactionBorrow,
  TransactionRepay,

  TransactionTypes,
} from '@/classes/transaction';

import UnBtn from '@/components/ui/UnBtn.vue';
import UnModalTransactionLimits from '@/components/modals/components/UnModalTransactionLimits.vue';
import UnModalTransactionBalance from '@/components/modals/components/UnModalTransactionBalance.vue';
import UnModalTransactionCheckbox from '@/components/modals/components/UnModalTransactionCheckbox.vue';


export default defineComponent({
  name: 'MarketDetailsTransactionDetails',
  components: {
    UnBtn,
    UnModalTransactionLimits,
    UnModalTransactionBalance,
    UnModalTransactionCheckbox,
  },
  props: {
    skeleton: Boolean,
    type: {
      type: String as PropType<TransactionTypes>,
      required: true,
    },
    market: {
      type: Object as PropType<Market>,
      required: true,
    },
    max: {
      type: Boolean,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  emits: [
    'update:value',
  ],
  setup: (props, ctx) => {
    // eslint-disable-next-line vue/no-setup-props-destructure
    const { market } = props;
    const checkbox = ref(false);
    const isSelectedEthAccount = toRef(market.account.wallet, 'isSelectedEthAccount');

    const transactionSupply = new TransactionSupply(market);
    const transactionWithdraw = new TransactionWithdraw(market);
    const transactionBorrow = new TransactionBorrow(market);
    const transactionRepay = new TransactionRepay(market);

    const currentTransaction = computed(() => {
      switch (props.type) {
        case TransactionTypes.supply:
          return transactionSupply?.update(props.value);

        case TransactionTypes.withdraw:
          return transactionWithdraw?.update(props.value);

        case TransactionTypes.borrow:
          return transactionBorrow?.update(props.value, checkbox.value);

        case TransactionTypes.repay:
          return transactionRepay?.update(props.value, false, props.max);

        default:
          return null as never;
      }
    });

    const isBorrow = computed(() => (
      props.type === TransactionTypes.borrow
    ));


    const onTransactionAction = async () => {
      const isValid = await currentTransaction.value.validate(props.max);

      if (isValid !== true) {
        const text = isValid || 'Ошибка валидации';
        notify({ group: 'transaction', text });
      } else {
        const result = await currentTransaction.value.btnAction(props.max);
        if (result) ctx.emit('update:value', '');
      }
    };

    return {
      isBorrow,
      checkbox,
      currentTransaction,
      isSelectedEthAccount,
      onTransactionAction,
    };
  },
});
</script>

<style lang="scss">
.market-details-transaction-details {
  &__button {
    margin: 24px 0 28px 0;
  }

  &__limits {
    color: $un-color-white;
  }

  &__account-not-in-wallet {
    margin: 0 0 15px;
    font-size: 14px;
    color: $un-color-warning-notification;
    text-align: center;
  }

  &__checkbox {
    margin-top: 28px;
  }

  &__balance {
    justify-content: center;
    color: $un-color-white;
  }
}
</style>
