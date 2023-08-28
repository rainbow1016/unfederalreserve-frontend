<template>
  <UnModalLayout
    class="un-modal-claim"
    @close="$emit('close')"
  >
    <template #header>
      <h3 class="un-modal-claim__title" data-testid="modal-title">
        Balance
      </h3>
    </template>

    <template #default>
      <transition name="transition--fade" mode="out-in" appear>
        <div :key="ersdlPriceUsd" class="un-modal-claim__token-price" data-testid="token-price">
          1 eRSDL ~ {{ ersdlPriceUsd }}
        </div>
      </transition>

      <UnModalClaimBalance
        :balance="balance"
        :balance-usd="balanceUsd"
        class="un-modal-claim__balance"
      />

      <UnModalTransactionLimits
        :list="transaction.limits.list"
        lined
        blue
      />
    </template>

    <template #footer>
      <UnBtn
        data-testid="claim-button"
        :disabled="transaction.btn_disabled"
        :uppercase="false"
        @click="onTransaction"
        v-text="transaction.btn_text"
      />

      <div
        v-if="!isSelectedEthAccount"
        class="un-modal-claim__account-not-in-wallet"
        v-text="'To make transactions, please, switch to the account as in your wallet'"
      />
    </template>
  </UnModalLayout>
</template>

<script lang="ts">
import {
  PropType,
  defineComponent,
  computed,
  ref,
  toRef,
} from 'vue';
import { Wallet, Account } from '@/types/common.d';
import { TransactionClaimRewards } from '@/classes/transaction';
import { formatToCurrency, formatToNumber } from '@/helpers/formatters';

import UnBtn from '@/components/ui/UnBtn.vue';
import UnModalLayout from './UnModalLayout.vue';
import UnModalClaimBalance from './components/UnModalClaimBalance.vue';
import UnModalTransactionLimits from './components/UnModalTransactionLimits.vue';


export default defineComponent({
  name: 'UnModalClaim',
  components: {
    UnModalLayout,
    UnBtn,
    UnModalClaimBalance,
    UnModalTransactionLimits,
  },
  props: {
    wallet: {
      type: Object as PropType<Wallet>,
      required: true,
    },
    account: {
      type: Object as PropType<Account>,
      required: true,
    },
  },
  emits: ['close'], // close modal
  setup(props, ctx) {
    const transactionClaimRewards = new TransactionClaimRewards(props.account);
    const transaction = ref(transactionClaimRewards);
    const isSelectedEthAccount = toRef(props.wallet, 'isSelectedEthAccount');

    const ersdlPriceUsd = computed(() => (
      formatToCurrency(props.account.eRSDL.price_usd)
    ));

    const balanceUsd = computed(() => {
      const { balance, eRSDL } = props.account;
      return +balance * eRSDL.price_usd;
    });

    const balance = computed(() => (
      formatToNumber(props.account.balance)
    ));

    const onTransaction = () => {
      const promise = transactionClaimRewards.btnAction();
      ctx.emit('close', promise);
    };

    return {
      isSelectedEthAccount,
      transaction,
      ersdlPriceUsd,
      balance,
      balanceUsd,

      onTransaction,
    };
  },
});
</script>

<style lang="scss">
.un-modal-claim {
  padding-bottom: 22px;

  &__token-price {
    margin-top: 5px;
    margin-bottom: 15px;
    font-size: 16px;
    font-weight: 600;
    line-height: 26px;
    color: #798dca;
    text-align: right;
  }

  &__title {
    width: 100%;
    font-size: 20px;
    font-weight: 600;
    line-height: 26px;
    text-align: center;
  }

  &__balance {
    margin-bottom: 20px;
    margin-left: 15px;

    @include media-lt(tablet) {
      margin-bottom: 50px;
    }
  }

  &__account-not-in-wallet {
    margin-top: 10px;
    font-size: 14px;
    color: $un-color-warning-notification;
    text-align: center;
  }
}
</style>
