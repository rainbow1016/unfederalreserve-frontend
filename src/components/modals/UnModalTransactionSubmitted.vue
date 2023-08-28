<template>
  <UnModalLayout
    :title="title"
    class="un-modal-transaction-submitted"
    @close="$emit('close')"
  >
    <div class="un-modal-transaction-submitted__container">
      <p class="un-modal-transaction-submitted__description">
        You can close this window, we’ll notify you when the transaction is completed
      </p>

      <span
        class="un-modal-transaction-submitted__icon"
        v-html="require('!raw-loader!@/assets/images/icons/arrow-up-circle.svg').default"
      />
    </div>

    <template #footer>
      <div class="un-modal-transaction-submitted__container">
        <UnBtn
          v-if="transaction"
          :loading="isLoadingAdded"
          :disabled="transaction.btn_disabled"
          :success="transaction.btn_disabled"
          :text="transaction.btn_text"
          :uppercase="false"
          class="un-modal-transaction-submitted__btn-add"
          data-testid="add-token-button"
          @click="onAddToMetaMask"
        />

        <a
          v-if="href"
          :href="href"
          target="_blank"
          class="un-modal-transaction-submitted__link"
          v-text="'VIEW ON ETHERSCAN'"
        />
      </div>
    </template>
  </UnModalLayout>
</template>

<script lang="ts">
import {
  PropType,
  defineComponent,
  ref,
  onBeforeUnmount,
} from 'vue';
import { Account, Market } from '@/types/common.d';
// eslint-disable-next-line import/no-cycle
import { TransactionAddToMetaMask } from '@/classes/transaction';

import UnBtn from '@/components/ui/UnBtn.vue';
import UnModalLayout from './UnModalLayout.vue';


export default defineComponent({
  name: 'UnModalTransactionSubmitted',
  components: {
    UnBtn,
    UnModalLayout,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    txHash: String,
    addToMetaMask: Boolean,
    addToMetaMaskWETH: Boolean,
    timeout: Number,
    market: Object as PropType<Market>,
    account: Object as PropType<Account>,
  },
  emits: ['close'], // close modal
  setup: (props, ctx) => {
    const account = props.account || props.market?.account;
    const isMetaMask = account?.wallet.current_provider_settings?.name === 'MetaMask';

    const href = props.txHash && account?.env.TX_URL
      ? account.env.TX_URL + props.txHash
      : '';

    const isAddToMetaMask = (props.addToMetaMask || props.addToMetaMaskWETH) && isMetaMask && props.market;
    const transactionAddToMetaMask = isAddToMetaMask ? new TransactionAddToMetaMask(props.market) : null;
    // eslint-disable-next-line vue/no-setup-props-destructure
    if (transactionAddToMetaMask) transactionAddToMetaMask.isWETH = props.addToMetaMaskWETH;

    const transaction = ref(transactionAddToMetaMask);

    const isLoadingAdded = ref(false);

    const onAddToMetaMask = async () => {
      if (!transaction.value) return;
      isLoadingAdded.value = true;
      const result = await transaction.value.btnAction();
      transaction.value.btn_disabled = result;
      isLoadingAdded.value = false;
    };

    if (props.timeout) {
      const timerId = setTimeout(() => {
        ctx.emit('close');
      }, props.timeout);

      onBeforeUnmount(() => {
        clearTimeout(timerId);
      });
    }

    return {
      href,
      isLoadingAdded,
      isMetaMask,
      transaction,
      onAddToMetaMask,
    };
  },
});
</script>

<style lang="scss">
.un-modal-transaction-submitted {
  &__container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  &__description {
    padding: 0 60px;
    margin-top: -5px;
    margin-bottom: 0;
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
    text-align: center;
  }

  &__icon {
    margin-top: 25px;
    margin-bottom: 12px;
  }

  &__btn-add {
    margin-bottom: 20px;
  }

  &__link {
    margin-bottom: 24px;
    font-size: 15px;
    font-weight: 700;
    line-height: 26px;
    color: white;
    text-transform: uppercase;

    &:not(:hover) {
      text-decoration: none;
    }
  }
}
</style>
