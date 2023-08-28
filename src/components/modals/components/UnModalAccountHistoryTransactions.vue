<template>
  <div class="un-modal-account-history-transactions">
    <h5 class="un-modal-account-history-transactions__title">
      History
    </h5>

    <template v-for="item in txPendingHistory" :key="item.hash">
      <UnModalAccountHistoryTransaction
        :wallet="wallet"
        :tx="item"
        class="un-modal-account-history-transactions__el"
      />
    </template>

    <template v-for="item in txLastHistory" :key="item.hash">
      <UnModalAccountHistoryTransaction
        :wallet="wallet"
        :tx="item"
        class="un-modal-account-history-transactions__el"
      />
    </template>

    <UnLoaderCircle
      v-if="isLoading"
      class="un-modal-account-history-transactions__loader"
      medium
    />

    <div
      v-else-if="!txLastHistory.length && !txPendingHistory.length"
      class="un-modal-account-history-transactions__empty"
    >
      <img
        v-svg-inline
        :src="require('@/assets/images/icons/bubble.svg')"
        class="un-modal-account-history-transactions__empty-image"
      >
      <span class="un-modal-account-history-transactions__empty-text">
        No transaction yet
      </span>
    </div>
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line object-curly-newline
import { PropType, defineComponent, toRef, ref, watch } from 'vue';
import { Wallet } from '@/types/common.d';

import UnLoaderCircle from '@/components/ui/UnLoaderCircle.vue';
import UnModalAccountHistoryTransaction from './UnModalAccountHistoryTransaction.vue';


export default defineComponent({
  name: 'UnModalAccountHistoryTransactions',
  components: {
    UnLoaderCircle,
    UnModalAccountHistoryTransaction,
  },
  props: {
    wallet: {
      type: Object as PropType<Wallet>,
      required: true,
    },
  },
  setup: (props) => {
    const txLastHistory = toRef(props.wallet, 'txLastHistory');
    const txPendingHistory = toRef(props.wallet, 'txPendingHistory');

    const isLoading = ref(txLastHistory.value.length === 0);
    // const isLoading = true;
    void props.wallet.updateTx().finally(() => {
      isLoading.value = false;
    });

    watch([txPendingHistory], (value) => {
      if (!value.length) {
        void props.wallet.updateTx();
      }
    });

    return {
      isLoading,
      txLastHistory,
      txPendingHistory,
    };
  },
});
</script>

<style lang="scss">
.un-modal-account-history-transactions {
  &__title {
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: 600;
    line-height: 21px;
    color: #798dca;
  }

  &__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0 20px 0;
    font-size: 14px;
    font-weight: 500;
    line-height: 21px;
    color: #798dca;

    &-text {
      margin-left: 10px;
    }
  }

  &__loader {
    margin: 0 auto;
  }
}
</style>
