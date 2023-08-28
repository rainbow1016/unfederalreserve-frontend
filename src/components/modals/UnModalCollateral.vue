<template>
  <UnModalLayout
    :title="currentTransaction.title"
    class="un-modal-collateral"
    @close="$emit('close')"
  >
    <div class="un-modal-collateral__title">
      <img
        v-svg-inline
        :src="icon"
        :class="`is-type--${symbol}`"
        alt="token icon"
        class="un-modal-collateral__icon"
      >

      <div
        class="un-modal-collateral__symbol"
        v-text="symbol_f"
      />

      <p
        class="un-modal-collateral__description"
        v-text="currentTransaction.description"
      />
    </div>

    <UnModalTransactionLimits
      v-for="(limits, index) in currentTransaction.limits"
      :key="index"
      v-bind="limits"
      lined
      blue
    />

    <template #footer>
      <UnBtn
        data-testid="submit-button"
        :disabled="currentTransaction.btn_disabled"
        :text="currentTransaction.btn_text"
        :loading="isLoading"
        :uppercase="false"
        @click="onTransactionAction"
      />

      <div
        v-if="!isSelectedEthAccount"
        class="un-modal-collateral__account-not-in-wallet"
        v-text="'To make transactions, please, switch to the account as in your wallet'"
      />
    </template>
  </UnModalLayout>
</template>

<script lang="ts">
// eslint-disable-next-line object-curly-newline
import { PropType, ref, defineComponent, toRef } from 'vue';
import { notify } from '@kyvg/vue3-notification';

import { Market } from '@/types/common.d';
import { TransactionCollateral } from '@/classes/transaction';
import { CURRENCIES } from '@/helpers/enums/currencies';
import { formatSymbol } from '@/helpers/formatters/legacy';

import UnBtn from '@/components/ui/UnBtn.vue';
import UnModalLayout from './UnModalLayout.vue';
import UnModalTransactionLimits from './components/UnModalTransactionLimits.vue';


export default defineComponent({
  name: 'UnModalCollateral',
  components: {
    UnBtn,
    UnModalLayout,
    UnModalTransactionLimits,
  },
  props: {
    market: {
      type: Object as PropType<Market>,
      required: true,
    },
  },
  emits: ['close'], // close modal
  setup: (props, ctx) => {
    // eslint-disable-next-line vue/no-setup-props-destructure
    const { symbol } = props.market;
    const symbol_f = formatSymbol(symbol);
    const icon = CURRENCIES[symbol];
    const isSelectedEthAccount = toRef(props.market.account.wallet, 'isSelectedEthAccount');

    const transactionCollateral = new TransactionCollateral(props.market);

    const isLoading = ref(false);
    const currentTransaction = ref(transactionCollateral);

    const onTransactionAction = async () => {
      if (currentTransaction.value.btn_disabled) {
        ctx.emit('close', false);
        return;
      }

      isLoading.value = true;
      const isValid = await currentTransaction.value.validate();

      if (isValid !== true) {
        const text = isValid || 'Ошибка валидации';
        notify({ group: 'transaction', text });
      } else {
        const promise = currentTransaction.value.btnAction();
        ctx.emit('close', promise);
        await promise;
      }

      isLoading.value = false;
    };

    return {
      isSelectedEthAccount,
      symbol,
      symbol_f,
      icon,
      isLoading,
      currentTransaction,

      onTransactionAction,
    };
  },
});
</script>

<style lang="scss">
.un-modal-collateral {
  padding-bottom: 22px;

  &__title {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  &__icon {
    width: 91px;
    height: 91px;
    margin-bottom: 10px;
  }

  &__symbol {
    margin-bottom: 15px;
    font-size: 24px;
    font-weight: 600;
    line-height: 26px;
    color: white;
  }

  &__description {
    width: 100%;
    padding: 0 25px;
    margin-bottom: 45px;
    font-size: 14px;
    font-weight: 400;
    line-height: 21px;
    color: white;
  }

  &__account-not-in-wallet {
    margin-top: 10px;
    font-size: 14px;
    color: $un-color-warning-notification;
    text-align: center;
  }
}
</style>
