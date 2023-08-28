<template>
  <div class="market-details-transaction-connect">
    <div
      class="market-details-transaction-connect__title"
      data-testid="connect-wallet-title"
      v-text="'Please connect a wallet'"
    />
    <div
      class="market-details-transaction-connect__description"
      data-testid="connect-wallet-description"
      v-text="'We are unable to show you any data until you connect your wallet'"
    />
    <UnBtn
      class="market-details-transaction-connect__wallet"
      data-testid="connect-wallet-button"
      square
      font-size="16px"
      :uppercase="false"
      @click="onConnect"
      v-text="'Connect Wallet'"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useCore } from '@/store';
import { useModalConnectWallet } from '@/components/modals';

import UnBtn from '@/components/ui/UnBtn.vue';


export default defineComponent({
  name: 'MarketDetailsTransactionConnect',
  components: {
    UnBtn,
  },
  setup() {
    const modalConnectWallet = useModalConnectWallet();
    const { wallet } = useCore();

    const onConnect = () => {
      void modalConnectWallet.show({ wallet: wallet.value });
    };

    return {
      onConnect,
    };
  },
});
</script>

<style lang="scss">
.market-details-transaction-connect {
  max-width: 350px;
  margin: 65px auto 0;
  font-weight: 600;
  color: #fff;
  text-align: center;

  &__title {
    font-size: 18px;
    font-weight: bold;
    line-height: 26px;

    @include media-gt(tablet) {
      font-size: 21px;
    }
  }

  &__description {
    margin-top: 21px;
    font-size: 14px;
    line-height: 21px;

    @include media-gt(tablet) {
      font-size: 16px;
      line-height: 24px;
    }
  }

  &__wallet {
    width: 175px;
    margin-top: 36px;
    margin-bottom: 80px;
  }
}
</style>
